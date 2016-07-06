'use strict';
import Queries, {
  newTrip,
  updateTrip,
  upsertFishingEvent
} from './Queries';

import Helper from '../utils/Helper';
import moment from 'moment';
const helper = new Helper();

class SyncWorker {

  constructor(dispatch, getState, api, timeoutMS, toSync) {
    this.dispatch = dispatch;
    this.api = api;
    this.getState = getState;
    this.timeToSync = timeoutMS + 5000;
    this.history = {};
    this.requests = [];
  }

  toSyncUpdated(toSync){
    if(!this.requests.length){
      this.startSync(toSync);
    }
  }

  startSync(toSync){
    if(this.requests.length || (!this.getState().default.auth.loggedIn)){
      console.log("no");
      return;
    }
    this.requests = Object.keys(toSync.fishingEvents).map((k) =>  this.mutateFishingEvent(k));
    if(toSync.trip){
      try{
        this.requests.push(this.mutateTrip());
      }catch (e){

      }
    }
    Promise.all(this.requests).then((err, something) => {
      this.requests = [];
      console.log("done");
    });
  }

  mutateTrip(){
    const state = this.getState().default;
    let q = newTrip(state.trip, state.me.vessel.id);
    let time = new moment();
    let callback = (res) => {
      console.log("yaya444", res);
      this.dispatch({
        type: "tripSynced",
        time: time,
        objectId: state.trip.objectId
      });
    }
    return this.performMutation(q, state.trip, callback.bind(this));
  }

  mutateFishingEvent(objectId){
    const fe = this.getState().default.fishingEvents.events.find(f => f.objectId === objectId);
    console.log(objectId);
    let q = upsertFishingEvent(fe);
    let time = new moment();
    let callback = (res) => {
      console.log("yaya", res);
      this.dispatch({
        type: "tripSynced",
        time: time,
        objectId: fe.objectId
      });
    }

    return this.performMutation(q, fe, callback.bind(this));
  }

  performMutation(query, variables, success, dispatch){
    return this.api.mutate(query, variables, this.getState().default.auth).catch((err) => {
      this.dispatch({
        type: "syncError",
        time: new moment(),
        err: err
      })
    }).then(success);
  }

}


export default SyncWorker;
