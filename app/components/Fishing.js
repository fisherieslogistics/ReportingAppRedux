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
import Icon8 from './Icon8';

const fishingEventActions = new FishingEventActions();

class Fishing extends React.Component{
  constructor (props){
    super(props);
    this.state = {
      ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id}),
      selectedDetail: props.fishingEvents ? 0 : 2
    };
  }

  getCurrentLocation(){
    let pos = this.props.positionProvider.getPosition()
    let parsedPos;

    if(pos && pos.coords){
      parsedPos = {
        lat: pos.coords.latitude,
        lon: pos.coords.longitude
      }
    }else{
      AlertIOS.alert("No location fix - please remember to edit the location");
    }

    return parsedPos;
  }

  startFishingEvent(){
    const pos = this.getCurrentLocation();
    
    if(this.props.formType == 'tcer'){
      this.startEvent(pos);
    }else{
      this.startLCEREvent(pos);
    }
  }

  startEvent(position){
    //TODO alert if not position so you can type it in
    if(this.props.enableStartEvent){
      this.props.dispatch(fishingEventActions.startFishingEvent(position));
    }
  }

  startLCEREvent(position){
    AlertIOS.alert(
      'Start new Set',
      'Click OK to confirm that you are starting a new set',
      [
        {text: 'Cancel', onPress: () => {}, style: 'cancel'},
        {text: 'OK', onPress: () => {
          this.startEvent(position);
        }}
      ]
    );
  }

  endTCEREvent(position){
    AlertIOS.alert(
          "Hauling",
          'Touch yes to confirm - you cannot delete a shot after you haul it.',
          [
            {text: 'No', onPress: () => {
              return;
            }, style: 'cancel'},
            {text: 'Yes', onPress: () => {
              this.props.dispatch(fishingEventActions.endFishingEvent(this.props.lastEvent.id, position));
            }}
          ]
        );
  }

  endLCEREvent(position){
    AlertIOS.alert(
          "Hauling Set " + this.props.viewingEvent.id,
          "Touch yes to confirm - you are hauling set " + this.props.viewingEvent.id,
          [
            {text: 'No', onPress: () => {
              return;
            }, style: 'cancel'},
            {text: 'Yes', onPress: () => {
              this.props.dispatch(fishingEventActions.endFishingEvent(this.props.viewingEvent.id, position));
            }}
          ]
        );
  }

  endFishingEvent(){
    if(!this.props.lastEvent){
      return;
    }
    const pos = this.getCurrentLocation();
    if(this.props.formType == 'tcer'){
      this.endTCEREvent(pos);
    }else{
      this.endLCEREvent(pos);
    }
  }

  removeFishingEvent(){
    if(!this.props.lastEvent){
      return;
    }
    //if longline remove the viewing event;

    AlertIOS.alert(
      "Delete",
      'Delete the latest shot?',
      [
        {text: 'Cancel', onPress: () => {
          return;
        }, style: 'cancel'},
        {text: 'Delete', onPress: () => {
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
    if(!this.props.viewingEvent){
      return this.renderMessage("No shots to edit");
    }
    if(this.props.viewingEvent.signature){
      return this.renderMessage("This shot has been signed and cannot be edited");
    }
    switch (this.state.selectedDetail){
      case 0:
        return (<EventDetailEditor
                 renderMessage={this.renderMessage.bind(this)}
                 fishingEvent={this.props.viewingEvent}
                 editorType={'event'}
                 dispatch={this.props.dispatch}
                 formType={this.props.formType}
                 />);
      case 1:
        if(!this.props.viewingEvent.datetimeAtEnd){
          return this.renderMessage("Haul before adding catch");
        }
        return (<EventProductsEditor
                 fishingEvent={this.props.viewingEvent}
                 deletedProducts={this.props.deletedProducts}
                 products={this.props.viewingEvent.products}
                 dispatch={this.props.dispatch}
                 editorType={'event'}
                 orientation={this.props.orientation}
                 renderMessage={this.renderMessage.bind(this)}
                 containerChoices={this.props.containerChoices}
                />);
      case 2:
        return (<EventGearEditor
                 renderMessage={this.renderMessage.bind(this)}
                 dispatch={this.props.dispatch}
                 fishingEvent={this.props.viewingEvent}
                 formType={this.props.formType}
                />);
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
      fishingEvents={this.state.ds.cloneWithRows([...this.props.fishingEvents || []].reverse())}
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
    let deleteActive = this.props.lastEvent && (!this.props.lastEvent.datetimeAtEnd);
    return(
      <DetailToolbar
        left={{color: colors.red, text: "Delete", onPress: this.removeFishingEvent.bind(this), enabled: deleteActive}}
        right={{color: colors.blue, text: "Haul", onPress: this.endFishingEvent.bind(this), enabled: this.props.enableHaul}}
        centerTop={<PositionDisplay provider={this.props.positionProvider} />}
        centerBottom={this.renderSegementedControl()}
      />
    );
  }

  getMasterToolbar(){
    let startEventButton = {
        icon: 'plus-math',
        color: this.props.enableStartEvent ? colors.blue : colors.gray,
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
        master={this.renderFishingEventLists()/* : this.renderMessage(this.props.tripStarted ? "Trip Started" : "Trip Hasn\'t Started")*/}
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
      orientation: state.view.orientation,
      height: state.view.height,
      tripStarted: state.trip.started,
      enableStartEvent: state.trip.started,
      containerChoices: state.me.containers,
      positionProvider: state.uiEvents.uipositionProvider,
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
    if(state.me.formType == 'tcer'){
      props.enableStartEvent = state.trip.started && ((!lastEvent) || lastEvent.datetimeAtEnd);
      props.enableHaul = lastEvent && (!lastEvent.datetimeAtEnd);
    }else{
      props.enableHaul = props.viewingEvent && (!props.viewingEvent.datetimeAtEnd);
    }
    return props;
}

export default connect(select)(Fishing);
