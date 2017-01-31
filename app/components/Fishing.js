'use strict';
import {
  View,
  ListView,
  AlertIOS,
  StyleSheet,
} from 'react-native';
import React from 'react';
import { connect } from 'react-redux';
import EventDetailEditor from './EventDetailEditor';
import FishingEventList from './FishingEventList';
import MasterDetailView from './layout/MasterDetailView';
import FishingEventActions from '../actions/FishingEventActions';
import PositionDisplay from './PositionDisplay';
import EventProductsEditor from './EventProductsEditor';
import PlaceholderMessage from './common/PlaceholderMessage';
import ProductActions from '../actions/ProductActions';
import Helper from '../utils/Helper';
import { LongButton, TextButton, BigButton } from './common/Buttons';
import { MasterToolbar, DetailToolbar } from './layout/Toolbar';
import { colors, toolbarStyles } from '../styles/styles';

const helper = new Helper();
const fishingEventActions = new FishingEventActions();
const productActions = new ProductActions();
const spacer = { height: 40 };
const halfway = { flex: 0.45 };
const detailWrap = { padding: 15 };
const separator = { flex: 0.1 };

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
  'toggleOptionalFields',
];

class Fishing extends MasterDetailView {
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
    const pos = helper.getLatestPosition(this.props.location);
    if(!isNaN(pos.coords.latitude)){
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
    this.startEvent(pos);
  }

  startEvent(position){
    if(this.props.enableStartEvent){
      this.props.dispatch(fishingEventActions.startFishingEvent(position));
      setTimeout(() => {
        this.props.dispatch(fishingEventActions.setViewingFishingEvent(
          this.props.fishingEvents.length));
        this.setState({
          selectedDetail: "detail",
        });
      }, 100);
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
          this.setState({
            selectedDetail: "detail",
          });
        }}
      ]
    );
  }

  endFishingEvent(){
    if(!this.props.lastEvent){
      return;
    }
    const pos = this.getCurrentLocation();
    this.endTCEREvent(pos);
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
          this.props.dispatch(fishingEventActions.deleteFishingEvent(this.props.lastEvent.id));
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

  masterListOnPress(fishingEvent) {
    this.props.dispatch(fishingEventActions.setViewingFishingEvent(fishingEvent.id));
  }

  isDetailSelected(choice) {
    return choice === this.state.selectedDetail
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
    const detailError = (!this.props.viewingEvent.eventValid && this.props.viewingEvent.datetimeAtEnd);
    const productsError = !catchesDisabled && !this.props.viewingEvent.productsValid;
    const catches = (
      <LongButton
        bgColor={ activeColor }
        text={ "Catches" }
        active={ this.state.selectedDetail === 'catches' }
        disabled={ catchesDisabled }
        onPress={ this.showCatches }
        error={ productsError }
      />
    );
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
          { catchesDisabled ? null : catches }
        </View>
      </View>
    );
  }

  renderProductButtons() {
    const buttonWrapper = { alignItems: 'stretch', flex: 1 };
    const catchesOpen = this.state.selectedDetail === 'catches';
    if(!(this.props.viewingEvent && catchesOpen && this.props.viewingEvent.datetimeAtEnd)){
      return (
        <View style={[styles.row, styles.fill]} />
      );
    }
    const undo = this.props.deletedProducts.length ? (
      <LongButton
        bgColor={ colors.red }
        text={ "Undo" }
        onPress={ this.undoDeleteProduct }
        disabled={ false }
        active
      />
    ) : null;
    return (
      <View style={[styles.row, styles.fill]}>
        <View style={[ buttonWrapper ]}>
          { undo }
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
    if(!this.props.tripStarted){
      return this.renderMessage("Trip hasn't started");
    }
    if(!this.props.viewingEvent){
      return this.renderMessage("Welcome Back Skip");
    }
    if(this.props.viewingEvent.signature){
      return this.renderMessage("This shot has been signed and cannot be edited");
    }
    const productButtons = this.renderProductButtons();
    const detailView = this.selectedDetailView();
    const viewButtons = this.renderDetailViewButtons();
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

  renderMasterListView(){
    return (
      <FishingEventList
        fishingEvents={this.state.ds.cloneWithRows([...this.props.fishingEvents || []].reverse())}
        onPress={this.masterListOnPress}
        selectedFishingEvent={this.props.viewingEvent}
      />
    );
  }

  renderMessage(message){
    return (
      <PlaceholderMessage
        text={message}
        height={this.props.height}
      />);
  }

  renderDetailToolbar(){
    const deleteActive = (this.props.lastEvent && this.props.viewingEvent) &&
    (this.props.viewingEvent.id === this.props.lastEvent.id);
    const position = helper.getLatestPosition(this.props.location);
    const posDisplay = (
      <PositionDisplay
        position={position}
      />
    );
    const rightProps = (
      <TextButton
        text={ "Delete" }
        style={ toolbarStyles.textButton }
        color={ colors.red }
        textAlign={ "left"}
        onPress={ this.removeFishingEvent }
        disabled={ !deleteActive }
      />
    );
    return (
      <DetailToolbar
        left={null}
        right={ rightProps }
        center={ posDisplay }
      />
    );
  }

  onMasterButtonPress(){
    const onPress = this.props.enableStartEvent ? this.startFishingEvent : this.endFishingEvent;
    onPress();
  }

  renderMasterToolbar(){
    let backgroundColor = this.props.enableStartEvent ? colors.green : colors.red;
    const text = this.props.enableStartEvent ? "Shoot" : "Haul";
    let textColor = colors.white;
    if(!this.props.tripStarted) {
      backgroundColor = colors.backgrounds.dark;
      textColor = colors.backgrounds.light;
    }

    const button = (
      <BigButton
        text={text}
        backgroundColor={backgroundColor}
        textColor={textColor}
        onPress={this.onMasterButtonPress }
      />
    );
    return(
      <MasterToolbar
        center={ button }
      />
    );
  }
}

const select = (State) => {
    const state = State.default;
    const props = {
      fishingEventType: "tcer",
      orientation: state.view.orientation,
      height: state.view.height,
      tripStarted: state.trip.started,
      enableStartEvent: state.trip.started,
      location: state.location,
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
    props.enableStartEvent = state.trip.started && ((!lastEvent) || lastEvent.datetimeAtEnd);
    props.enableHaul = lastEvent && (!lastEvent.datetimeAtEnd);
    return props;
}

export default connect(select)(Fishing);
