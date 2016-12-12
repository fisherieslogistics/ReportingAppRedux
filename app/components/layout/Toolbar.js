'use strict';
import {
  StyleSheet,
  View,
} from 'react-native';

import React from 'react';
import {colors, shadowStyles } from '../../styles/styles';
import {TextButton, IconButton} from '../common/Buttons';

const renderButton = (button, textAlign) => {
  if( button.icon){
    return (
      <IconButton
        icon={button.icon}
        color={button.color}
        onPress={button.onPress}
        style={ style.iconStyle }
        disabled={!button.enabled}
      />
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
      <View style={masterStyles.center}>
        {center}
      </View>
    </View>
  );
};

const DetailToolbar = (props) => {
  const left = props.left ? (
    <View style={[detailStyles.left]}>
      { renderButton(props.left) }
    </View>
  ) : null;
  const viewStyles = [ detailStyles.toolbar, shadowStyles.shadow, props.style ];
  return (
    <View
      style={viewStyles}
    >
      { left }
      <View style={[detailStyles.center]}>
        <View style={[detailStyles.center]}>
          {props.center}
        </View>
      </View>
      <View style={[detailStyles.right]}>
        { props.right ? renderButton(props.right) : null }
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
   center:{
     alignSelf: 'stretch',
     flex: 1,
     alignItems: 'center'
   }
});

const style = StyleSheet.create({
  iconStyle: {
    width: 50,
    marginTop:29,
    height: 50,
    marginRight: 0,
    backgroundColor: 'transparent'
  },
});

const detailStyles = StyleSheet.create({
   toolbar:{
     backgroundColor: colors.backgrounds.veryDark,
     flexDirection: 'row',
     flex: 0.1,
     height: 70,
   },
   right:{
     alignSelf: 'stretch',
     flex: 0.2,
     alignItems: 'flex-end'
   },
   left: {
     alignSelf: 'stretch',
     flex: 0.2,
     alignItems: 'flex-start'
   },
   center:{
     paddingTop: 10,
     flex: 0.6,
     alignItems: 'flex-start',
   },
});

export {MasterToolbar, DetailToolbar}
