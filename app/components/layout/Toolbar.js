'use strict';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import React from 'react';
import {colors, shadowStyles, textStyles} from '../../styles/styles';
import {TextButton, IconButton} from '../common/Buttons';

const renderButton = (button, textAlign) => {
  if( button.icon){
    const iconStyle = {width: 50, marginTop:29, height: 50, marginRight: 0, backgroundColor: 'transparent'}
    return (
      <IconButton
        icon={button.icon}
        color={button.color}
        onPress={button.onPress}
        style={ button.style || iconStyle }
        disabled={!button.enabled} />
    );
  }
  const textButtonStyle = {marginTop: 34, marginRight: 15, marginLeft: 22, width: 70};
  return (
    <TextButton
      text={button.text}
      style={ button.style || textButtonStyle }
      color={button.color}
      textAlign={textAlign || "left"}
      onPress={button.onPress}
      disabled={!button.enabled}
  />);
}

const MasterToolbar = (props) => {
  const center = props.center && props.center.onPress ? renderButton(props.center, "center") : props.center;
  return (
    <View style={[masterStyles.toolbar, props.style, { backgroundColor: colors.backgrounds.dark }]}>
      <View style={[masterStyles.left]}>
        {props.left ? renderButton(props.left, "left") : null}
      </View>
      <View style={masterStyles.center}>
        {center}
      </View>
    </View>
  );
};

const DetailToolbar = (props) => {
  return (
    <View style={[detailStyles.toolbar, shadowStyles.shadow, props.style || {}]}>
      <View style={[detailStyles.center]}>
        <View style={[detailStyles.center]}>
          {props.center}
        </View>
      </View>
      <View style={[detailStyles.right]}>
        {props.right ? renderButton(props.right) : null}
      </View>
    </View>
  );
};

const masterStyles = StyleSheet.create({
   toolbar:{
     backgroundColor: colors.backgrounds.veryDark,
     flexDirection: 'row',
     height: 70,
   },
   left: {
     alignSelf: 'stretch',
     flex: 0.2,
     alignItems: 'flex-start'
   },
   right:{
     alignSelf: 'stretch',
     flex: 0.2,
     alignItems: 'flex-end'
   },
   center:{
     alignSelf: 'stretch',
     flex: 1,
     alignItems: 'center'
   }
});

const detailStyles = StyleSheet.create({
   toolbar:{
     backgroundColor: colors.backgrounds.veryDark,
     flexDirection: 'row',
     flex: 0.1,
     height: 70
   },
   right:{
     alignSelf: 'stretch',
     flex: 0.2,
     alignItems: 'flex-end'
   },
   center:{
     paddingTop: 10,
     flex: 0.8,
     alignItems: 'flex-start',
   },
});

export {MasterToolbar, DetailToolbar}
