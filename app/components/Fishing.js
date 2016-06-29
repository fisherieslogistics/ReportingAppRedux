'use strict';
import {
  View,
  ListView,
  AlertIOS,
  SegmentedControlIOS,
  Text
} from 'react-native';
import React, { Component } from 'react';
import EventDetailEditor from './EventDetailEditor';
import FishingEventList from './FishingEventList';
import MasterDetailView from './MasterDetailView';
import FishingEventActions from '../actions/FishingEventActions';
import FishingEventCustomEditor from './FishingEventCustomEditor';
import DetailToolbar from  './DetailToolbar';
import MasterToolbar from './MasterToolbar';
import EventProductsEditor from './EventProductsEditor';

import {connect} from 'react-redux';
import moment from 'moment';

const detailTabs = ["details", "catches", "custom"];
const fishingEventActions = new FishingEventActions();

class Fishing extends React.Component{
  constructor (props){
    super(props);
    this.state = {
      ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id}),
      selectedDetail: 1
    };
  }

  startFishingEvent(){
    this.props.dispatch(fishingEventActions.startFishingEvent());
  }

  commitFishingEvents(){
    AlertIOS.alert(
      'Commit Fishing',
      'Click OK to confirm that all data is correct this will sign any unsigned forms',
      [
        {text: 'Cancel', onPress: () => {}, style: 'cancel'},
        {text: 'OK', onPress: () => {}}
      ]
    );
  }

  endFishingEvent(){
    if(!this.props.fishingEvents.length){
      return null;
    }
    AlertIOS.alert(
      "Hauling",
      'Touch yes to confirm',
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
      'Cancel the latest shot?',
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

  onChangeText(name, value) {
      this.props.dispatch(
        fishingEventActions.setfishingEventValue(this.props.fishingEvent.id, name, value));
  }

  setViewingFishingEvent(fishingEvent){
    this.props.dispatch(fishingEventActions.setViewingFishingEvent(fishingEvent.id));
  }

  onNonFishChange(name, value){
    if(value){
      AlertIOS.alert(
        'Non Fish are you sure?',
        'You will need to fill out a Non Fish Protected Species Form in you form book',
        [
          {text: 'Cancel', onPress: () => {this.onChangeText(name, false)}, style: 'cancel'},
          {text: 'OK', onPress: () => {this.onChangeText(name, true)}}
        ]
      );
    }else{
      this.onChangeText(name, false);
    }
  }

  selectedDetailView(){
    switch (this.state.selectedDetail) {
      case 0:
        return (<EventDetailEditor
                 fishingEvent={this.props.fishingEvent}
                 editorType={'event'}
                 dispatch={this.props.dispatch}
                 />);
      break;
      case 1:
        return (<EventProductsEditor
                 fishingEvent={this.props.fishingEvent}
                 dispatch={this.props.dispatch}
                 editorType={'event'}
                />);
      break;
      case 2:
        return (<FishingEventCustomEditor
                 dispatch={this.props.dispatch}
                 fishingEvent={this.props.fishingEvent}
                />);
      break;
    }
  }

  renderSegementedControl(){
    return (
      <SegmentedControlIOS
        values={detailTabs}
        selectedIndex={this.state.selectedDetail}
        style={styles.detailSelector}
        onChange={({nativeEvent}) => {
          this.setState({selectedDetail: nativeEvent.selectedSegmentIndex});
        }}
      />);
  }

  renderDetailView(){
    return(<View style={[styles.detailView, styles.col]}>
              <View style={[styles.row]}>
                  {this.selectedDetailView()}
              </View>
          </View>);
  }

  render(){
    let detailToolbar = (
      <DetailToolbar
        left={{color: "red", text: "Delete", onPress: this.removeFishingEvent.bind(this)}}
        right={{color: "#007aff", text: "End", onPress: this.endFishingEvent.bind(this)}}
        centerTop={<Text>{this.props.fishingEvent ? this.props.fishingEvent.id : null}</Text>}
        centerBottom={this.renderSegementedControl()}
      />
    );
    let masterToolbar = (
      <MasterToolbar
        left={{color: "#007aff", text: "Commit", onPress: this.commitFishingEvents.bind(this)}}
        right={{color: "#007aff", text: "Plus", onPress: this.startFishingEvent.bind(this)}}
      />
    )
    return (
      <MasterDetailView
        master={<FishingEventList
                  fishingEvents={this.state.ds.cloneWithRows([...this.props.fishingEvents].reverse())}
                  onPress={this.setViewingFishingEvent.bind(this)}
                  selectedFishingEvent={this.props.fishingEvent}
                />}
        detail={this.renderDetailView.bind(this)()}
        detailToolbar={detailToolbar}
        masterToolbar={masterToolbar}
      />
    );
  }
};

const styles = {
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
  detailSelector:{
    width: 260,
    height: 25,
    alignSelf: 'center'
  }
}

const select = (State, dispatch) => {
    let state = State.default;
    return {
      fishingEvent: state.fishingEvents.events[state.view.viewingFishingEventId - 1],
      fishingEvents: state.fishingEvents.events,
      fishingEventType: "tcer"
    };
}

export default connect(select)(Fishing);
