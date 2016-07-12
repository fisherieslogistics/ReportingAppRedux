'use strict';
import {
  StyleSheet,
} from 'react-native';

import React from 'react';
import TrawlGearModel from '../models/TrawlGearModel';
import EditorView from './EditorView';
import GearActions from '../actions/GearActions';
import {eventEditorStyles, textStyles} from '../styles/styles';

const gearActions = new GearActions();
const model = TrawlGearModel;

const onChange = (name, value, props) => {
  if(props.fishingEvent){
    props.dispatch(gearActions.changeEventGear(props.fishingEvent.id, props.fishingEvent.objectId, name, value));
  }
}

const getEditor = (attribute, props) => {
  let inputId = attribute.id + "__gear__";
  let gear = props.gear;
  if(props.fishingEvent){
    inputId += props.fishingEvent.id;
  };
  return {
    attribute,
    value: props.fishingEvent[attribute.id],
    onChange: (name, value) => onChange(name, value, props),
    extraProps: {fishingEvent: props.fishingEvent},
    inputId
  }
}

const EventGearEditor = (props) => {
  return (
    <EditorView
      styles={styles}
      getCallback={(name, value) => this.onChange(name, value, props)}
      getEditor={(attribute) => getEditor(attribute, props)}
      editorType={"gear"}
      name={"eventGear"}
      model={model}
      obj={props.gear}
      values={props.gear}
    />
  );
}

const styles = StyleSheet.create(eventEditorStyles);

export default EventGearEditor;
