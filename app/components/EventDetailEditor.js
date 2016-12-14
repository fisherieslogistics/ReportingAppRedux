'use strict';
import {
  View,
  AlertIOS,
  Text,
  TouchableOpacity,
} from 'react-native';

import React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ModelEditor from './common/ModelEditor';
import FishingEventActions from '../actions/FishingEventActions';
import {getFishingEventModelByTypeCode} from '../utils/FormUtils';

/* eslint-disable */
import speciesCodesDesc from '../constants/speciesDesc';
/* eslint-enable */

const fishingEventActions = new FishingEventActions();

const tcerOrder = [
  'targetSpecies',
  'bottomDepth',
  //'groundropeDepth',
  'averageSpeed',
  /*'wingSpread',
  'headlineHeight',*/
];

const lcerOrder = [
  'targetSpecies',
  'numberOfHooks',
  'bottomDepth',
];

const inputOrder = {
  tcer: tcerOrder,
  lcer: lcerOrder,
}

class EventDetailEditor extends React.Component{

    constructor(props){
      super(props);
      this.onEnterPress = this.onEnterPress.bind(this);
      this.onNonFishChange = this.onNonFishChange.bind(this);
      this.onChange = this.onChange.bind(this);
      this.getEditorProps = this.getEditorProps.bind(this);
      this.state = {
        nextInput: '',
        showMore: false,
      }
    }

    getNextInputId(attrId) {
      const inputOrder = this.getInputOrder();
      const index = inputOrder.indexOf(attrId);
      const attr = inputOrder[index + 1];
      if(attr) {
        this.setState({
          nextInput: attr,
        });
      }
    }

    onEnterPress(attrId) {
      this.getNextInputId(attrId);
    }

    getInputOrder(){
      return inputOrder[this.props.formType];
    }

    onChange(name, value){
      switch (name) {
        case "nonFishProtected":
          this.onNonFishChange(name, value);
          break;
        default:
          this.onChangeText(name, value);
      }
    }

    onChangeText(name, value) {
        this.props.dispatch(
          fishingEventActions.setfishingEventValue(this.props.fishingEvent.id, name, value));
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

    getEditorProps(attribute){
      const extraProps = {};
      if(attribute.id === 'targetSpecies') {
        extraProps.choices = speciesCodesDesc;
        extraProps.autoCapitalize = 'characters';
        extraProps.maxLength = 3;
      }
      return {
        attribute,
        extraProps,
        onEnterPress: this.onEnterPress,
      };
    }

    renderToggleShowMore(){
      const viewStyle = {position: 'absolute', right: 0, top: 0, height: 30, width: 45};
      const textStyle = {fontSize: 18, color: '#33F9FF'};
      return (
        <TouchableOpacity
          style={viewStyle}
          onPress={ this.props.optionalFieldsPress }
        >
          <View>
            <Text style={textStyle}>
              { this.props.showOptionalFields ? 'Less' : 'More' }
            </Text>
          </View>
        </TouchableOpacity>
      );
    }

  render() {
    if(!this.props.fishingEvent){
      return this.props.renderMessage("No shots to edit");
    }
    let model = getFishingEventModelByTypeCode(this.props.formType).complete;
    if(!this.props.showOptionalFields) {
      model = model.filter(f => {
        if(f.optionalRender ){
          const value = this.props.fishingEvent[f.id];
          return !f.valid.func(value);
        }
        return true;
      });
    }
    if(!this.props.fishingEvent.datetimeAtEnd){
      model = model.filter(field => field.displayStage !== 'Haul');
    }
    const spacer = { height: 50 };
    const mass = { height: 600 };
    const showMore = this.renderToggleShowMore();
    return (
      <KeyboardAwareScrollView
        viewIsInsideTabBar
        extraHeight={ 150 }
        bouncesZoom={ false }
        alwaysBounceVertical={ false }
      >
        <View style={spacer} />
        <ModelEditor
          getEditorProps={ this.getEditorProps }
          model={ model }
          index={this.props.fishingEvent.id }
          modelValues={ this.props.fishingEvent }
          onChange={ this.onChange }
        />
        { showMore }
      <View style={mass} />
    </KeyboardAwareScrollView>);
  }
}

export default EventDetailEditor;
