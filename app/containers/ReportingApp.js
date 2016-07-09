'use strict';
import {
  View,
  TabBarIOS,
  StyleSheet,
  Dimensions,
} from 'react-native';
import React, { Component } from 'react';
import Fishing from '../components/Fishing';
import Profile from '../components/Profile';
import Forms from '../components/FormView';
import {connect} from 'react-redux';
import AutoSuggestBar from '../components/AutoSuggestBar';
import Orientation from 'react-native-orientation';
import ViewActions from '../actions/ViewActions';
import FormActions from '../actions/FormActions';
import ApiActions from '../actions/ApiActions';
import Trip from '../components/Trip';
import SyncWorker from '../api/SyncWorker';
import ShadowStyle from '../styles/shadow';

import {fishing,
        fishingBlue,
        waterTransportLight,
        waterTransport,
        form,
        user} from '../icons/PngIcon';

const apiActions = new ApiActions();
const viewActions = new ViewActions();
const formActions = new FormActions();
const MAX_AUTOSUGGEST_RESULTS = 12;

class ReportingApp extends Component {

  constructor(props){
    super(props);
    this.state = {
      selectedTab: this.props.tripStarted ? "fishing" : "trip"
    };
    apiActions.setUpClient(props.dispatch);
    this.SyncWorker = new SyncWorker(props.dispatch,
                                     props.store.getState,
                                     apiActions);
  }

  componentWillReceiveProps(props){
    console.log("reporting app", props);
  }

  _orientationDidChange(orientation) {
    this.props.dispatch(viewActions.uiOrientation(orientation));
  }

  componentDidMount(){
    this.props.dispatch(viewActions.uiOrientation(Orientation.getInitialOrientation()));
    Orientation.addOrientationListener(this._orientationDidChange.bind(this));
  }

  componentWillUnmount() {
    Orientation.removeOrientationListener(this._orientationDidChange.bind(this));
  }

  renderTabs(){

    const tabs = {
      "trip": {render: this.renderTrip.bind(this), icon: waterTransportLight},
      "fishing": {render: this.renderFishing.bind(this), icon: fishing},
      "forms": {render: this.renderForms.bind(this), icon: form},
      "profile": {render: this.renderProfile.bind(this), icon: user},
    }

    return Object.keys(tabs).map((key)=>{
      let selected = !!(this.state.selectedTab == key);
      return (<TabBarIOS.Item
                key={key}
                title={key.capitalize()}
                selected={selected}
                icon={tabs[key].icon}
                hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}
                style={{flex: 0.1}}
                onPress={() => {
                  if(key === "forms"){
                    this.props.dispatch(formActions.setViewingForm(null));
                  }
                  this.setState({
                    selectedTab: key
                  });
                }}>
                {tabs[key].render()}
              </TabBarIOS.Item>);
    });
  }


  renderProfile(){
    return (
      <View style={[styles.col, styles.fill]}>
        <Profile
          apiActions={apiActions}
          dispatch={this.props.dispatch}
          styles={styles}
        />
      </View>
    )
  }

  renderTrip(){
    return (
      <View style={[styles.col, styles.fill]}>
        <Trip
          position = {this.props.position}
        />
      </View>
    )
  }

  renderForms(){
    return (
      <View style={[styles.col, styles.fill]}>
        <Forms />
      </View>
    )
  }

  renderFishing(){
    return (
      <View style={[styles.col, styles.fill]}>
        <Fishing
          position={this.props.position}
        />
      </View>
    )
  }

  render(){
    return (
      <View style={[styles.wrapper, {width: this.props.width, height: this.props.height}]}>
        <TabBarIOS
          unselectedTintColor="#bbbbbb"
          tintColor="#007aff"
          barTintColor="#F9F9F9"
          style={{flex: 1}}
        >
            {this.renderTabs.bind(this)()}
        </TabBarIOS>
        <AutoSuggestBar
          eventEmitter={this.props.eventEmitter}
          visible={this.props.autoSuggestBar.uivisible}
          favourites={this.props.autoSuggestBar.favourites}
          choices={this.props.autoSuggestBar.choices}
          favouritesChangedAt={this.props.autoSuggestBar.favouritesChangedAt}
          name={this.props.autoSuggestBar.name}
          text={this.props.autoSuggestBar.text}
          maxResults={MAX_AUTOSUGGEST_RESULTS}
          inputId={this.props.autoSuggestBar.inputId}
        />
      </View>
    );
  }
}

const select = (State, dispatch) => {
    let state = State.default;
    let hasCatches = !!state.fishingEvents.events.find((fe) => {
      return fe.productsValid;
    });
    return {
      trip: state.trip,
      autoSuggestBar: state.view.autoSuggestBar,
      eventEmitter: state.uiEvents.eventEmitter,
      uiOrientation: state.view.uiOrientation,
      height: state.view.height,
      width: state.view.width,
      tripStarted: state.trip.started
    };
}

const styles = StyleSheet.create({
  wrapper: {
    left: 0,
    top: 0
  },
  toEdges:{
    position: 'absolute',
    left: 0,
    bottom: 0,
  },
  fill:{
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    flex: 1
  },
  detailView: {
    padding: 0,
  },
  col: {
    flexDirection: 'column',
    flex: 1
  },
  row: {
    flexDirection: 'row',
    flex: 1,
  },
});

export default connect(select)(ReportingApp)
