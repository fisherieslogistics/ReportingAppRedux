'use strict';
import {
  View,
  TabBarIOS,
  StyleSheet,
  Dimensions,
} from 'react-native';
import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import Fishing from '../components/Fishing';
import Forms from '../components/FormView';
import {connect} from 'react-redux';
import AutoSuggestBar from '../components/AutoSuggestBar';
import Orientation from 'react-native-orientation';
import ViewActions from '../actions/ViewActions';
import FormActions from '../actions/FormActions';

const viewActions = new ViewActions();
const formActions = new FormActions();
const MAX_AUTOSUGGEST_RESULTS = 12;

class ReportingApp extends Component {

  constructor(props){
    super(props);
    this.state = {
      selectedTab: "forms",
    }
  }

  _orientationDidChange(orientation) {
    this.props.dispatch(viewActions.uiOrientation(orientation));
  }

  componentDidMount(){
    this.props.dispatch(viewActions.uiOrientation(Orientation.getInitialOrientation()));
    Orientation.addOrientationListener(this._orientationDidChange.bind(this));
  }

  componentWillUnmount() {
    Orientation.getOrientation((err,orientation)=> {
      console.log("Current Device Orientation: ", orientation);
    });
    Orientation.removeOrientationListener(this._orientationDidChange.bind(this));
  }

  renderTabs(){
    const tabs = [
      {iconName: "anchor", title: "trip", selectedTab: "ship", render: this.renderTrip.bind(this)},
      {iconName: "ship", title: "fishing", selectedTab: "fishing", render: this.renderFishing.bind(this)},
      {iconName: "tasks", title: "forms", selectedTab: "forms", render: this.renderForms.bind(this),
        onPress: () => {
          console.log("beast");
         this.props.dispatch(formActions.setViewingForm(null));
        }},
      {iconName: "user", title: "profile", selectedTab:"profile", render: this.renderFishing.bind(this)}
    ];
    return tabs.map((tab)=>{
      return (<Icon.TabBarItemIOS
                style={styles.toEdges}
                key={tab.selectedTab}
                iconName={tab.iconName}
                selectedIconName={tab.iconName}
                title={tab.title}
                iconSize={22}
                selected={this.state.selectedTab === tab.selectedTab}
                onPress={() => {
                  if(tab.onPress){
                    tab.onPress();
                  }
                  this.setState({
                    selectedTab: tab.selectedTab
                  });
                }}>
                {tab.render()}
              </Icon.TabBarItemIOS>);
    });
  }


  renderProfile(){
    return (
      <View style={[styles.col]}>
            <Fishing />
      </View>
    )
  }

  renderTrip(){
    return (
      <View style={[styles.col]}>
            <Fishing />
      </View>
    )
  }

  renderForms(){
    return (
      <View style={[styles.col]}>
            <Forms />
      </View>
    )
  }

  renderFishing(){
    return (
      <Fishing />
    )
  }

  render(){
    return (
      <View style={[styles.wrapper, {width: this.props.width, height: this.props.height}]}>
        <TabBarIOS
          unselectedTintColor="#bbbbbb"
          tintColor="#007aff"
          barTintColor="#F9F9F9"
        >
          {this.renderTabs.bind(this)()}
        </TabBarIOS>
        <AutoSuggestBar
          eventEmitter={this.props.eventEmitter}
          visible={this.props.autoSuggestBar.visible}
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
    return {
      autoSuggestBar: state.view.autoSuggestBar,
      eventEmitter: state.uiEvents.eventEmitter,
      uiOrientation: state.view.uiOrientation,
      height: state.view.height,
      width: state.view.width
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
});

export default connect(select)(ReportingApp)
