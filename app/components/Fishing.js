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

import {MasterToolbar, DetailToolbar} from './Toolbar';
import {colors, textStyles} from '../styles/styles';
import {
 plusBlue,
 plusGray,
} from '../icons/PngIcon';

const detailTabs = ["details", "catches", "gear"];
const fishingEventActions = new FishingEventActions();

class Fishing extends React.Component{
  constructor (props){
    super(props);
    this.state = {
      ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id}),
      selectedDetail: 0
    };
  }

  startFishingEvent(){
    if(this.props.canStartEvent){
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
          this.props.dispatch(fishingEventActions.setViewingFishingEvent(null));
          return this.props.dispatch(fishingEventActions.cancelFishingEvent(fe.id));
        }}
      ]
    );
  }

  setViewingFishingEvent(fishingEvent){
    this.props.dispatch(fishingEventActions.setViewingFishingEvent(fishingEvent.id));
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
        return (<EventGearEditor
                 dispatch={this.props.dispatch}
                 fishingEvent={this.props.fishingEvent}
                 isLatestEvent={this.props.isLatestEvent}
                 gear={this.props.gear}
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

  renderIconButton(icon, active, style, onPress){
    return (
      <TouchableOpacity
        activeOpacity={active ? 1 : 0.5}
        onPress={onPress} style={{}}>
        <Image style={style} source={icon}/>
      </TouchableOpacity>
    );
  }

  render(){
    let startEventIcon = this.props.canStartEvent ? plusBlue : plusGray;
    let startEventButton = this.renderIconButton(startEventIcon,
                                  this.props.canStartEvent,
                                  {width: 52, height: 52, marginTop: 10, marginRight: 0},
                                  this.startFishingEvent.bind(this));

    let haulColor = this.props.canStartEvent ? colors.midGray : colors.blue;
    let cancelColor = this.props.canStartEvent ? colors.midGray : colors.red;
    let detailToolbar = (
      <DetailToolbar
        left={{color: cancelColor, text: "Cancel", onPress: this.removeFishingEvent.bind(this)}}
        right={{color: haulColor, text: "Haul", onPress: this.removeFishingEvent.bind(this)}}
        centerTop={<Text style={[textStyles.font, textStyles.darkLabel]}>{this.props.fishingEvent ? this.props.fishingEvent.id : null}</Text>}
        centerBottom={this.renderSegementedControl()}
      />
    );
    let masterToolbar = (
      <MasterToolbar
        center={<View style={{marginTop: 27}}><Text style={[textStyles.font, textStyles.darkLabel]}>Fishing</Text></View>}
        right={{icon :startEventButton}}
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
    let fEvents = state.fishingEvents.events;
    let isLatestEvent = state.viewingFishingEventId && (state.viewingFishingEventId === state.fishingEvents.length);
    let canStartEvent = (fEvents.length === 0) || (fEvents[fEvents.length -1].datetimeAtEnd !== null);
    return {
      fishingEvent: fEvents[state.view.viewingFishingEventId - 1],
      fishingEvents: fEvents,
      fishingEventType: "tcer",
      gear: state.gear,
      canStartEvent: canStartEvent,
      isLatestEvent: isLatestEvent,
    };
}

export default connect(select)(Fishing);
