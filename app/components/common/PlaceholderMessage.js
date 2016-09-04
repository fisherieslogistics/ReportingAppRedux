"use strict";
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import React from 'react';
import {colors, textStyles} from '../../styles/styles';

export default (props) => {
  return (
    <View style={[styles.wrapper, {backgroundColor: 'transparent'}]}>
      <Text style={[textStyles.largeLabel, textStyles.dark, {marginTop: props.height * 0.35}]}>
        {props.text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'column',
    alignSelf: 'stretch',
    alignItems: 'center',
  }
})