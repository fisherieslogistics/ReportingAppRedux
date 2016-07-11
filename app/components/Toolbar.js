'use strict';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import React from 'react';
import {colors, shadowStyles, textStyles} from '../styles/styles';
import {TextButton, IconButton} from './Buttons';
const renderButton = (button, textAlign) => {
  if(button.icon){
    return (<IconButton
              icon={button.icon}
              onPress={button.onPress}
              style={{width: 50, marginTop:29, height: 50, marginRight: 0}}
              disabled={!button.enabled} />);
  }
  return (<TextButton
            text={button.text}
            style={{marginTop: 34, marginRight: 15, marginLeft: 22, width: 70}}
            color={button.color}
            textAlign={textAlign || "left"}
            onPress={button.onPress}
            disabled={!button.enabled}  />);
}

const MasterToolbar = (props) => {
  return (
    <View style={[masterStyles.toolbar, props.style]}>
      <View style={[masterStyles.left]}>
        {props.left ? renderButton(props.left, "left") : null}
      </View>
      <View style={masterStyles.center}>
        {props.center}
      </View>
      <View style={[masterStyles.right]}>
        {props.right ? renderButton(props.right, "right") : null}
      </View>
    </View>
  );
};

const DetailToolbar = (props) => {
  return (
    <View style={[detailStyles.toolbar, shadowStyles.shadow, props.style || {}]}>
      <View style={[detailStyles.left]}>
        {props.left ? renderButton(props.left) : null}
      </View>
      <View style={detailStyles.center}>
        <View style={[detailStyles.centerTop]}>
          {props.centerTop}
        </View>
        <View style={[detailStyles.centerBottom]}>
          {props.centerBottom}
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
     backgroundColor: colors.white,
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
     flex: 0.6,
     alignItems: 'center'
   }
});

const detailStyles = StyleSheet.create({
   toolbar:{
     backgroundColor: colors.white,
     flexDirection: 'row',
     flex: 0.1,
     height: 70
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
     paddingTop: 15,
     flex: 0.6,
     alignItems: 'center',
   },
   centerTop:{
     flex: 0.4,
   },
   centerBottom:{
     flex: 0.6,
     alignItems: 'center'
   },
});

export {MasterToolbar, DetailToolbar}
