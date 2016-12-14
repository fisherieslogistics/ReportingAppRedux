'use strict';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import React from 'react';

import {shadowStyles, colors, styles, masterDetailStyles } from '../../styles/styles';

const MasterDetail = (props) => {
  const masterFlex = 0.3;
  const detailFlex = 0.7;
  return (
    <View style={[masterDetailStyles.wrapper]}>
      {props.modal}
      <View style={[masterDetailStyles.row]}>
        <View style={[masterDetailStyles.master, {flex: masterFlex}, shadowStyles.shadowRight]}>
          <View style={{}}>
            {props.masterToolbar}
          </View>
          <View style={[masterDetailStyles.col,{borderTopWidth: 1, borderTopColor: colors.midGray}]}>
            {props.master}
          </View>
        </View>
        <View style={[masterDetailStyles.detail, {flex: detailFlex}]}>
          <View style={[shadowStyles.shadowDown, {borderLeftWidth: 1, borderLeftColor: colors.midGray}]}>
            {props.detailToolbar}
          </View>
          <View style={[masterDetailStyles.col, { padding: 5 }]}>
            {props.detail}
          </View>
        </View>
      </View>
  </View>);
};

export default MasterDetail
