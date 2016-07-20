'use strict';
import {
  StyleSheet,
  ScrollView,
} from 'react-native';

import React from 'react';
import EditorView from './EditorView';
import GearActions from '../actions/GearActions';
import {eventEditorStyles, textStyles} from '../styles/styles';
import {getFishingEventModelByTypeCode} from '../utils/FormUtils';

const gearActions = new GearActions();

const onChange = (name, value, props, type) => {
  if(props.fishingEvent){
    if(type === 'number'){
      value = parseInt(value);
    }
    if(type === 'float'){
      value = parseFloat(value);
    }
    props.dispatch(gearActions.changeEventGear(props.fishingEvent.id,
                                               props.fishingEvent.objectId,
                                               name, value));
  }
}

const getEditor = (attribute, props) => {
  let inputId = attribute.id + "__gear__";

  if(props.fishingEvent){
    inputId += props.fishingEvent.id;
  };
  return {
    attribute,
    value: props.fishingEvent[attribute.id],
    onChange: (name, value) => onChange(name, value, props, attribute.type),
    extraProps: {fishingEvent: props.fishingEvent},
    inputId
  }
}

const EventGearEditor = (props) => {
  const model = getFishingEventModelByTypeCode(props.formType).complete;
  return (
    <ScrollView>
    <EditorView
      styles={styles}
      getCallback={(name, value) => this.onChange(name, value, props)}
      getEditor={(attribute) => getEditor(attribute, props)}
      editorType={"gear"}
      name={"eventGear"}
      model={model}
      obj={props.fishingEvent}
      values={props.fishingEvent}
    />
  </ ScrollView>
  );
}

const styles = StyleSheet.create(eventEditorStyles);

export default EventGearEditor;
