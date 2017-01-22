"use strict";
import { combineReducers } from 'redux';
import FishingEventReducer from './FishingEventReducer';
import MeReducer from './MeReducer';
import ViewReducer from './ViewReducer';
import TripReducer from './TripReducer';
import FormReducer from './FormReducer';
import Helper from '../utils/Helper';
import EventsReducer from './EventsReducer';
import MigrationReducer from './MigrationReducer';
import HistoryReducer from './HistoryReducer';
import ChatReducer from './ChatReducer';
import LocationReducer from './LocationReducer';
import moment from 'moment';

import TCPQueue from '../api/TCPQueue';
const tcpQueue = new TCPQueue();
const helper = new Helper();
const then = new moment();

const actionsNotSending = [
  'initAutoSuggestBarChoices',
  'NMEAStringRecieved',
  'toggleAutoSuggestBar',
  'changeAutoSuggestBarText',
  '@@redux',
  '$$redux',
];

function createSnapshotMessage(state) {
  const clone = Object.assign({}, state);
  const {
    chat,
    fishingEvents,
    trip,
    forms,
  } = clone;
  const snapShot = JSON.stringify(helper.deflate({ chat, fishingEvents, trip, forms }));
  const parts = snapShot.match(/[\s\S]{1,100}/g) || [];
  const snapshotId = `${clone.trip.id}-${new moment().toISOString()}`;
  return parts.map((part, index) => ({
      snapshotId,
      part,
      index,
  }));
}

function sendStateInParts(key, state) {
  const snap = createSnapshotMessage(state);
  snap.forEach((s, i) => {
    tcpQueue.addToQueue(`{key}:${i}`, s);
  });
}

const reducers = {
  chat: ChatReducer,
  fishingEvents: FishingEventReducer,
  me: MeReducer,
  view: ViewReducer,
  trip: TripReducer,
  forms: FormReducer,
  uiEvents: EventsReducer,
  migrations: MigrationReducer,
  location: LocationReducer,
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
  if(action.type === 'setTcpDispatch'){
    tcpQueue.setDispatch(action.payload);
  }
  if(actionsNotSending.every((str) => action.type.indexOf(str) === -1)) {
    setTimeout(() => tcpQueue.addToQueue('ACT', action), 500);
  }

  //const now = new moment();
  if(action.type === 'endTrip'){
    //sendStateInParts('$ENDTRIP', { trip: state.trip, fishingEvents: state.fishingEvents.events });
  }
  return newState;
}

export default (state, action) => {
  const State = mutateState(state, action);
  return State;
};
