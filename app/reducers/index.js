"use strict";
import {combineReducers} from 'redux';
import AuthReducer from './AuthReducer';
import FishingEventReducer from './FishingEventReducer';
import MeReducer from './MeReducer';
import ViewReducer from './ViewReducer';
import LocationReducer from './LocationReducer';
var AsyncStorage = require('AsyncStorage');

const reducers = {
    auth: AuthReducer,
    fishingEvents: FishingEventReducer,
    me: MeReducer,
    view: ViewReducer,
    location: LocationReducer
}

let MainReducer = combineReducers(reducers);

const mutateState = (state, action) => {
  const newState = MainReducer(state, action);
  return newState;
}

export default (state, action) => {
  let State = mutateState(state, action);
  return State;
};
