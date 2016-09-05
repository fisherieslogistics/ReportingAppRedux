'use strict';
import {
  View,
  Text,
  Switch,
  AlertIOS,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import React, { Component } from 'react';

import { colors } from '../../styles/styles';
import Triangle from 'react-native-triangle';


export default class ErrorBubble extends Component {

  render() {
    if(this.props.focusedAttributeId !== this.props.attribute.id) {
      return (<View style={styles.errorDot} />);
    }

    const key = this.props.focusedAttributeId + this.props.attribute.id + 'err';

    return [
      (
        <View key={key + 'bubble'} style={[ styles.bubble ]}>
          <Text style={[ styles.labelError ]}>
            { this.props.attribute.valid.errorMessage }
          </Text>
        </View>
      ),
      (
        <View style={[ styles.triangle1 ]} key={ key + 'triangle1' }>
          <Triangle
            width={15}
            height={15}
            color={'black'}
            direction={'down'}
          />
        </View>
      ),
      (
        <View style={[ styles.triangle2 ]} key={ key + 'triangle2' }>
          <Triangle
            width={15}
            height={15}
            color={'white'}
            direction={'down'}
          />
        </View>
      ),
    ];
  }
}

const styles = StyleSheet.create({
  labelError: {
    marginLeft: 4,
    color: colors.orange
  },
  errorDot: {
    width: 10,
    height: 10,
    backgroundColor: colors.orange,
    borderRadius: 5,
    margin: 4,
  },
  bubble: {
    position: 'absolute',
    left: 0,
    top: -50,
    width: 180,
    height: 50,
    backgroundColor: 'white',
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 0,
    },
    borderRadius: 4,
  },
  triangle2: {
    position: 'absolute',
    left: 80,
    top: -3,
  },
  triangle1: {
    position: 'absolute',
    left: 80,
    top: -1,
  }
});
