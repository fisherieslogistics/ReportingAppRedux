'use strict';
import {
  StyleSheet,
  View,
  AlertIOS,
  Text,
  ScrollView,
} from 'react-native';

import React from 'react';
import Errors from './common/Errors';
import EditorView from './common/EditorView';
import FishingEventActions from '../actions/FishingEventActions';
import {eventEditorStyles, colors} from '../styles/styles';
import {getFishingEventModelByTypeCode} from '../utils/FormUtils';
const fishingEventActions = new FishingEventActions();
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


const tcerOrder = [
  'targetSpecies',
  'bottomDepth',
  'groundropeDepth',
  'averageSpeed',
  'wingSpread',
  'headlineHeight',
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
      this.getCallback = this.getCallback.bind(this);
      this.getEditor = this.getEditor.bind(this);
      this.state = {
        nextInput: ''
      }
    }

    setNextInput(name){
      this.setState({
        nextInput: name,
      });
    }

    onEnterPress(inputName){
      const ordering = inputOrder[this.props.formType];
      const index = ordering.indexOf(inputName);
      if(index === -1){
        this.setNextInput('');
        return;
      }

      let isLast = (index === ordering.length - 1);

      if(!isLast){
        this.setNextInput(ordering[index + 1]);
      }
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

    onChangeText(name, value, fihingEventId) {
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

    getEditor(attribute){
      const inputId = attribute.id + "__event__" + this.props.fishingEvent.id;
      return {
        attribute,
        value: this.props.fishingEvent[attribute.id],
        onChange: attribute.type === 'bool' ? this.onNonFishChange : this.onChange,
        extraProps: {fishingEvent: this.props.fishingEvent},
        inputId,
        onEnterPress: inputOrder[this.props.formType].indexOf(attribute.id) === -1 ? null : this.onEnterPress,
      };
    }

    getCallback(attr){
      switch (attr.type) {
        case "bool":
          return this.onNonFishChange
        default:
          return this.onChangeText
      }
    }

    render() {
      if(!this.props.fishingEvent){
        return this.props.renderMessage("No shots to edit");
      }
      const model = getFishingEventModelByTypeCode(this.props.formType).complete;
      return (<KeyboardAwareScrollView style={{marginTop: 3}} viewIsInsideTabBar={ true } extraHeight={ 150 } bouncesZoom={false} alwaysBounceVertical={false}>
                <EditorView
                  styles={styles}
                  getCallback={this.getCallback}
                  toFocusAttributeId={ this.state.nextInput }
                  getEditor={this.getEditor}
                  editorType={"event"}
                  name={"eventDetail"}
                  model={model}
                  obj={this.props.fishingEvent}
                  values={this.props.fishingEvent}
                />
              <View style={{height: 600}}></View>
            </KeyboardAwareScrollView>);
    }
};

const styles = StyleSheet.create(eventEditorStyles);

export default EventDetailEditor;
