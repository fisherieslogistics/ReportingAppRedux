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
import Icon8 from '../components/Icon8';
import {createForms} from '../utils/FormUtils';

const apiActions = new ApiActions();
const viewActions = new ViewActions();
const formActions = new FormActions();
const MAX_AUTOSUGGEST_RESULTS = 12;

class ReportingApp extends Component {

  constructor(props){
    super(props);
    this.state = {
      selectedTab: this.props.loggedIn ? (this.props.tripStarted ? "fishing" : "trip") : "settings",
    };
    apiActions.setUpClient(props.dispatch);
    this.SyncWorker = new SyncWorker(props.dispatch,
                                     props.store.getState,
                                     apiActions);
  }


  orientationDidChange(orientation) {
    this.props.dispatch(viewActions.orientation(orientation));
  }

  componentDidMount(){
    Orientation.addOrientationListener(this.orientationDidChange.bind(this));
    this.props.dispatch(viewActions.orientation(Orientation.getInitialOrientation()));
  }

  componentWillUnmount() {
    Orientation.removeOrientationListener(this.orientationDidChange.bind(this));
  }

  renderTabs(){

    const tabs = {
      "trip": {render: this.renderTrip.bind(this), icon: 'fishing-boat'},
      "fishing": {render: this.renderFishing.bind(this), icon: 'fishing'},
      "forms": {render: this.renderForms.bind(this), icon: 'form'},
      "settings": {render: this.renderProfile.bind(this), icon: 'settings'},
    }

    return Object.keys(tabs).map((key)=>{
      let selected = !!(this.state.selectedTab == key);
      return (
        <Icon8.TabBarItemIOS
          key={key}
          title={key.capitalize()}
          selected={selected}
          iconName={tabs[key].icon}
          selectedIconName={tabs[key].icon + '-filled'}
          hitSlop={{top: 20, left: 20, bottom: 20, right: 20}}
          style={{flex: 0.1}}
          onPress={() => {
            if(this.props.loggedIn){
              if(key === "forms"){
                let forms = createForms(this.props.fishingEvents, this.props.formType);
                this.props.dispatch(formActions.setViewingForm(forms[forms.length-1]));
              }
              setTimeout(() => {
                this.setState({
                  selectedTab: key
                });
              }, 100);
            }
          }}>
        {tabs[key].render()}
      </Icon8.TabBarItemIOS>);
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
    let forms = createForms(this.props.fishingEvents, this.props.formType);
    return (
      <View style={[styles.col, styles.fill]}>
        <Forms
          forms={forms}
        />
      </View>
    )
  }

  renderFishing(){
    return (
      <View style={[styles.col, styles.fill]}>
        <Fishing
          position={this.props.position}
          formType={this.props.formType}
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
          width={this.props.width}
        />
      </View>
    );
  }
}

const select = (State, dispatch) => {
    let state = State.default;
    let hasCatches = !!state.fishingEvents.events.find((fe) => {
      return fe.eventValid;
    });
    return {
      trip: state.trip,
      autoSuggestBar: state.view.autoSuggestBar,
      eventEmitter: state.uiEvents.eventEmitter,
      orientation: state.view.orientation,
      height: state.view.height,
      width: state.view.width,
      tripStarted: state.trip.started,
      loggedIn: state.auth.loggedIn,
      fishingEvents: state.fishingEvents.events,
      viewingForm: state.view.viewingForm,
      formType: state.me.formType,
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
