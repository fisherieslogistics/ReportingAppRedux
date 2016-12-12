"use strict";
import{
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import React from 'react';
import { textStyles, colors } from '../../styles/styles';
import Icon8 from './Icon8';


const styles = StyleSheet.create({
  longButton: {
    borderWidth: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const getActiveOpacity = (disabled) => disabled ? 1 : 0.6

const getTextStyle = (color, disabled) =>[
    textStyles.font,
    textStyles.button,
    {color: ! disabled ? color : colors.midGray},
];

const Button = ({onPress, content, disabled }) => (
    <TouchableOpacity
      activeOpacity={ getActiveOpacity(disabled) }
      onPress={ disabled ? () => {} : onPress }>
        { content }
    </TouchableOpacity>
  )

const IconButton = ({icon, onPress, style, disabled, color}) => {
  const content = (
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
  const content = (
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

const LongButton = ({ text, bgColor, onPress, disabled, active, error } ) => {
  const backgroundColor = active ? bgColor : colors.transparent;
  const colorStyle = {
    backgroundColor,
    borderColor: bgColor,
  };
  let textColor = active ? colors.white : bgColor;
  if(disabled){
    textColor = colors.transparent;
  }
  const txtStyle = { color: textColor, fontSize: 16 };
  if(active){
    txtStyle.fontWeight = '600';
  }
  if(error){
    colorStyle.borderBottomColor = colors.orange;
    colorStyle.borderTopColor = colors.orange;
  }
  const content = (
    <View style={[ colorStyle, styles.longButton ]}>
      <Text style={[textStyles.font, txtStyle]}>
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

export {IconButton, TextButton, LongButton}
