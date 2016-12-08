"use strict";
import{
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Image
} from 'react-native';
import React from 'react';
import { textStyles, iconStyles, colors } from '../../styles/styles';
import Icon8 from './Icon8';

const getActiveOpacity = (disabled) => {
  return disabled ? 1 : 0.6;
}

const getTextStyle = (color, disabled) =>{
  return [
    textStyles.font,
    textStyles.button,
    {color: ! disabled ? color : colors.midGray},
  ];
}

const Button = ({onPress, content, disabled }) => {
  return (
    <TouchableOpacity
      activeOpacity={ getActiveOpacity(disabled) }
      onPress={ disabled ? () => {} : onPress }>
        { content }
    </TouchableOpacity>
  )
}

const IconButton = ({icon, onPress, style, disabled, color}) => {
  let content = (
    <Icon8
      name={icon}
      size={30}
      color={color || 'red'}
      style={style}
    />
  );
  return (
    <Button
      disabled={disabled}
      onPress={onPress}
      content={content}
    />
  );
}

const TextButton = ({text, color, style, onPress, disabled}) => {
  const textStyle = getTextStyle(color, disabled);
  let content = (
    <View style={style}>
      <Text style={textStyle}>
        {text}
      </Text>
    </View>
  );
  return (
    <Button
      disabled={disabled}
      onPress={onPress}
      content={content}
    >
    { content }
    </Button>
  );
}

const LongButton = ({ text, bgColor, onPress, disabled, _style } ) => {
  const colorStyle = {
    backgroundColor: disabled ? colors.transparent : bgColor,
    borderColor: bgColor,
  };
  const txtStyle = { color: '#000', fontSize: 13 };
  const content = (
    <View style={[ colorStyle, _style || {}, styles.longButton ]}>
      <Text style={[txtStyle, textStyles.font]}>
        { text }
      </Text>
    </View>
  );
  return (
    <Button
      disabled={ disabled }
      onPress={ onPress }
      content={ content }
    />
  );
}

const styles = StyleSheet.create({
  longButton: {
    borderWidth: 1,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    borderColor: colors.midGray,
  },
});

export {IconButton, TextButton, LongButton}
