'use strict';
import Queries, {
  newTrip,
  updateTrip,
  upsertFishingEvent
} from './Queries';

import {
  removeFromQueue,
  removeFromKeyStore,
  addToKeyStore,
  addToQueue
} from '../actions/SyncActions';

import Helper from '../utils/Helper';
import moment from 'moment';
const helper = new Helper();

class SyncWorker {

  constructor(dispatch, getState, api, timeoutMS, toSync) {
    this.dispatch = dispatch;
    this.initMutations();
    this.initCallbacks();
    this.api = api;
    this.getState = getState;
    this.timeToSync = timeoutMS + 5000;
    this.history = {};
    this.requests = [];
    this.toSyncUpdated(toSync);
  }

  initMutations(){
    this.mutations = {
      "trip": () => {
        const state = this.getState().default;
        return newTrip(state.trip, state.me.vessel.id);
      },
      "fishingEvent": (giud) => {
        const fe = this.getState().default.fishingEvents.events.find(f => f.fishyFishId == guid);
        return upsertFishingEvent(fe);
      },
    }
  }
  initCallbacks() {
    const keyUpdated = (responseText, key, guid) => {
      console.log(responseText);
      this.history[guid] = new moment();
      this.dispatch(removeFromKeyStore(key, guid));
    };
    const onError = (err, key, guid) => {
      console.log(err);
      this.dispatch(addToKeyStore(key, guid));
    }
    const keyStoreCallbacks = {success: keyUpdated.bind(this), error: onError.bind(this)};
    this.callbacks = {
      "trip": keyStoreCallbacks,
      "fishingEvent": keyStoreCallbacks
    };
  }

  toSyncUpdated(toSync){
    if(this.requests.length){
      setTimeout(() => this.toSyncUpdated(toSync), )
      return;
    }
    this.startSync(toSync);
  }

  startSync(toSync){
    let requests = toSync.keysToSync.map((k) => {
      let req = this.getRequest(k, toSync[k]);
      return req;
    }).filter(r => !!r);
    this.requests = requests;
    Promise.all(requests).then((err, something) => {
      this.requests = [];
    });
  }

  getRequest(name, todo){
    if(Array.isArray(todo)){
      //return this.getQueuedMutation(name, todo);
    }
    else{
      return Object.keys(todo).map((k) => {
        this.updateFromState(name, k);
      });
    }
  }

  updateFromState(key, guid){
    const { query, variables } = this.mutations[key](guid);
    const { success, error } = this.callbacks[key];
    return this.performMutation(query, variables,
      success.bind(this, null, key, guid),
      error.bind(this, null, key, guid));
  }

  getTripMutation(){
    let trip = this.getState().default.trip;
    let vesselId = this.getState().default.me.vessel.id;
    return newTrip(trip, vesselId);
  }

  getFishingEventMuation(guid){
     this.getState().default.fishingEvents.events.find(fe => fe.guid === guid);
     return this.api.mutate("fishingEvents", fEvent, this.getFishingEventCallback(fEvent));
  }

  performMutation(query, variables, success, error){
    return this.api.mutate(query, variables, this.getState().default.auth).catch(error).then(success);
  }

  getQueuedMutation(key, variables){
    return Promise.resolve();//this.getMutation(query, variables, (res) => res.data.forEach((id) => removeFromQueue[key]));
  }

}


export default SyncWorker;
