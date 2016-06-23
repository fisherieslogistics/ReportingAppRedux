"use strict";
import {combineReducers} from 'redux';
import AuthReducer from './AuthReducer';
import FishingEventReducer from './FishingEventReducer';
import MeReducer from './MeReducer';
import ViewReducer from './ViewReducer';
import LocationReducer from './LocationReducer';
import TripReducer from './TripReducer';
import FormReducer from './FormReducer';
import Helper from '../utils/Helper';
const helper = new Helper();
var AsyncStorage = require('AsyncStorage');

const reducers = {
    auth: AuthReducer,
    fishingEvents: FishingEventReducer,
    me: MeReducer,
    view: ViewReducer,
    location: LocationReducer,
    trip: TripReducer,
    forms: FormReducer
}

let MainReducer = combineReducers(reducers);

const mutateState = (state, action) => {
  const newState = MainReducer(state, action);
  if(action.type == 'loadSavedState'){
    let loadedState = MainReducer(undefined, {type: 'init'});
    let savedState = action.savedState
    console.log("SAVED", savedState);
    if(!savedState){
      return newState;
    }
    Object.keys(savedState).forEach((k)=>{
      if(k in reducers){
        loadedState[k] = savedState[k];
      }
    });
    return loadedState;
  }
  helper.saveToLocalStorage(newState, action.type);
  return newState;
}

export default (state, action) => {
  let State = mutateState(state, action);
  return State;
};
