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
import ConnectionReducer from './ConnectionReducer';

import TcpQueue from '../api/TCPQueue';
let tcpQueue;
const helper = new Helper();

const actionsNotSending = [
  'initAutoSuggestBarChoices',
  'NMEAStringRecieved',
  'toggleAutoSuggestBar',
  'changeAutoSuggestBarText',
  'setViewingForm',
  '@@redux',
  '$$redux',
  'updateDataToSend',
];

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
  connection: ConnectionReducer,
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
    if(!tcpQueue){
      tcpQueue = new TcpQueue({ ip: loadedState.me.user.ip, 'port': loadedState.me.user.port });
    }
    return MainReducer(loadedState, action);
  }

  helper.saveToLocalStorage(newState, action.type);
  if(tcpQueue){
    if(action.type === 'setTcpDispatch'){
      tcpQueue.setDispatch(action.payload);
    }

    if(action.type === 'updateUser' && ['hostIp', 'hostPort'].includes(action.inputId)){
      tcpQueue.setClientEndpoint(Object.assign({ip: state.me.user.hostIp, port: state.me.user.hostPort }, action.change));
    }
    if(actionsNotSending.every((str) => action.type.indexOf(str) === -1)) {
      tcpQueue.addToQueue(action.type, action);
    }
  }

  return newState;
}

export default (state, action) => {
  const State = mutateState(state, action);
  return State;
};
