'use strict';
import {
  StyleSheet,
  View,
  AlertIOS,
  Text,
} from 'react-native';

import React from 'react';
import FishingEventActions from '../actions/FishingEventActions';
import FishingEventModel from '../models/FishingEventModel';
import TCERFishingEventModel from '../models/TCERFishingEventModel';
import Errors from './Errors';
import EditorView from './EditorView';
import {eventEditorStyles, colors} from '../styles/styles';
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
      return {
        attribute,
        value: this.props.fishingEvent[attribute.id],
        onChange: this.onChange.bind(this),
        extraProps: {fishingEvent: this.props.fishingEvent},
        inputId,
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
      return (<EditorView
                styles={styles}
                getCallback={this.getCallback.bind(this)}
                getEditor={this.getEditor.bind(this)}
                editorType={"event"}
                name={"eventDetail"}
                model={model}
                obj={this.props.fishingEvent}
                values={this.props.fishingEvent}
              />);
    }
};

const styles = StyleSheet.create(eventEditorStyles);


export default EventDetailEditor;
