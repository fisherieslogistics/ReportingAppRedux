'use strict';
import {
  View,
  StyleSheet,
  Modal,
} from 'react-native';

import React, { Component } from 'react';
import FormContainer from './common/ModalEditor';
import CoordinateEditor from './CoordinateEditor';
import { TextButton } from './common/Buttons';
import { colors } from '../styles/styles';

const inputOrder = [
  'latDegrees',
  'latMinutes',
  'latSeconds',
  'lonDegrees',
  'lonMinutes',
  'lonSeconds'
];

const styles = StyleSheet.create({
  formWrapper: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 20,
  },
  doneButton: {
    alignSelf: 'flex-end',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 25,
    marginTop: 10,
  },
});


export default class ModalLocationForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      nextInput: null,
    }
    this.onEnterPress = this.onEnterPress.bind(this);
  }

  onEnterPress(inputName){
    const index = inputOrder.indexOf(inputName);
    const input = (index === inputOrder.length -1) ? inputOrder[0] : inputOrder[index + 1];
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
          onEnterPress={ this.onEnterPress }
          nextInput={ this.state.nextInput }
        />
        <CoordinateEditor
          coordType={'longitude'}
          location={ this.props.location }
          attribute={ this.props.attribute }
          onChange={ this.props.onChange }
          onEnterPress={ this.onEnterPress }
          nextInput={ this.state.nextInput }
        />
      </View>
    );
    const controls = (
      <View style={ styles.doneButton }>
        <TextButton text={ 'Done' }
                    color={ colors.blue }
                    style={ styles.button }
                    onPress={ this.props.onRequestClose }
         />
      </View>
    );
    const form = (
      <FormContainer
        inputs={ inputs }
        controls={ controls }
      />
    );
    return (
      <Modal
        animationType={ 'fade' }
        transparent
        visible
        onRequestClose={ this.props.onRequestClose }
      >
        { form }
      </Modal>
    );
  }
}
