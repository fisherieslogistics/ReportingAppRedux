'use strict';
import {
  View,
  Modal,
  Dimensions,
  StyleSheet,
} from 'react-native';

import React, { Component } from 'react';
import { BlurView } from 'react-native-blur';

export class FormContainer extends Component {

  render() {
    let { height, width } = Dimensions.get('window');
    return (
      <View style={ { width: width, height: height }, styles.formContainer }>

        <BlurView blurType="d" style={ styles.blurViewInner  }>

          <View style={[ styles.formWrapper ]}>

            <View style={[ styles.topSection ]}>
              <View style={[ styles.inputWrapper ]} >
                { this.props.inputs }
              </View>
              <View style={[ styles.formControls ]} >
                <View style={ [styles.formControlsInner] }>
                  { this.props.controls }
                </View>
              </View>
            </View>

            <View style={[ styles.bottomSection ]} >
            </View>

          </View>

        </BlurView>
      </View>
    );
  }
}

export class FormControl extends Component {
  render(){
    return (
      <View style={[ styles.formControl ]} key={this.props.key}>
        { this.props.control }
      </View>
    )
  }
}

export default class ModalEditor extends Component {
  render(){
    return (
      <Modal
        animationType={ 'fade' }
        transparent={ true }
        visible={ this.props.visible }
        onRequestClose={ this.props.onRequestClose }
      >
        { this.props.content }
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  inputWrapper: {
    flex: 0.85,
  },
  formControl: {
    flex: 0.15,
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
    //ackgroundColor: 'orange',
    borderWidth: 1,
  },
  formControls: {
    flex: 0.15,
  },
  formControlsInner: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  topSection: {
    flex: 0.5,
    flexDirection: 'row',
    backgroundColor: "#fff",
  },
  bottomSection: {
    //backgroundColor: "white",
    flex: 0.5,
  },
  clearfix1: {
    flex: 0.1,
  },
  formContainer: {
    flex: 1,
  },
  blurViewInner: {
    flex: 1,
    padding: 15,
    paddingLeft: 60,
    paddingRight: 60,
  },
  formWrapper: {
    alignItems: 'stretch',
    flex: 1,
    //backgroundColor: 'orange',
  },
});
