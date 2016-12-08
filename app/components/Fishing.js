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
import MasterDetailView from './layout/MasterDetailView';
import FishingEventActions from '../actions/FishingEventActions';
import EventGearEditor from './EventGearEditor';
import PositionDisplay from './PositionDisplay';
import EventProductsEditor from './EventProductsEditor';
import { connect } from 'react-redux';
import moment from 'moment';
import Sexagesimal from 'sexagesimal';
import PlaceholderMessage from './common/PlaceholderMessage';
import { LongButton } from './common/Buttons';

import ProductActions from '../actions/ProductActions';
import { TextButton } from './common/Buttons';
import { MasterToolbar, DetailToolbar } from './layout/Toolbar';
import { colors, textStyles, iconStyles, masterDetailStyles } from '../styles/styles';
import Icon8 from './common/Icon8';
import UnsoughtCatch from './UnsoughtCatch';
const fishingEventActions = new FishingEventActions();

const segMents = ["details", "catches"]/*, "discards", "Accident", "protecteds"];*/
//TODO optional discard etc
const productActions = new ProductActions();

const toBind = [
  'endFishingEvent',
  'startFishingEvent',
  'renderDetailView',
  'removeFishingEvent',
  'setViewingFishingEvent',
  'renderMessage',
  'renderSegementedControl',
  'selectedDetailView',
  'toggleOptionalFields',
  'renderProductButtons',
  'deleteProduct',
  'undoDeleteProduct',
  'renderProductButtons',
  'addProduct',
];

class Fishing extends React.Component{
  constructor (props){
    super(props);
    this.state = {
      ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id}),
      selectedDetail: 0,
      showOptionalFields: false,
    };
    toBind.forEach(funcName => {this[funcName] = this[funcName].bind(this)});
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
      parsedPos = {
        lat: 0,
        lon: 0
      }
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
      setTimeout(() => {
        this.props.dispatch(fishingEventActions.setViewingFishingEvent(this.props.fishingEvents.length));
      }, 300);

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
              this.props.dispatch(fishingEventActions.setViewingFishingEvent(this.props.fishingEvents.length));
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

  deleteProduct(index){
    this.props.dispatch(productActions.deleteProduct(index, this.props.viewingEvent.id, this.props.viewingEvent.objectId));
  }

  undoDeleteProduct(){
    if(this.props.deletedProducts.length){
      this.props.dispatch(productActions.undoDeleteProduct(this.props.viewingEvent.id, this.props.viewingEvent.objectId));
    }
  }

  addProduct() {
    this.props.dispatch(productActions.addProduct(this.props.viewingEvent.id, this.props.viewingEvent.objectId));
  }

  setViewingFishingEvent(fishingEvent){
    this.props.dispatch(fishingEventActions.setViewingFishingEvent(fishingEvent.id));
  }

  toggleOptionalFields() {
    this.setState({
      showOptionalFields: !this.state.showOptionalFields,
    });
  }

  selectedDetailView(){
    switch (this.state.selectedDetail){
      case 0:
        return (
          <EventDetailEditor
            renderMessage={this.renderMessage}
            fishingEvent={this.props.viewingEvent}
            editorType={'event'}
            dispatch={this.props.dispatch}
            formType={this.props.formType}
            optionalFieldsPress={this.toggleOptionalFields}
            showOptionalFields={this.state.showOptionalFields}
          />
        );
      case 1:
        if(!this.props.viewingEvent.datetimeAtEnd){
          return this.renderMessage("Haul before adding catch");
        }
        return (
          <EventProductsEditor
            fishingEvent={this.props.viewingEvent}
            deletedProducts={this.props.deletedProducts}
            products={this.props.viewingEvent.products}
            dispatch={this.props.dispatch}
            editorType={'event'}
            orientation={this.props.orientation}
            renderMessage={this.renderMessage}
            containerChoices={this.props.containerChoices}
            optionalFields={this.props.catchDetailsExpanded}
            deleteProduct={this.deleteProduct}
          />
        );
        case 2:
        case 3:
        case 4:
        const unsoughtType = segMents[this.state.selectedDetail];
        return (<UnsoughtCatch
                 fishingEvent={ this.props.viewingEvent }
                 items={ this.props.viewingEvent[unsoughtType] || [] }
                 dispatch={ this.props.dispatch }
                 editorType={ 'event' }
                 orientation={ this.props.orientation }
                 renderMessage={ this.renderMessage }
                 deletedProducts={ [] }
                 unsoughtType={ unsoughtType }
                 formType={ this.props.formType }
                />);
    }
  }

  renderSegementedControl() {
    let enabled = !!this.props.viewingEvent.datetimeAtEnd;
    const controlColor = enabled ? colors.lightBlue : colors.darkGray;
    return (
      <SegmentedControlIOS
        enabled={ enabled }
        values={segMents}
        selectedIndex={this.state.selectedDetail}
        style={ styles.detailSelector }
        tintColor={ controlColor }
        onChange={({nativeEvent}) => {
          this.setState({selectedDetail: nativeEvent.selectedSegmentIndex});
        }}
      />);
  }

  renderProductButtons() {
    if(this.state.selectedDetail !==  1){
      return null;
    }
    const btnStyle = {
      flex: 1,
      margin: 0,
    };
    const undoColor = this.props.deletedProducts.length ? colors.pink : colors.midGray;
    const buttonWrapper = { alignItems: 'stretch', flex: 0.5 };
    return (
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <View style={[ buttonWrapper ]}>
          <LongButton
            bgColor={ undoColor }
            text={ "Undo" }
            onPress={ this.undoDeleteProduct }
            disabled={ !this.props.deletedProducts.length }
            _style={ btnStyle }
          />
       </View>
       <View style={[ buttonWrapper ] }>
         <LongButton
           bgColor={ colors.blue }
           text={ "Add Catch" }
           disabled={ false }
           onPress={ this.addProduct }
           _style={ btnStyle }
         />
      </View>
    </View>
    );
  }

  renderDetailView(){
    if(!this.props.viewingEvent){
      return this.renderMessage("Welcome Back Skip");
    }
    if(this.props.viewingEvent.signature){
      return this.renderMessage("This shot has been signed and cannot be edited");
    }
    return(
      <View style={[styles.detailView, styles.col]}>
        <View style={[{ height: 50 }]}>
          <View style={[styles.row, { flex: 1 }]}>
            <View style={[ { flex: 0.5 }, styles.row ]}>
              { this.renderSegementedControl() }
            </View>
            <View style={[ { flex: 0.5 }, styles.row ]}>
              <View style={[ styles.productButtonsWrapper ]}>
                { this.renderProductButtons() }
              </View>
            </View>
          </View>
        </View>
        <View style={[styles.row, { flex: 1, padding: 15 }]}>
          { this.selectedDetailView() }
        </View>
    </View>);
  }

  renderFishingEventLists(){
    return (
      <FishingEventList
        fishingEvents={this.state.ds.cloneWithRows([...this.props.fishingEvents || []].reverse())}
        onPress={this.setViewingFishingEvent}
        selectedFishingEvent={this.props.viewingEvent}
    />);
  }

  renderMessage(message){
    return (
      <PlaceholderMessage
        text={message}
        height={this.props.height}
      />);
  }

  getDetailToolbar(){
    let deleteActive = this.props.lastEvent && (!this.props.lastEvent.datetimeAtEnd);
    const posDisplay = (
      <PositionDisplay
        provider={this.props.positionProvider}
      />
    );
    const rightProps = {
      color: colors.red,
      text: "Delete",
      onPress: this.removeFishingEvent,
      enabled: deleteActive
    };
    return (
      <DetailToolbar
        left={null}
        right={ rightProps }
        center={ posDisplay }
      />
    );
  }

  getFishingButton(){
    let startEventButton = (
      <TextButton
        color={ colors.green }
        textAlign={ "center" }
        onPress={ this.startFishingEvent }
        disabled={ false }
      />
    );
    let endEventButton = (
      <TextButton
        color={ colors.red }
        textAlign={ "center" }
        onPress={ this.endFishingEvent }
        disabled={ false }
      />
    );
    return this.props.enableStartEvent ? startEventButton : endEventButton;
  }

  getMasterToolbar(){
    const onPress = this.props.enableStartEvent ? this.startFishingEvent : this.endFishingEvent;
    const backgroundColor = this.props.enableStartEvent ? colors.green : colors.red;
    const buttonStyle = { flex: 1, flexDirection: 'column', alignItems: 'center', backgroundColor, alignSelf: 'stretch'};
    const eventButton = (
      <TouchableOpacity onPress={onPress} style={[buttonStyle]}>
         <View style={{alignItems: 'center'}}>
          <Text style={ { fontSize: 30, fontWeight: '500', color: '#fff', textAlign: 'center', marginTop: 20 } }>
            { this.props.enableStartEvent ? "Start Fishing" : "Haul" }
          </Text>
        </View>
      </TouchableOpacity>
    );
    return(
      <MasterToolbar
        center={eventButton}
      />
    );
  }

  render(){

    return (
      <MasterDetailView
        master={ this.renderFishingEventLists() }
        detail={this.renderDetailView()}
        detailToolbar={this.getDetailToolbar()}
        masterToolbar={this.getMasterToolbar()}
      />
    );
  }
};

const styles = {
  detailView: {
    padding: 0,
    flex: 1,
  },
  col: {
    flexDirection: 'column',
  },
  row: {
    flexDirection: 'row',
  },
  halfway: {
    flex: 0.5,
  },
  detailSelector: {
    borderRadius: 0,
    borderWidth: 1,
    borderColor: colors.lightBlue,
    alignSelf: 'flex-start',
    margin: 10,
    flex: 0.5,
  },
  productButtonsWrapper: {
    flexDirection: 'column',
    margin: 10,
    flex: 0.5,
    alignSelf: 'flex-end',
    alignItems: 'stretch',
  },
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
      catchDetailsExpanded: state.me.catchDetailsExpanded,
      formType: state.me.formType,
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
