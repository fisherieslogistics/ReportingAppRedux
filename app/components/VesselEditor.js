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
import AttributeEditor from './common/AttributeEditor';
import ModelEditor from './common/ModelEditor';
import { modelEditorStyles } from '../styles/styles';
import UserActions from '../actions/UserActions';
import ModelUtils from '../utils/ModelUtils';
const userActions = new UserActions();
const PickerItemIOS = PickerIOS.Item;

const onChange = (key, value, {dispatch}) => {
  const change = {};
  change[key] = value
  dispatch(userActions.editVessel(change));
}

const getEditorProps = (attribute, props) => ({
    attribute,
    value: props.vessel[attribute.id],
    onChange: (key, value) => onChange(key, value, props),
    extraProps: {editable: false},
    inputId: attribute.id + "__vessel__" + props.vessel.id
  })

const VesselEditor = (props) => {

  const formTypeItems = ["tcer", "lcer"].map(ft => (
     <PickerItemIOS
      key={ft + "__formTypeChoice"}
      value={ft}
      label={ft.toUpperCase()}
    />
  ));

  const formTypePicker = (
    <PickerIOS
      selectedValue={props.formType}
      onValueChange={(formType) => props.dispatch(userActions.setFormType(formType))}
    >
      {formTypeItems}
    </PickerIOS>
  );

  const vesselItems = props.vessels.map((v) => (
    <PickerItemIOS
      key={v.id}
      value={v.id}
      label={v.name}
    />));

  const vesselPicker = (
    <PickerIOS
      selectedValue={props.vessel.id}
      onValueChange={(vesselId, i) => props.dispatch(userActions.setVessel(props.vessels[i]))}
    >
      {vesselItems}
    </PickerIOS>
  );

  const catchExpand = (
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

  const top = (
    <View>
      {vesselPicker}
      {formTypePicker}
      {catchExpand}
    </View>
  );

  return (
      <ModelEditor
        top={props.tripStarted ? null : top}
        styles={styles}
        getCallback={(key, value) => onChange(key, value, props)}
        getEditorProps={(attribute) => getEditorProps(attribute, props)}
        editorType={"vessel"}
        name={"vesselEdit"}
        model={[]}
        modelValues={props.vessel}
        values={props.vessel}
      />
  );
}

const styles = StyleSheet.create(modelEditorStyles);

export default VesselEditor;
