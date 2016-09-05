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


export default function(focusedAttributeId, attribute) {
  if(focusedAttributeId !== attribute.id) {
    return (<View style={styles.errorDot} />);
  }

  const key = focusedAttributeId + attribute.id + 'err';

  return [
    (
      <View key={key + 'bubble'} style={[ styles.bubble, styles.shadow ]}>
        <Text style={[ styles.labelError ]}>
          { attribute.valid.errorMessage }
        </Text>
      </View>
    ),
    (
        <Triangle
          width={16}
          height={12}
          color={'white'}
          direction={'down'}
          style={[styles.shadow, styles.triangle1]}
        />
    ),
  ];
}

const styles = StyleSheet.create({
  labelError: {
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
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadow: {
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 0,
    },
  },
  triangle1: {
    position: 'absolute',
    left: 80,
    top: -1,
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 4,
      width: 0,
    },
  }
});
