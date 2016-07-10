"use strict";

import Helper from '../utils/Helper';
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
      return Object.assign({}, initialState);
    case 'loginError':
      return Object.assign({}, initialState, { message: action.message});
    default:
        return state;
  }
};
