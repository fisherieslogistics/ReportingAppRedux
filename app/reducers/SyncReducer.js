"use strict";
import moment from 'moment';

const initialState = {
  ports: [],
  fishingEvents: {},
  trip: {},
  pastTrips: [],
  pastFishingEvents: [],
  geopoints:[],
  updatedAt: new moment(),
  keysToSync: ["ports", "trip", "fishingEvents", "geopoints", "pastTrips", "pastFishingEvents"]
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'addToQueue':
      debugger;
      state = updateTime(state);
      return addToQueue(action, state)
    case 'removeFromQueue':
      return removeFromQueue(action, state);
    case 'addToKeyStore':
      state = updateTime(state);
      return updateKeyStore(action, state);
    case 'removeKey':
      return removeKey(action, state);
    case "clearQueue":
      return clearQueue(action, state);
    case "endTrip":
      state = clearKeyStore("trip");
      state = clearKeyStore("fishingEvents");
      return state;
    default:
      return state;
  }
};

const updateTime = (state) => {
  return update("updatedAt", new moment(), state);
}

const updateKeyStore = ({name, guid}, state) => {
  let keyStore = Object.assign({}, state[name]);
  keyStore = update(guid, new moment(), keyStore);
  return update(name, keyStore, state);
}

const removeKey = ({name, guid}, state) => {
  let keyStore = update({}, state[name]);
  delete keyStore[id];
  return update(name, keyStore, state);
}

const addToQueue = ({name, obj}, state) => {
  let queue = [...state[name], obj];
  state[name] = queue;
  return state;
}

const removeFromQueue = ({name}, state) => {
  console.log(name);
  let queue = [...state[name]];
  let obj = queue.shift();
  obj = null;
  state[name] = queue;
  return queue;
}

const clearQueue = ({name}, state) => {
  return(update(name, [], state));
}

const clearKeyStore = ({name}, state) => {
  return(update(name, {}, state));
}

const update = (key, value, obj) => {
  const change = {};
  change[key] = value;
  return Object.assign({}, obj, change);
}
