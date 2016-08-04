'use strict';
import {
  StyleSheet,
  View,
  PickerIOS,
  Switch,
  Text
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

  let formTypeItems = ["tcer", "lcer"].map(ft => (
     <PickerItemIOS
      key={ft + "__formTypeChoice"}
      value={ft}
      label={ft.toUpperCase()}
    />
  ));

  let formTypePicker = (
    <PickerIOS
      selectedValue={props.formType}
      onValueChange={(formType) => props.dispatch(userActions.setFormType(formType))}
    >
      {formTypeItems}
    </PickerIOS>
  );

  let vesselItems = props.vessels.map((v) => (
    <PickerItemIOS
      key={v.id}
      value={v.id}
      label={v.name}
    />));

  let vesselPicker = (
    <PickerIOS
      selectedValue={props.vessel.id}
      onValueChange={(vesselId, i) => props.dispatch(userActions.setVessel(props.vessels[i]))}
    >
      {vesselItems}
    </PickerIOS>
  );

  let catchExpand = (
    <View style={{marginLeft: 30}}>
      <Text>Enter Containers - state - and treatment?</Text>
      <Switch
        onValueChange={(bool) => {
          props.dispatch(userActions.setCatchDetailsExpanded(bool));
        }}
        value={props.catchDetailsExpanded}
      />
    </View>
);

  let top = (
    <View>
      {vesselPicker}
      {formTypePicker}
      {catchExpand}
    </View>
  );

  return (
      <EditorView
        top={props.tripStarted ? null : top}
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
