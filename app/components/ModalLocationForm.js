'use strict';
import {
  View,
  Dimensions,
  StyleSheet,
  Modal,
} from 'react-native';

import React, { Component } from 'react';
import { BlurView } from 'react-native-blur';
import ModalEditor, { FormContainer } from './common/ModalEditor';
import CoordinateEditor from './CoordinateEditor';
import { TextButton } from './common/Buttons';
import {inputStyles, textStyles, colors} from '../styles/styles';

const inputOrder = [
  'latDegrees',
  'latMinutes',
  'latSeconds',
  'lonDegrees',
  'lonMinutes',
  'lonSeconds'
];

export default class ModalLocationForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      nextInput: null,
    }
  }

  onEnterPress(inputName){
    const index = inputOrder.indexOf(inputName);
    let input = (index === inputOrder.length -1) ? inputOrder[0] : inputOrder[index + 1];
    this.setState({
      nextInput: inputName ? input : null,
    });
  }

  render(){
    if(! this.props.visible){
      return null;
    }
    const inputs = (
      <View style={[ styles.formWrapper ]}>
        <CoordinateEditor
          coordType={'latitude'}
          location={ this.props.location }
          attribute={ this.props.attribute }
          onChange={ this.props.onChange }
          onEnterPress={ this.onEnterPress.bind(this) }
          nextInput={ this.state.nextInput }
        />
        <CoordinateEditor
          coordType={'longitude'}
          location={ this.props.location }
          attribute={ this.props.attribute }
          onChange={ this.props.onChange }
          onEnterPress={ this.onEnterPress.bind(this) }
          nextInput={ this.state.nextInput }
        />
      </View>
    );
    const controls = (
      <View style={ [styles.formControl] }>
        <TextButton text={ 'Done' }
                     color={ colors.blue }
                     style={ [styles.button, { marginTop: 20 }] }
                     textStyle={{ fontSize: 24 }}
                     onPress={ this.props.onRequestClose }
         />
      </View>
    );
    const form = (<FormContainer inputs={ inputs } controls={ controls } />);
    return (
      <Modal
        animationType={ 'fade' }
        transparent={ true }
        visible={ true }
        onRequestClose={ this.props.onRequestClose }
      >
        { form }
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  inputsWrapper: {
    flex: 1,
    flexDirection: 'column',
  },
  inputGroup: {
    flex: 0.5,
    flexDirection: 'row',
  },
  formWrapper: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 20,
  },
  formControl: {
    flex: 1,
    paddingTop: 20,
    height: 40,
    alignSelf: 'stretch',
  },
  button: {
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
