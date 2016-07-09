'use strict';
import Queries, {
  newTrip,
  updateTrip,
  upsertFishingEvent
} from './Queries';

import Helper from '../utils/Helper';
import moment from 'moment';
const helper = new Helper();
const TIMEOUT = 5000;

class SyncWorker {

  constructor(dispatch, getState, api) {
    this.dispatch = dispatch;
    this.api = api;
    this.getState = getState;
    this.timeToSync = TIMEOUT + 3000;
    this.requests = [];
    this.startSync();
  }

  startSync(){
    this.interval = setInterval(() => this.sync(), 5000);
  }

  sync(){
    const state = this.getState().default;
    if(this.requests.length || (!state.auth.loggedIn)){
      console.log("request length or not logged", this.requests.length, (!state.auth.loggedIn));
      return;
    }

    const fEventIds = Object.keys(state.sync.fishingEvents);
    this.requests = state.fishingEvents.events.filter(fe => fEventIds.indexOf(fe.objectId !== -1))
                                              .map(fe => this.mutateFishingEvent(fe, state.trip.objectId));
    if(state.sync.trip){
      this.requests.push(this.mutateTrip());
    }

    if(this.requests.length){
      Promise.all(this.requests).then((err, something) => {
        this.requests = [];
        console.log("done", err, something);
      });
    }
  }

  mutateTrip(){
    const state = this.getState().default;
    let q = newTrip(state.trip, state.me.vessel.id);
    let time = new moment();
    let callback = (res) => {
      this.dispatch({
        type: "tripSynced",
        time: time,
        objectId: state.trip.objectId
      });
      return {response: res};
    }
    return this.performMutation(q, state.trip, callback.bind(this));
  }

  mutateFishingEvent(fishingEvent, tripId){
    let q = upsertFishingEvent(fishingEvent, tripId);
    console.log(q);
    let time = new moment();
    let callback = (res) => {
      debugger;
      this.dispatch({
        type: "tripSynced",
        time: time,
        objectId: fishingEvent.objectId
      });
      return {response: res};
    }
    debugger;
    return this.performMutation(q, fishingEvent, callback.bind(this));
  }

  performMutation(query, variables, success, dispatch){
    return this.api.mutate(query, variables, this.getState().default.auth)
      .then(success)
      .catch((err) => {
        console.log("rrr", err);
        debugger;
        this.dispatch({
          type: "syncError",
          time: new moment(),
          err: err
        })
      });
  }

}


export default SyncWorker;
