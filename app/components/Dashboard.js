'use strict';
import {
  StyleSheet,
  View,
  Text,
  AlertIOS,
  TouchableOpacity,
  ScrollView,
  TouchableHighlight,
  SegmentedControlIOS,
  TabBarIOS,
  TextInput,
  ListView,
  Dimensions
} from 'react-native';

import {connect} from 'react-redux';
import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import FishingEventActions from '../actions/FishingEventActions';
import FishingEventList from './FishingEventList';
import ProductEditor from './ProductEditor';
import FishingEventEditor from './FishingEventEditor';
import TripEditor from './TripEditor';
import Strings from '../constants/Strings';
import FormActions from '../actions/FormActions';
import FormView from './FormView.js';
import Toolbar from './Toolbar';
import LocationView from './LocationView';
import ProfileEditor from './ProfileEditor';

const strings = Strings.english;
const detailTabs = ["details", "catches", "custom"];
const masterTabs = ["trip", "fishing", "forms", "profile"];
const fishingEventActions = new FishingEventActions();
const formActions = new FormActions();

var {height, width} = Dimensions.get('window');

class Dashboard extends Component {
    constructor(props){
        super(props);
        this.state = {
          selectedTab: "trip",
          selectedDetail: 0,
          ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id}),
        };
    }

    getNextStage(){
      if(!this.props.fishingEvents.length){
        return 'start';
      }
      let fe = this.props.fishingEvents[this.props.fishingEvents.length -1];
      return fe.datetimeAtEnd ? 'start' : 'end';
    }

    renderContent(){
      return (<ProfileEditor />);
    }

    onPrimaryActionPress(){
      switch (this.getNextStage()) {
        case 'start':
          this.props.dispatch(fishingEventActions.startFishingEvent());
          break;
        case 'end':
          this.endFishingEvent();
          break;
        default:
      }
    }

    endFishingEvent(){
      if(!this.props.fishingEvents.length){
        return null;
      }
      AlertIOS.alert(
        strings.fishingEvents[this.props.fishingEventType].endingFishingEvent + "?",
        'Click Yes to save time and location haul',
        [
          {text: 'No', onPress: () => {
            return;
          }, style: 'cancel'},
          {text: 'Yes', onPress: () => {
            let fe = this.props.fishingEvents[this.props.fishingEvents.length -1];
            this.props.dispatch(fishingEventActions.endFishingEvent(fe.id));
          }}
        ]
      );
    }

    removeFishingEvent(){
      if(!this.props.fishingEvents.length){
        return null;
      }
      AlertIOS.alert(
        "Cancel",
        'Would you like to cancel the latest shot?',
        [
          {text: 'No', onPress: () => {
            return;
          }, style: 'cancel'},
          {text: 'Yes', onPress: () => {
            let fe = this.props.fishingEvents[this.props.fishingEvents.length -1];
            return this.props.dispatch(fishingEventActions.cancelFishingEvent(fe.id));
          }}
        ]
      );
    }

    getPrimaryActionColor(){
      switch (this.getNextStage()){
        case 'start':
          return "#2d74fa"
          break;
        case 'end':
          return "green"
          break;
      }
    }

    getPrimaryActionText(){
      switch (this.getNextStage()){
        case 'start':
          return strings.fishingEvents[this.props.fishingEventType].startFishingEvent;
          break;
        case 'end':
          return strings.fishingEvents[this.props.fishingEventType].endFishingEvent;
          break;
      }
    }

    getSecondaryActionColor(){
      return this.props.fishingEvents.length ? "red" : "grey";
    }

    getPrimaryActionIcon(){
      return false  ? "arrow-circle-up" : "arrow-circle-down";
    }

    renderTripEditor(){
      return (<TripEditor
                ds={this.state.ds}
              />);
    }

    renderForms(){
      return (<FormView
                formResources={this.props.formResources}
                fishingEvents={this.props.fishingEvents}
              />);
    }

    renderTabs(){
      const tabs = [
        {iconName: "anchor", title: "Trip", selectedTab: masterTabs[0], render: this.renderTripEditor.bind(this), preStartTrip: true},
        {iconName: "ship", title: "Fishing", selectedTab: masterTabs[1], render: this.renderCatches.bind(this), preStartTrip: false},
        {iconName: "wpforms", title: "Forms", selectedTab: masterTabs[2],
         render: this.renderForms.bind(this), preStartTrip: true, onPress: () => {
             this.props.dispatch(formActions.showingForms(this.props.formResources, this.props.fishingEvents));
         }},
        {iconName: "user", title: "Profile", selectedTab: masterTabs[3], render: this.renderContent.bind(this), preStartTrip: true},
      ]
      return tabs.map((tab)=>{
        if(!(this.props.tripStarted || tab.preStartTrip)){
          return;
        }
        return (<Icon.TabBarItemIOS
                  style={styles.toEdges}
                  key={tab.selectedTab}
                  iconName={tab.iconName}
                  selectedIconName={tab.iconName}
                  title={tab.title}
                  selected={this.state.selectedTab === tab.selectedTab}
                  onPress={() => {
                    if(tab.onPress){
                      tab.onPress();
                    }
                    this.setState({
                      selectedTab: tab.selectedTab
                    });
                  }}>
                  <View>
                    {tab.render()}
                  </View>
                </Icon.TabBarItemIOS>);
      });
    }

    renderSelectedDetailView(){
      switch (this.state.selectedDetail) {
        case 0:
          return (<FishingEventEditor />);
        break;
        case 1:
          return this.props.viewingFishingEventId ? (<ProductEditor />) : null;
        break;
        case 2:
          return (<View></View>);
        break;
      }
    }

    renderToolBar(){
      let primaryProps = {
        onPress: this.onPrimaryActionPress.bind(this),
        iconName: this.getPrimaryActionIcon(),
        color: this.getPrimaryActionColor(),
        text: this.getPrimaryActionText()
      };
      let secondaryProps = {
        onPress: this.removeFishingEvent.bind(this),
        iconName: "check-circle-o",
        color: this.getSecondaryActionColor(),
        text: "Cancel"
      }
      return (<Toolbar
                primaryButton={primaryProps}
                secondaryButton={secondaryProps}
                infoPanel={(<LocationView />)}
              />);
    }

    renderDetailView(){
      return(<View style={[styles.detailView]}>
              <SegmentedControlIOS
                values={detailTabs}
                selectedIndex={this.state.selectedDetail}
                onChange={({nativeEvent}) => {
                  this.setState({selectedDetail: nativeEvent.selectedSegmentIndex});
                }} />
                <View style={{padding: 10, paddingTop: 15}}>
                  <View>
                    <Text style={styles.heading}>{this.props.viewingFishingEventId ? "Editing Event: " + this.props.viewingFishingEventId : ""}</Text>
                  </View>
                  <View>
                    {this.renderSelectedDetailView()}
                  </View>
                </View>
            </View>);
    }

    renderMasterView(){
      return (
        <View style={[styles.masterView]}>
          <FishingEventList
            dispatch={this.props.dispatch}
            fishingEvents={this.state.ds.cloneWithRows([...this.props.fishingEvents].reverse())}
            fishingEventType={this.props.fishingEventType}
            selectedId={this.props.viewingFishingEventId}
          />
      </View>);
    }

    renderCatches() {
      return (
        <View style={styles.toEdges}>
          <View style={[styles.toolbarWrapper, {width: width}]}>
            {this.renderToolBar.bind(this)()}
          </View>
          <View style={[styles.masterDetailView, {width: width}]}>
            {this.renderMasterView.bind(this)()}
            {this.renderDetailView.bind(this)()}
          </View>
        </View>
      );
    }

    render () {
      return (
        <TabBarIOS
          unselectedTintColor="#ccc"
          tintColor="white"
          barTintColor="#2d74fa">
          {this.renderTabs.bind(this)()}
        </TabBarIOS>
      );
    }
};

const styles = StyleSheet.create({
  heading: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  toEdges:{
    position: 'absolute',
    left: 0,
    top: 0
  },
  toolbarWrapper: {
    height: 100,
    flex: 1,
    paddingTop: 10,
    flexDirection: 'row'
  },
  masterDetailView: {
    flex: 1,
    paddingTop: 5,
    flexDirection: 'row'
  },
  textBase: {
    color: '#333333',
  },

  buttonWrapper: {
    marginRight: 15,
  },

  masterView: {
    flex: 0.28,
    alignItems: 'flex-start',
    paddingTop: 10
  },

  detailView: {
    flex: 0.72,
    margin: 15
  },
});

const select = (State, dispatch) => {
    let state = State.default;
    return {
      fishingEvents: state.fishingEvents.events,
      viewingFishingEventId: state.view.viewingFishingEventId,
      fishingEventType: state.me.user.fishingEventType,
      ports: state.me.ports,
      tripStarted: state.trip.started,
      formResources: {trip: state.trip, user: state.me.user, vessel: state.me.vessel}
    };
}

export default connect(select)(Dashboard);
