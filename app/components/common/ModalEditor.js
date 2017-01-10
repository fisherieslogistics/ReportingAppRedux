'use strict';
import {
  View,
  Dimensions,
  StyleSheet,
} from 'react-native';

import React, { Component } from 'react';
import { BlurView } from 'react-native-blur';

const styles = StyleSheet.create({
  inputWrapper: {
    flex: 0.85,
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
  },
  bottomSection: {
    flex: 0.5,
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
  },
});


export default class FormContainer extends Component {

  render() {
    const { height, width } = Dimensions.get('window');
    const size = { width, height };
    return (
      <View style={ size }>

        <BlurView blurType="d" style={ styles.blurViewInner  }>

          <View style={ styles.formWrapper }>

            <View style={ styles.topSection }>
              <View style={ styles.inputWrapper } >
                { this.props.inputs }
              </View>
            </View>

            <View style={ styles.bottomSection } >
              <View style={ styles.formControls } >
                <View style={ styles.formControlsInner }>
                  { this.props.controls }
                </View>
              </View>
            </View>

          </View>

        </BlurView>
      </View>
    );
  }
}

/*export class FormControl extends Component {
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
        transparent
        visible={ this.props.visible }
        onRequestClose={ this.props.onRequestClose }
      >
        { this.props.content }
      </Modal>
    );
  }
}*/
