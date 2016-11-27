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
    this.dispatchMutateTrip = this.dispatchMutateTrip.bind(this);
    this.dispatchMutatePastTrip = this.dispatchMutatePastTrip.bind(this);
    this.dispatchMutateFishingEvent = this.dispatchMutateFishingEvent.bind(this);
    this.sync = this.sync.bind(this);
    this.mutateTrip = this.mutateTrip.bind(this);
    this.mutateFishingEvent = this.mutateFishingEvent.bind(this);
    this.mutatePastTrip = this.mutatePastTrip.bind(this);
    this.startSync();
  }

  startSync(){
    this.interval = setInterval(() => this.sync(), this.timeToSync);
  }

  sync(){
    const state = this.getState().default;
    if(this.requests.length || (!state.auth.loggedIn)){
      return;
    }
    const formType = state.me.formType;
    const fEventIds = Object.keys(state.sync.fishingEvents);
    this.requests = state.fishingEvents.events.filter(fe => (fEventIds.indexOf(fe.objectId) !== -1))
                                              .map(fe => this.mutateFishingEvent(fe, state.trip.objectId, formType));
    if(state.sync.trip){
      this.requests.push(this.mutateTrip(state.trip, state.me.vessel.id));
    }

    state.sync.queues.pastTrips.forEach((t) => {
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

  dispatchMutatePastTrip(res){
    let time = new moment();
    let callback = (res) => {
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
  }

  mutatePastTrip(trip){
    const state = this.getState().default;
    let mutation = upsertTrip(trip);
    return this.performMutation(mutation.query, mutation.variables, this.dispatchMutateTrip);
  }

  dispatchMutateTrip(res){
    let time = new moment();
    try{
      this.dispatch({
        type: "tripSynced",
        time: time,
        objectId: res.data.upsertTrip2.trip.id
      });
    }catch(e) {
      console.warn(e);
    }
    return {response: res};
  }

  mutateTrip(trip){
    const state = this.getState().default;
    let mutation = upsertTrip(trip);
    return this.performMutation(mutation.query, mutation.variables, this.mutateTrip);
  }

  dispatchMutateFishingEvent(fishingEvent, res){
    let time = new moment();
    this.dispatch({
      type: "fishingEventSynced",
      time: time,
      objectId: fishingEvent.objectId
    });
    return {response: res};
  }

  mutateFishingEvent(fishingEvent, tripId, formType){
    let q;
    if(formType == 'tcer'){
      q = upsertFishingEvent(fishingEvent, tripId);
    }else{
      q = upsertFishingEvent(fishingEvent, tripId);
    }
    return this.performMutation(q.query, q.variables, (res) => { this.dispatchMutateFishingEvent(fishingEvents, res); });
  }

  performMutation(query, variables, success, dispatch){
    return new Promise((resolve, reject) => {
      this.api.mutate(query, variables, this.getState().default.auth)
        .then((res) => resolve(success(res)))
        .catch((err) => {
          console.warn("perfomed with error", JSON.stringify(err), err, query, "Chicken");
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
