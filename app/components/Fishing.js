'use strict';
import {
  View,
  ListView,
  AlertIOS,
  SegmentedControlIOS,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import React from 'react';
import EventDetailEditor from './EventDetailEditor';
import FishingEventList from './FishingEventList';
import MasterDetailView from './layout/MasterDetailView';
import FishingEventActions from '../actions/FishingEventActions';
import PositionDisplay from './PositionDisplay';
import EventProductsEditor from './EventProductsEditor';
import { connect } from 'react-redux';
import PlaceholderMessage from './common/PlaceholderMessage';
import { LongButton } from './common/Buttons';

import ProductActions from '../actions/ProductActions';
import { MasterToolbar, DetailToolbar } from './layout/Toolbar';
import { colors } from '../styles/styles';
import Icon8 from './common/Icon8';
const fishingEventActions = new FishingEventActions();

//TODO optional discard etc
const productActions = new ProductActions();

const styles = StyleSheet.create({
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
  fill: {
    flex: 1,
  },
});


const toBind = [
  'endFishingEvent',
  'startFishingEvent',
  'renderDetailView',
  'removeFishingEvent',
  'setViewingFishingEvent',
  'renderMessage',
  'renderDetailViewButtons',
  'selectedDetailView',
  'toggleOptionalFields',
  'deleteProduct',
  'undoDeleteProduct',
  'renderProductButtons',
  'addProduct',
  'showCatches',
  'showDetail',
];

class Fishing extends React.Component{
  constructor (props){
    super(props);
    this.state = {
      ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id}),
      selectedDetail: "detail",
      showOptionalFields: false,
    };
    toBind.forEach(funcName => {this[funcName] = this[funcName].bind(this)});
  }

  getCurrentLocation(){
    const pos = this.props.positionProvider.getPosition()
    if(pos && pos.coords){
      return {
        lat: pos.coords.latitude,
        lon: pos.coords.longitude
      }
    }
    AlertIOS.alert("No location fix - please remember to edit the location");
    return {
      lat: 0,
      lon: 0
    }
  }

  startFishingEvent(){
    const pos = this.getCurrentLocation();
    if(this.props.formType === 'tcer'){
      this.startEvent(pos);
    }else{
      this.startLCEREvent(pos);
    }
  }

  startEvent(position){
    if(this.props.enableStartEvent){
      this.props.dispatch(fishingEventActions.startFishingEvent(position));
      setTimeout(() => this.props.dispatch(
        fishingEventActions.setViewingFishingEvent(
          this.props.fishingEvents.length)), 300);
    }
  }

  endTCEREvent(position){
    AlertIOS.alert(
      "Hauling",
      'Touch yes to confirm - you cannot delete a shot after you haul it.',
      [
        {text: 'No', onPress: () => null, style: 'cancel'},
        {text: 'Yes', onPress: () => {
          this.props.dispatch(fishingEventActions.endFishingEvent(this.props.lastEvent.id, position));
          this.props.dispatch(fishingEventActions.setViewingFishingEvent(this.props.fishingEvents.length));
        }}
      ]
    );
  }

  endFishingEvent(){
    if(!this.props.lastEvent){
      return;
    }
    const pos = this.getCurrentLocation();
    if(this.props.formType === 'tcer'){
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
        {text: 'Cancel', onPress: () => null, style: 'cancel'},
        {text: 'Delete', onPress: () => {
          this.props.dispatch(fishingEventActions.setViewingFishingEvent(null));
          this.props.dispatch(fishingEventActions.cancelFishingEvent(this.props.lastEvent.id));
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
      case "detail":
        return (
          <EventDetailEditor
            renderMessage={this.renderMessage}
            fishingEvent={this.props.viewingEvent}
            dispatch={this.props.dispatch}
            formType={this.props.formType}
            optionalFieldsPress={this.toggleOptionalFields}
            showOptionalFields={this.state.showOptionalFields}
          />
        );
      case "catches":
        if(!this.props.viewingEvent.datetimeAtEnd){
          return this.renderMessage("Haul before adding catch");
        }
        return (
          <EventProductsEditor
            fishingEvent={this.props.viewingEvent}
            deletedProducts={this.props.deletedProducts}
            products={this.props.viewingEvent.products}
            addProduct={ this.addProduct }
            dispatch={this.props.dispatch}
            editorType={'event'}
            orientation={this.props.orientation}
            renderMessage={this.renderMessage}
            containerChoices={this.props.containerChoices}
            optionalFields={this.props.catchDetailsExpanded}
            deleteProduct={this.deleteProduct}
          />
        );
    }
  }

  showDetail(){
    this.setState({
      selectedDetail: "detail",
    });
  }

  showCatches(){
    this.setState({
      selectedDetail: "catches",
    });
  }

  renderDetailViewButtons() {
    const buttonWrapper = { alignItems: 'stretch', flex: 1};
    const activeColor = colors.blue;
    const catchesDisabled = !this.props.viewingEvent.datetimeAtEnd;
    const detailError = !this.props.viewingEvent.eventValid;
    const productsError = !this.props.viewingEvent.productsValid;
    return (
      <View style={[styles.row, styles.fill]}>
        <View style={[ buttonWrapper ]}>
          <LongButton
            bgColor={ activeColor }
            text={ "Detail" }
            onPress={ this.showDetail }
            disabled={ false }
            error={ detailError }
            active={ this.state.selectedDetail === 'detail' }
          />
         </View>
         <View style={[ buttonWrapper ] }>
           <LongButton
             bgColor={ activeColor }
             text={ "Catches" }
             active={ this.state.selectedDetail === 'catches' }
             disabled={ catchesDisabled }
             onPress={ this.showCatches }
             error={ productsError }
           />
        </View>
      </View>
    );
  }

  renderProductButtons() {
    const buttonWrapper = { alignItems: 'stretch', flex: 1 };
    const catchesOpen = this.state.selectedDetail === 'catches';
    const haveDeleted = !!this.props.deletedProducts.length;
    const canUndo = (catchesOpen && haveDeleted);
    return (
      <View style={[styles.row, styles.fill]}>
        <View style={[ buttonWrapper ]}>
          <LongButton
            bgColor={ colors.pink }
            text={ "Undo" }
            onPress={ this.undoDeleteProduct }
            disabled={ !canUndo }
            active={ canUndo }
          />
       </View>
       <View style={[ buttonWrapper ] }>
         <LongButton
           bgColor={ colors.green }
           text={ "Add Catch" }
           disabled={ !catchesOpen }
           onPress={ this.addProduct }
           active={ catchesOpen }
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
    const productButtons = this.renderProductButtons();
    const detailView = this.selectedDetailView();
    const viewButtons = this.renderDetailViewButtons();
    const spacer = { height: 40 };
    const halfway = { flex: 0.45 };
    const detailWrap = { padding: 15 };
    const separator = { flex: 0.1 };
    return(
      <View style={[styles.detailView, styles.col]}>
        <View style={[spacer]}>
          <View style={[styles.row, styles.fill]}>
            <View style={[ halfway, styles.row ]}>
              { viewButtons }
            </View>
            <View style={separator} />
            <View style={[ halfway, styles.row ]}>
              { productButtons }
            </View>
          </View>
        </View>
        <View style={[styles.row, styles.fill, detailWrap]}>
          { detailView }
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
    const deleteActive = this.props.lastEvent && (!this.props.lastEvent.datetimeAtEnd);
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

  getMasterToolbar(){
    const onPress = this.props.enableStartEvent ? this.startFishingEvent : this.endFishingEvent;
    const backgroundColor = this.props.enableStartEvent ? colors.green : colors.red;
    const buttonStyle = { flex: 1, flexDirection: 'column', alignItems: 'center', backgroundColor, alignSelf: 'stretch'};
    const innerWrap = {alignItems: 'center'};
    const textStyle = { fontSize: 30, fontWeight: '500', color: '#fff', textAlign: 'center', marginTop: 20 };
    const text = this.props.enableStartEvent ? "Start Fishing" : "Haul";
    const eventButton = (
      <TouchableOpacity onPress={onPress} style={ buttonStyle }>
         <View style={innerWrap}>
          <Text style={ textStyle }>
            { text }
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
}

const select = (State, dispatch) => {
    const state = State.default;
    const props = {
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
    const fEvents = state.fishingEvents.events;
    const lastEvent = fEvents[fEvents.length -1];
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
