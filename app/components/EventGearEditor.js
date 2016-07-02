'use strict';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  Modal,
  ScrollView,
  Switch,
  AlertIOS,
  TextInput,
} from 'react-native';

import React from 'react';

import TrawlGearModel from '../models/TrawlGearModel';
import Editor from '../utils/Editor';
import EventEditor from './EventEditor';
import eventEditorStyle from '../styles/eventEditor';
import GearActions from '../actions/GearActions';
const editor = new Editor();
const gearActions = new GearActions();

const model = TrawlGearModel;

class GearEditor extends React.Component{

    onChange(name, value){
      if( !this.props.fishingEvent || this.props.isLatestEvent){
        this.props.dispatch(gearActions.changeCurrentGear(name, value));
      }
      if(this.props.fishingEvent){
        this.props.dispatch(gearActions.changeEventGear(this.props.fishingEvent.id, name, value));
      }
    }

    getEditor(attribute){
      let inputId = attribute.id + "__gear__";
      let gear = this.props.gear;
      if(this.props.fishingEvent){
        inputId += this.props.fishingEvent.id;
        gear = this.props.fishingEvent.gear;
      };
      return editor.editor(attribute,
                     gear[attribute.id],
                     this.onChange.bind(this),
                     {fishingEvent: this.props.fishingEvent},
                     inputId);
    }

    render() {
      return (<EventEditor
                styles={styles}
                getCallback={() => this.onChange.bind(this)}
                getEditor={this.getEditor.bind(this)}
                editorType={"gear"}
                name={"eventGear"}
                model={model}
                obj={this.props.gear}
              />);
    }
};

const styles = StyleSheet.create(eventEditorStyle);

export default GearEditor;
