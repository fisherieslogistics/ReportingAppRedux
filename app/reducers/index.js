"use strict";
import {combineReducers} from 'redux';
import AuthReducer from './AuthReducer';
var AsyncStorage = require('AsyncStorage');

const reducers = {
    auth: AuthReducer
}

let MainReducer = combineReducers(reducers);

const mutateState = (state, action) => {
  const new_state = MainReducer(state, action);
  return new_state;
}

export default (state, action) => {
  let _state = mutateState(state, action);
  return _state;
};
