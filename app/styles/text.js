"use strict";
import {
  StyleSheet
} from 'react-native';
import colors from './darkColors';

export default StyleSheet.create({
  midLabel: {
    lineHeight: 22,
    fontSize: 20,
    fontWeight: "400",
    color: '#fff',
  },
  midLabel2:{
    fontSize: 24,
    fontWeight: "300",
      color: '#fff',
  },
  largeLabel: {
    lineHeight: 35,
    fontSize: 30,
      color: '#fff',
  },
  font: {
    fontFamily: 'System'
  },
  light: {
    color: colors.midGray,
  },
  dark: {
    color: colors.darkGray,
  },
  black: {
    color: colors.black,
  },
  white: {
    color: 'white'
  },
  listView: {
    fontSize: 20,
  },
  logo1: {
    fontSize: 23,
    color: colors.white
  },
  logo2: {
    fontSize: 23,
    color: colors.pastelGreen
  },
  button: {
    fontSize: 20,
    fontWeight: "400",
    color: '#fff',
  }
});
