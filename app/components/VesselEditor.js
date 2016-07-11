'use strict';
import {
  StyleSheet,
  View,
  PickerIOS
} from 'react-native';

import React from 'react';
import VesselModel from '../models/VesselModel';
import {AttributeEditor} from './AttributeEditor';
import EditorView from './EditorView';
import eventEditorStyles from '../styles/eventEditor';
import UserActions from '../actions/UserActions';
import ModelUtils from '../utils/ModelUtils';
const userActions = new UserActions();
const PickerItemIOS = PickerIOS.Item;

const onChange = (key, value, {dispatch}) => {
  var change = {};
  change[key] = value
  dispatch(userActions.editVessel(change));
}

const getEditor = (attribute, props) => {
  return {
    attribute,
    value: props.vessel[attribute.id],
    onChange: (key, value) => onChange(key, value, props),
    extraProps: {editable: false},
    inputId: attribute.id + "__vessel__" + props.vessel.id
  };
}

const VesselEditor = (props) => {

  let items = props.vessels.map((v) => (
    <PickerItemIOS
      key={v.id}
      value={v.id}
      label={v.name}
    />));

  let picker = (
    <PickerIOS
      selectedValue={props.vessel.id}
      onValueChange={(vesselId, i) => props.dispatch(userActions.setVessel(props.vessels[i]))}
    >
      {items}
    </PickerIOS>
  );

  return (
      <EditorView
        top={props.tripStarted ? null : picker}
        styles={styles}
        getCallback={(key, value) => onChange(key, value, props)}
        getEditor={(attribute) => getEditor(attribute, props)}
        editorType={"vessel"}
        name={"vesselEdit"}
        model={VesselModel}
        obj={props.vessel}
        values={props.vessel}
      />
  );
}

const styles = StyleSheet.create(eventEditorStyles);

module.exports = VesselEditor;
