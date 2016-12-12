"use strict";
import {combineReducers} from 'redux';
import AuthReducer from './AuthReducer';
import FishingEventReducer from './FishingEventReducer';
import MeReducer from './MeReducer';
import ViewReducer from './ViewReducer';
import TripReducer from './TripReducer';
import FormReducer from './FormReducer';
import Helper from '../utils/Helper';
import EventsReducer from './EventsReducer';
import SyncReducer from './SyncReducer';
import APIReducer from './APIReducer';
import MigrationReducer from './MigrationReducer';
import HistoryReducer from './HistoryReducer';

const helper = new Helper();
const AsyncStorage = require('AsyncStorage');

const reducers = {
  auth: AuthReducer,
  fishingEvents: FishingEventReducer,
  me: MeReducer,
  view: ViewReducer,
  trip: TripReducer,
  forms: FormReducer,
  uiEvents: EventsReducer,
  sync: SyncReducer,
  api: APIReducer,
  migrations: MigrationReducer,
  history: HistoryReducer,
}

const MainReducer = combineReducers(reducers);

const mutateState = (state, action) => {
  const newState = MainReducer(state, action);
  if(action.type == 'loadSavedState'){
    const loadedState = MainReducer(undefined, {type: 'init'});
    const savedState = action.savedState
    if(!savedState){
      return newState;
    }
    Object.keys(savedState).forEach((k)=>{
      if(k in reducers){
        loadedState[k] = savedState[k];
      }
    });
    return MainReducer(loadedState, action);
  }
  helper.saveToLocalStorage(newState, action.type);
  return newState;
}

export default (state, action) => {
  const State = mutateState(state, action);
  return State;
};
