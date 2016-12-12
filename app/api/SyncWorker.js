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
      const pastRequests = [];
      t.fishingEvents.forEach(fe => pastRequests.push(this.mutateFishingEvent(fe, t.trip.objectId, t.formType)));
      return this.mutatePastTrip(t.trip, t.vesselId).then(() => Promise.all(pastRequests));
    });

    if(this.requests.length){
      Promise.all(this.requests).then(() => {
        this.requests = [];
        apiActions.checkMe(this.getState().default.auth, this.dispatch);
      });
    }
  }

  dispatchMutatePastTrip(res){
    const time = new moment();
    const callback = (res) => {
      if(res.errors.length){
        throw new Error(res.errors);
      }
      try{
        this.dispatch({
          type: "removeFromQueue",
          name: "pastTrips",
          time
        });
      }catch(e) {
        console.warn(e);
      }
      return {response: res};
    }
  }

  mutatePastTrip(trip){
    const state = this.getState().default;
    const mutation = upsertTrip(trip);
    return this.performMutation(mutation.query, mutation.variables, this.dispatchMutatePastTrip);
  }

  dispatchMutateTrip(res){
    const time = new moment();
    try{
      this.dispatch({
        type: "tripSynced",
        time,
        objectId: res.data.upsertTrip2.trip.id
      });
    }catch(e) {
      console.warn(e);
    }
    return {response: res};
  }

  mutateTrip(trip){
    const state = this.getState().default;
    const mutation = upsertTrip(trip);
    return this.performMutation(mutation.query, mutation.variables, this.dispatchMutateTrip);
  }

  dispatchMutateFishingEvent(fishingEvent, res){
    const time = new moment();
    this.dispatch({
      type: "fishingEventSynced",
      time,
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
    return this.performMutation(q.query, q.variables, (res) => { this.dispatchMutateFishingEvent(fishingEvent, res); });
  }

  performMutation(query, variables, success, dispatch){
    return new Promise((resolve, reject) => {
      this.api.mutate(query, variables, this.getState().default.auth)
        .then((res) => resolve(success(res)))
        .catch((err) => {
          console.warn("performed with error", JSON.stringify(err), err, query, "Chicken");
          this.dispatch({
            type: "syncError",
            time: new moment(),
            err
          });
          resolve(false);
        });
      });
    }

}


export default SyncWorker;
