'use strict';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import React from 'react';

import {shadowStyles, colors} from '../styles/styles';

const MasterDetail = (props) => {
  let masterFlex = props.sizes ? props.sizes.d : 0.3;
  let detailFlex = props.sizes ? props.sizes.m : 0.7;
  return (
    <View style={[styles.wrapper]}>
      {props.modal}
      <View style={[styles.row]}>
        <View style={[styles.master, {flex: masterFlex}, shadowStyles.shadowRight]}>
          <View style={{}}>
            {props.masterToolbar}
          </View>
          <View style={[styles.col,{borderTopWidth: 1, borderTopColor: colors.midGray}]}>
            {props.master}
          </View>
        </View>
        <View style={[styles.detail, {flex: detailFlex}]}>
          <View style={[shadowStyles.shadowDown, {borderLeftWidth: 1, borderLeftColor: colors.midGray}]}>
            {props.detailToolbar}
          </View>
          <View style={[styles.col]}>
            {props.detail}
          </View>
        </View>
      </View>
  </View>);
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    alignSelf: 'stretch',
    backgroundColor: colors.backgrounds.dark,
  },
  col: {
    flexDirection: 'column',
    flex: 1
  },
  row: {
    flexDirection: 'row',
    flex: 1
  },
  background:{
    backgroundColor: colors.backgrounds.dark,
  },
  master: {
    flexDirection: 'column',
    alignSelf: 'stretch',
  },
  detail:{
    flex: 0.7,
    flexDirection: 'column',
  },
});

export default MasterDetail
