'use strict';
import {
  StyleSheet,
  View,
  Text,
  AlertIOS,
} from 'react-native';

import React from 'react';
import FishingEventActions from '../actions/FishingEventActions';

import FishingEventModel from '../models/FishingEventModel';
import TCERFishingEventModel from '../models/TCERFishingEventModel';

import Errors from './Errors';
import Editor from '../utils/Editor';

import EventEditor from './EventEditor';
import eventEditorStyle from '../styles/eventEditor';

import colors from '../styles/colors';
const editor = new Editor();
const fishingEventActions = new FishingEventActions();

const model = FishingEventModel.concat(TCERFishingEventModel);

class EventDetailEditor extends React.Component{

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
      return editor.editor(
        attribute,
        this.props.fishingEvent[attribute.id],
        this.onChange.bind(this),
        {fishingEvent: this.props.fishingEvent},
        inputId);
    }

    getCallback(attr){
      switch (attr.type) {
        case "bool":
          return this.onNonFishChange
          break;
        default:
          return this.onChangeText
      }
    }

    render() {
      return (<EventEditor
                styles={styles}
                getCallback={this.getCallback.bind(this)}
                getEditor={this.getEditor.bind(this)}
                editorType={"event"}
                name={"eventDetail"}
                model={model}
                obj={this.props.fishingEvent}
              />);
    }
};

const styles = StyleSheet.create(eventEditorStyle);


export default EventDetailEditor;
