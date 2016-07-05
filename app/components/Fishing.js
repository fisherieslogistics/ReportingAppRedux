'use strict';
import {
  View,
  ListView,
  AlertIOS,
  SegmentedControlIOS,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import React, { Component } from 'react';
import EventDetailEditor from './EventDetailEditor';
import FishingEventList from './FishingEventList';
import MasterDetailView from './MasterDetailView';
import FishingEventActions from '../actions/FishingEventActions';
import EventGearEditor from './EventGearEditor';
import EventProductsEditor from './EventProductsEditor';
import {connect} from 'react-redux';
import moment from 'moment';
import BlankMessage from './BlankMessage';

import {addToKeyStore, addToQueue} from '../actions/SyncActions';
import {TextButton, IconButton} from './Buttons';
import {MasterToolbar, DetailToolbar} from './Toolbar';
import {colors, textStyles, iconStyles} from '../styles/styles';
import {
 plusBlue,
 plusGray,
} from '../icons/PngIcon';

const fishingEventActions = new FishingEventActions();

class Fishing extends React.Component{
  constructor (props){
    super(props);
    this.state = {
      ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id}),
      selectedDetail: props.fishingEvents ? 0 : 2
    };
  }

  startFishingEvent(){
    if(this.props.enableStartEvent){
      this.props.dispatch(fishingEventActions.startFishingEvent(this.props.gear));
    }
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
    if(!this.props.lastEvent){
      return;
    }
    AlertIOS.alert(
      "Hauling",
      'Touch yes to confirm',
      [
        {text: 'No', onPress: () => {
          return;
        }, style: 'cancel'},
        {text: 'Yes', onPress: () => {
          this.props.dispatch(fishingEventActions.endFishingEvent(this.props.lastEvent.id));
        }}
      ]
    );
  }

  removeFishingEvent(){
    if(!this.props.lastEvent){
      return;
    }
    //if longline remove the viewing event;

    AlertIOS.alert(
      "Cancel",
      'Cancel the latest shot?',
      [
        {text: 'No', onPress: () => {
          return;
        }, style: 'cancel'},
        {text: 'Yes', onPress: () => {
          this.props.dispatch(fishingEventActions.setViewingFishingEvent(null));
          return this.props.dispatch(fishingEventActions.cancelFishingEvent(this.props.lastEvent.id));
        }}
      ]
    );
  }

  setViewingFishingEvent(fishingEvent){
    this.props.dispatch(fishingEventActions.setViewingFishingEvent(fishingEvent.id));
  }

  selectedDetailView(){
    switch (this.state.selectedDetail){
      case 0:
        return (<EventDetailEditor
                 fishingEvent={this.props.viewingEvent}
                 editorType={'event'}
                 dispatch={this.props.dispatch}
                 />);
      case 1:
        if(!this.props.viewingEvent || !this.props.viewingEvent.datetimeAtEnd){
          return this.renderMessage("Haul before adding catch");
        }
        return (<EventProductsEditor
                 fishingEvent={this.props.viewingEvent}
                 deletedProducts={this.props.deletedProducts}
                 products={this.props.viewingEvent.products}
                 dispatch={this.props.dispatch}
                 editorType={'event'}
                 uiOrientation={this.props.uiOrientation}
                 renderMessage={this.renderMessage.bind(this)}
                />);
      case 2:
        return (<EventGearEditor
                 dispatch={this.props.dispatch}
                 fishingEvent={this.props.viewingEvent}
                 lastEvent={this.props.lastEvent}
                 gear={this.props.gear}
                />);
      break;
    }
  }

  renderSegementedControl(){
    return (
      <SegmentedControlIOS
        values={["details", "catches", "gear"]}
        selectedIndex={this.state.selectedDetail}
        enabled={!!this.props.fishingEvents}
        style={styles.detailSelector}
        onChange={({nativeEvent}) => {
          this.setState({selectedDetail: nativeEvent.selectedSegmentIndex});
        }}
      />);
  }

  renderDetailView(){
    return(
      <View style={[styles.detailView, styles.col]}>
        <View style={[styles.row]}>
          {this.selectedDetailView()}
        </View>
    </View>);
  }

  renderFishingEventLists(){
    return (<FishingEventList
      fishingEvents={this.state.ds.cloneWithRows([...this.props.fishingEvents].reverse())}
      onPress={this.setViewingFishingEvent.bind(this)}
      selectedFishingEvent={this.props.viewingEvent}
    />);
  }

  renderMessage(message){
    return (
      <BlankMessage
        text={message}
        height={this.props.height}
      />);
  }

  getDetailToolbar(){
    let deleteActive = (this.props.fishingEvents && this.props.fishingEvents.length);
    return(
      <DetailToolbar
        left={{color: colors.red, text: "Delete", onPress: this.removeFishingEvent.bind(this), enabled: deleteActive}}
        right={{color: colors.blue, text: "Haul", onPress: this.endFishingEvent.bind(this), enabled: this.props.enableHaul}}
        centerTop={<Text style={[textStyles.font, textStyles.midLabel]}>{this.props.viewingEvent ? this.props.viewingEvent.id : null}</Text>}
        centerBottom={this.renderSegementedControl()}
      />
    );
  }

  getMasterToolbar(){
    let icon = this.props.enableStartEvent ? plusBlue : plusGray;
    let startEventButton = {
        icon:icon,
        onPress:this.startFishingEvent.bind(this),
        enabled:this.props.enableStartEvent,
    };
    return(
        <MasterToolbar
          center={<View style={{marginTop: 27}}><Text style={[textStyles.font, textStyles.midLabel]}>Fishing</Text></View>}
          right={startEventButton}
        />
      );
  }

  render(){

    return (
      <MasterDetailView
        master={this.props.fishingEvents ? this.renderFishingEventLists() : this.renderMessage(this.props.tripStarted ? "Trip Started" : "Trip Hasn\'t Started")}
        detail={this.renderDetailView.bind(this)()}
        detailToolbar={this.getDetailToolbar()}
        masterToolbar={this.getMasterToolbar()}
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
    let props = {
      fishingEventType: "tcer",
      gear: state.gear,
      uiOrientation: state.view.uiOrientation,
      height: state.view.height,
      tripStarted: state.trip.started,
      enableStartEvent: state.trip.started,
    }
    if(!state.fishingEvents.events.length){
      return props;
    }
    let fEvents = state.fishingEvents.events;
    let lastEvent = fEvents[fEvents.length -1];
    props.lastEvent = lastEvent;
    props.viewingEvent = fEvents[state.view.viewingEventId -1];
    props.fishingEvents = fEvents;
    props.deletedProducts = state.fishingEvents.deletedProducts[state.view.viewingEventId];
    props.enableStartEvent = state.trip.started && ((!lastEvent) || lastEvent.datetimeAtEnd);
    props.enableHaul = lastEvent && (!lastEvent.datetimeAtEnd);
    return props;
}

export default connect(select)(Fishing);
