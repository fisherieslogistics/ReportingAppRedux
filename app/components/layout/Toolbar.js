'use strict';
import {
  View,
} from 'react-native';

import React from 'react';
import { colors, shadowStyles, toolbarStyles } from '../../styles/styles';

const MasterToolbar = (props) => (
    <View style={[toolbarStyles.master, props.style, { backgroundColor: colors.backgrounds.dark }]}>
      <View style={toolbarStyles.inner}>
        {props.center}
      </View>
    </View>
  );

const DetailToolbar = (props) => (
    <View
      style={[ toolbarStyles.master, shadowStyles.shadow, props.style ]}
    >
      <View style={[toolbarStyles.detailCenter]}>
        { props.center }
      </View>
      <View style={[toolbarStyles.right]}>
        { props.right }
      </View>
    </View>
  );

export { MasterToolbar, DetailToolbar }
