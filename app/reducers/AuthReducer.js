"use strict";

import Helper from '../utils/Helper';
import {
  AlertIOS,
} from 'react-native';
const helper = new Helper();

const initialState = {
  loggedIn: false,
  token: null,
  refreshToken: null,
  message: ""
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'setAuth':
      return helper.updateAuth(state, action.auth);
    case 'logout':
    case 'devMode':
      return Object.assign({}, initialState);
    case 'loginError':
    AlertIOS.alert(
      "Login Error",
      'Cannot login, check email/password',
      [
        {text: 'Ok', onPress: () => {
          return;
        }, style: 'cancel'},
      ]
    );
      return Object.assign({}, initialState, { message: action.message});
    default:
        return state;
  }
};
