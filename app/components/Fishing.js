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
import PositionDisplay from './PositionDisplay';
import EventProductsEditor from './EventProductsEditor';
import {connect} from 'react-redux';
import moment from 'moment';
import Sexagesimal from 'sexagesimal';
import BlankMessage from './BlankMessage';

import {TextButton, IconButton} from './Buttons';
import {MasterToolbar, DetailToolbar} from './Toolbar';
import {colors, textStyles, iconStyles} from '../styles/styles';
import {
 plusBlue,
 plusGray,
} from '../icons/PngIcon';

import PositionProvider from '../utils/PositionProvider';
const positionProvider = new PositionProvider();

function getParsedPostion(){
  const pos = positionProvider.getPosition();
  if(!pos){
    return {lat: 0.123, lon: 0.123};
  }
  return {lat: pos.coords.latitude, lon: pos.coords.longitude};
}
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
    let position = getParsedPostion();
    //TODO alert if not position so you can type it in
    if(this.props.enableStartEvent){
      this.props.dispatch(fishingEventActions.startFishingEvent(this.props.gear, position));
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
          this.props.dispatch(fishingEventActions.endFishingEvent(this.props.lastEvent.id, getParsedPostion()));
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
                 renderMessage={this.renderMessage.bind(this)}
                 fishingEvent={this.props.viewingEvent}
                 editorType={'event'}
                 dispatch={this.props.dispatch}
                 />);
      case 1:
        if(!this.props.viewingEvent){
          return this.renderMessage("No shots to edit");
        }
        if(!this.props.viewingEvent.datetimeAtEnd){
          return this.renderMessage("Haul before adding catch");
        }
        console.log(this.props.viewingEvent.objectId, this.props.viewingEvent.id);
        return (<EventProductsEditor
                 fishingEvent={this.props.viewingEvent}
                 deletedProducts={this.props.deletedProducts}
                 products={this.props.viewingEvent.products}
                 dispatch={this.props.dispatch}
                 editorType={'event'}
                 orientation={this.props.orientation}
                 renderMessage={this.renderMessage.bind(this)}
                />);
      case 2:
        return (<EventGearEditor
                 renderMessage={this.renderMessage.bind(this)}
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
        centerTop={<PositionDisplay provider={positionProvider} />}
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
          center={<View style={{marginTop: 36}}><Text style={[textStyles.font, textStyles.midLabel]}>Fishing</Text></View>}
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
      orientation: state.view.orientation,
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
