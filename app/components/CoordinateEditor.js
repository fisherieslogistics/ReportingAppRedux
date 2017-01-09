'use strict';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Icon,
} from 'react-native';

import React, { Component } from 'react';
import {inputStyles, textStyles, colors} from '../styles/styles';
import { renderRadioButton } from './common/RadioButton';
import { RadioButtons } from 'react-native-radio-buttons';
import Helper from '../utils/Helper';
import FocusOnDemandTextInput from './common/FocusOnDemandTextInput';
const helper = new Helper();

const styles = StyleSheet.create({
  coordLabel: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.blue,
  },
  centerItems: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  formWrapper: {
    flex: 1,
    alignSelf: 'flex-start',
    flexDirection: 'column',
    paddingRight: 5,
  },
  formSectionTop: {
    flex: 0.15,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formSectionMid: {
    flex: 0.35,
  },
  formSectionBottom: {
    flex: 0.4,
    padding: 5,
  },
  labelWrapper: {
    flex: 0.3,
  },
  textInputWrapper: {
    flex: 0.7,
    borderBottomWidth: 0.5,
    marginLeft: 6,
    marginTop: 4,
  },
  textInput: {
    height: 26,
  },
});

class InputView extends Component {
  constructor(props){
    super(props);
    const degMin = helper.getDegreesMinutesFromLocation(this.props.location);
    this.state = {
      text: degMin[this.props.name].toString(),
    }
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  componentWillReceiveProps(props){
    const degMin = helper.getDegreesMinutesFromLocation(props.location);
    this.setState({
      text: degMin[props.name].toString(),
    });
  }

  onChangeText(text){
    this.setState({
      text
    });
  }

  onKeyPress(event) {
    if(event.nativeEvent.key === 'Enter'){
      this.props.onEnterPress(this.props.name);
    }
  }

  onBlur(e){
    if(this.isValid){
      const degMin = helper.getDegreesMinutesFromLocation(this.props.location);
      degMin[this.props.name] = parseInt(this.state.text);
      const loc = helper.parseLocation(degMin,
                                       degMin.ew,
                                       degMin.ns);
      this.props.onChange(this.props.attribute.id, loc);
    }
  }

  onFocus(e){
    this.props.onEnterPress(null);
  }

  isValid(){
    const intVal = parseInt(this.state.text);
    if(isNaN(intVal)){
      return false;
    }
    if(intVal > this.props.maxVal){
      return false;
    }
    return true;
  }

  isToFocus(){
    return (this.props.nextInput === this.props.name);
  }

  render(){
    const labelColor = this.isValid() ? colors.blue : colors.red;
    return (
      <View
        style={{ flexDirection: 'row', height: 50 }}
      >
        <View style={ [styles.labelWrapper, styles.centerItems] }>
          <Text style={[{ color: labelColor }]}>
            { this.props.label }
          </Text>
        </View>
        <View style={ [ styles.textInputWrapper, styles.centerItems ] }>
          <FocusOnDemandTextInput
            selectTextOnFocus
            focus={ this.isToFocus() }
            keyboardType={ 'number-pad' }
            value={ this.state.text }
            style={ [ inputStyles.textInput ] }
            onChangeText={ this.onChangeText }
            onKeyPress={ this.onKeyPress }
            onBlur={ this.onBlur }
            onFocus={ this.onFocus }
            returnKeyType={ 'next' }
          />
        </View>
      </View>
    );
  }
}

export default class CoordinateEditor extends Component {

  constructor(props) {
    super(props);
    this.onHemisphereChange = this.onHemisphereChange.bind(this);
  }

  editorProps(coordType){
    const coordTypes = ['latitude', 'longitude'];
    if(coordTypes.indexOf(coordType) === -1){
      throw new Error(`prop coordType must be one of ${JSON.stringify(coordTypes)} but got ${coordType}`);
    }
    const hemispheres = {
      latitude: {
        negative: 'South',
        positive: 'North',
      },
      longitude: {
        negative: 'West',
        positive: 'East',
      }
    };
    const maxDegrees = {
      latitude: 90,
      longitude: 180,
    }
    return {
      label: coordType.charAt(0).toUpperCase() + coordType.slice(1),
      prepend: coordType.slice(0, 3),
      maxMinutes: 60,
      maxSeconds: 60,
      hemisphereOptions: [ hemispheres[coordType].positive, hemispheres[coordType].negative ],
      maxDegrees: maxDegrees[coordType],
    };
  }



  renderInputs(editorProps){
    return ['Degrees', 'Minutes', 'Seconds'].map((part, i) => {
      const attributeName = `${editorProps.prepend}${part}`;
      return (
        <InputView
          key={ `${attributeName}_${i}_part` }
          name={ attributeName }
          index={i}
          label={ part }
          maxVal={ editorProps[`max${part}`] }
          onChange={ this.props.onChange }
          attribute={ this.props.attribute }
          location={ this.props.location }
          coordType={ this.props.coordType }
          onEnterPress={ this.props.onEnterPress }
          nextInput={ this.props.nextInput }
        />
      );
    });
  }

  onHemisphereChange(val){
    const degMin = helper.getDegreesMinutesFromLocation(this.props.location);
    switch (this.props.coordType) {
      case 'latitude':
        this.props.onChange(this.props.attribute.id, helper.parseLocation(degMin, degMin.ew, val));
        break;
      case 'longitude':
        this.props.onChange(this.props.attribute.id, helper.parseLocation(degMin, val, degMin.ns));
        break;
    }
  }

  render() {
    const _props = this.editorProps(this.props.coordType, this.props.location);
    const degMin = helper.getDegreesMinutesFromLocation(this.props.location);
    const hemisphere = this.props.coordType == 'latitude' ? degMin.ns : degMin.ew;
    return (
      <View
        style={ [styles.formWrapper] }
        key={ 'coords_edit_' + this.props.label }
      >
        <View style={ [styles.formSectionTop] }>
          <Text style={[inputStyles.labelText, styles.coordLabel ]}>
            { _props.label }
          </Text>
        </View>
        <View style={ [styles.formSectionMid] }>
          { this.renderInputs(_props) }
        </View>
        <View style={ [styles.formSectionBottom] }>
          <View style={{flex: 1, justifyContent: 'space-between', paddingTop: 10, marginTop: 80 }}>
            <RadioButtons
              options={ _props.hemisphereOptions }
              onSelection={ this.onHemisphereChange }
              renderContainer={ RadioButtons.renderHorizontalContainer }
              renderOption={ renderRadioButton }
              selectedOption={ hemisphere }
            />
          </View>
        </View>
      </View>
    );
  }
}
