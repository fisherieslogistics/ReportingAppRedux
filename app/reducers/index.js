"use strict";
import { combineReducers } from 'redux';
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
import ChatReducer from './ChatReducer';

import moment from 'moment';
let then = new moment();

import TCPQueue from '../api/TCPQueue';
const tcpQueue = new TCPQueue();

const helper = new Helper();
const AsyncStorage = require('AsyncStorage');

const reducers = {
  chat: ChatReducer,
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
  if(action.type === 'loadSavedState'){
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
  console.log(action.type);
  tcpQueue.addToQueue('ACT', action);
  const now = new moment();
  console.log(now.diff(then, 'seconds'));
  if(then.diff(now, 'seconds') > 10) {
    console.log("Snapshot Bros");
    const clone = Object.assign({}, newState);
    tcpQueue.addToQueue('STE', helper.deflate({ snapshotAt: new moment().toISOString(), data: newState }));
    then = now;
  }
  return newState;
}

export default (state, action) => {
  const State = mutateState(state, action);
  return State;
};
