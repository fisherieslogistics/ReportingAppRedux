'use strict';
import Queries, {
  upsertTrip,
  upsertFishingEvent,
} from './Queries';

import Helper from '../utils/Helper';
import moment from 'moment';
import ApiActions from '../actions/ApiActions.js';
const apiActions = new ApiActions();
const helper = new Helper();
const TIMEOUT = 6000;

class SyncWorker {

  constructor(dispatch, getState, api) {
    this.dispatch = dispatch;
    this.api = api;
    this.getState = getState;
    this.timeToSync = 3000;
    this.requests = [];
    this.startSync();
  }

  startSync(){
    this.interval = setInterval(() => this.sync(), this.timeToSync);
  }

  sync(){
    const state = this.getState().default;
    console.log('sync?');
    if(this.requests.length || (!state.auth.loggedIn)){
      return;
    }
    console.log('sync');
    const formType = state.me.formType;
    const fEventIds = Object.keys(state.sync.fishingEvents);
    this.requests = state.fishingEvents.events.filter(fe => (fEventIds.indexOf(fe.objectId) !== -1))
                                              .map(fe => this.mutateFishingEvent(fe, state.trip.objectId, formType));
    if(state.sync.trip){
      this.requests.push(this.mutateTrip(state.trip, state.me.vessel.id));
    }

    console.log(state.sync.queues.pastTrips.length, "any?");
    state.sync.queues.pastTrips.forEach((t) => {
      console.log('mutateTrip', t)
      let pastRequests = [];
      t.fishingEvents.forEach(fe => pastRequests.push(this.mutateFishingEvent(fe, t.trip.objectId, t.formType)));
      return this.mutatePastTrip(t.trip, t.vesselId).then((res) => {
        Promise.all(pastRequests).then();
      })
    });

    if(this.requests.length){
      Promise.all(this.requests).then((responses) => {
        this.requests = [];
        apiActions.checkMe(this.getState().default.auth, this.dispatch);
      });
    }



  }

  mutatePastTrip(trip){
    const state = this.getState().default;
    let mutation = upsertTrip(trip);
    let time = new moment();
    let callback = (res) => {
      console.log("SYNCING Past TRIPs");
      try{
        this.dispatch({
          type: "removeFromQueue",
          name: "pastTrips",
          time: time
        });
      }catch(e) {
        console.warn(e);
      }
      return {response: res};
    }
    return this.performMutation(mutation.query, mutation.variables, callback.bind(this));
  }

  mutateTrip(trip){
    const state = this.getState().default;
    let mutation = upsertTrip(trip);
    let time = new moment();
    let callback = (res) => {
      console.log("SYNCING TRIP");
      try{
        this.dispatch({
          type: "tripSynced",
          time: time,
          objectId: res.data.upsertTrip2.trip.id
        });
      }catch(e) {
        //console.warn(e);
      }
      return {response: res};
    }
    return this.performMutation(mutation.query, mutation.variables, callback.bind(this));
  }

  mutateFishingEvent(fishingEvent, tripId, formType){
    let q;
    if(formType == 'tcer'){
      q = upsertFishingEvent(fishingEvent, tripId);
    }else{
      q = upsertFishingEvent(fishingEvent, tripId);
    }
    let time = new moment();
    let callback = (res) => {
      console.log("SYNCING fishin even");
      this.dispatch({
        type: "fishingEventSynced",
        time: time,
        objectId: fishingEvent.objectId
      });
      return {response: res};
    }
    return this.performMutation(q.query, q.variables, callback.bind(this));
  }

  performMutation(query, variables, success, dispatch){
    return new Promise((resolve, reject) => {
      this.api.mutate(query, variables, this.getState().default.auth)
        .then((res) => resolve(success(res)))
        .catch((err) => {
          console.warn("peromed not nice", err);
          this.dispatch({
            type: "syncError",
            time: new moment(),
            err: err
          });
          resolve(false);
        });
      });
    }

}


export default SyncWorker;
