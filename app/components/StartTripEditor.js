'use strict';
import {
  StyleSheet,
  View,
  Text,
  AlertIOS,
  TouchableOpacity,
  TextInput,
  PickerIOS,
} from 'react-native';

import React from 'react';
import moment from 'moment';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import TripModel from '../models/TripModel';
import { eventEditorStyles, textStyles, inputStyles, colors } from '../styles/styles';
import EditorView from './common/EditorView';

const styles = StyleSheet.create(eventEditorStyles);
const dayChoices = [...Array(45).keys()].map(i => {
  return {
    value: i.toString(),
    description: ` ${i.toString()} days `,
  }
});

class StartTripEditor extends React.Component {

  constructor(props){
    super(props);
    this.getEditor = this.getEditor.bind(this);
    this.getEditorExtraProps = this.getEditorExtraProps.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(name, value){

  }

  getEditor(attribute) {
    const extraProps = this.getEditorExtraProps(attribute);
    const value = this.props.trip[attribute.id];
    const inputId = attribute.id + "__trip__";
    return {
      attribute,
      value: value,
      onChange: this.onChange,
      extraProps,
      inputId,
      onEnterPress: null,
    };
  }

  getEditorExtraProps(attribute){
    const extraProps = {};
    switch (attribute.id) {
      case "startPort":
      case "endPort":
        return extraProps.choices = this.props.ports;
        break;
      case "startDate":
        extraProps.mode = "date";
        extraProps.disabled = true;
        extraProps.format = "Do MM YYYY";
        break;
      case "endDate":
        const date = this.props.trip.startDate || new moment();
        const endDate = this.props.trip.endDate || date.add(2, "days");
        const tripDays = moment.duration(endDate.diff(date)).asDays();
        extraProps.choices = dayChoices;
        extraProps.value = tripDays.toFixed(0);
        break;
    }
    return extraProps;
  }

  render() {
    return (
      <KeyboardAwareScrollView
        style={{marginTop: 3}}
        viewIsInsideTabBar={ true }
        extraHeight={ 150 }
        bouncesZoom={false}
        alwaysBounceVertical={false}
      >
        <EditorView
          top={ null }
          styles={styles}
          getCallback={(key, value) => { console.log(arguments); } }
          getEditor={ this.getEditor }
          editorType={"trip"}
          name={ "tripEdit" }
          model={ TripModel }
          obj={ this.props.trip }
          values={ this.props.trip }
        />
        <View style={{height: 600}}></View>
      </KeyboardAwareScrollView>
    );
  }
}

export default StartTripEditor;
