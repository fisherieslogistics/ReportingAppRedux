"use strict";
import{
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Image
} from 'react-native';
import React from 'react';
import {textStyles, iconStyles, colors} from '../styles/styles';

const getActiveOpacity = (disabled) => {
  return disabled ? 1 : 0.6;
}

const getTextStyle = (color, disabled) =>{
  return [
    textStyles.font,
    textStyles.button,
    {color: !disabled ? color : colors.midGray},
  ];
}

const getLongButtonStyle = (bgColor, disabled) =>{
  return disabled ? {borderWidth: 1, borderColor: colors.midGray} : {backgroundColor: bgColor, borderColor: bgColor};
}

const Button = ({onPress, content, disabled}) => {
  return (
    <TouchableOpacity
      activeOpacity={getActiveOpacity(disabled)}
      onPress={disabled ? () => {} : onPress}>
        {content}
    </TouchableOpacity>
  )
}

const IconButton = ({icon, onPress, style, disabled}) => {
  let content =
    (<View style={[style]}>
      <Image source={icon} style={iconStyles} />
    </View>);
  return (
    <Button
      disabled={disabled}
      onPress={onPress}
      content={content}
    />
  );
}

const TextButton = ({text, color, style, onPress, disabled}) => {
  let textStyle = getTextStyle(color, disabled);
  let content = (<View style={style}><Text style={textStyle}>{text}</Text></View>);
  return (
    <Button
      disabled={disabled}
      onPress={onPress}
      content={content}
    />
  );
}

const LongButton = ({text, bgColor, onPress, disabled}) => {
  let textStyle = {
    fontSize: 14,
    color: !disabled ? colors.white : colors.midGray,
  };
  let vStyle = [styles.longButton];
  vStyle.push(getLongButtonStyle(bgColor, disabled));
  let content = (
    <View style={vStyle}>
      <Text style={[textStyle, textStyles.font]}>{text}</Text>
    </View>
  );
  return (
    <Button
      disabled={disabled}
      onPress={onPress}
      content={content}
      >
      {content}
    </Button>
  );
}

const styles = StyleSheet.create({
  longButton: {
    width: 160,
    padding: 5,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    borderRadius: 3
  }
});

export {IconButton, TextButton, LongButton}
