'use strict';
import Queries, {
  newTrip2,
  updateTrip,
  upsertFishingEvent
} from './Queries';

import Helper from '../utils/Helper';
import moment from 'moment';
const helper = new Helper();
const syncActionCallbacks = {

}

class SyncWorker {

  constructor(dispatch, getState, api, timeoutMS, toSync) {
    this.dispatch = dispatch;
    this.api = api;
    this.getState = getState;
    this.timeToSync = timeoutMS + 5000;
    this.history = {}
    this.requests = [];
    this.toSyncUpdated(toSync);
  }

  toSyncUpdated(toSync){
    this.syncTime = new moment(toSync.updatedAt.unix());
    console.log(this.syncTime);
    if(this.requests.length){
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
        console.log(err, something);
    });
  }

  getRequest(name, todo){
    console.log(name, todo);
    if(Array.isArray(todo)){
      return this.getQueuedMutation(name, todo);
    }
    else{
      return Object.keys(todo).map((k) => {
        let updateAt = todo[k];
        this.updateFromState(name, k, updateAt);
      });
    }
  }

  updateFromState(key, guid, updatedAt){
    if(key == "trip"){
      let trip = this.getState().default.trip;
      let vesselId = this.getState().default.me.vessel.id;
      let mutation = this.getTripMutation(trip, vesselId);
      debugger;
      return this.performMutation(mutation.query, mutation.variables, (uuu, iii) => { console.log(arguments)});
    }
  }

  getTripMutation(trip, vesselId){
    return newTrip2(trip, vesselId);
  }

  getFishingEventMuation(guid){
     this.getState().default.fishingEvents.events.find(fe => fe.guid === guid);
     return this.api.mutate("fishingEvents", fEvent, this.getFishingEventCallback(fEvent));
  }

  performMutation(query, variables, callback){
    return this.api.mutate(query, variables, this.getState().default.auth, callback).catch((err) => {
      console.log(err);
    });
  }

  getQueuedMutation(key, variables){
    console.log(key, variables);
    return Promise.resolve();//this.getMutation(query, variables, (res) => res.data.forEach((id) => removeFromQueue[key]));
  }

}


export default SyncWorker;
