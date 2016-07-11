'use strict';
import Queries, {
  upsertTrip,
  upsertFishingEvent
} from './Queries';

import Helper from '../utils/Helper';
import moment from 'moment';
const helper = new Helper();
const TIMEOUT = 10000;

class SyncWorker {

  constructor(dispatch, getState, api) {
    this.dispatch = dispatch;
    this.api = api;
    this.getState = getState;
    this.timeToSync = 5000;
    this.requests = [];
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

    const fEventIds = Object.keys(state.sync.fishingEvents);
    this.requests = state.fishingEvents.events.filter(fe => (fEventIds.indexOf(fe.objectId) !== -1))
                                              .map(fe => this.mutateFishingEvent(fe, state.trip.objectId));

    if(state.sync.trip){
      this.requests.push(this.mutateTrip(state.trip, state.me.vessel.id));
    }

    state.sync.queues.pastTrips.slice(0, 1).forEach((t) => {
      let pastRequests = [];
      t.fishingEvents.forEach(fe => pastRequests.push(this.mutateFishingEvent(fe, t.trip.objectId)));
      return Promise.all(pastRequests).then(this.mutatePastTrip(t.trip));
    });

    if(this.requests.length){
      Promise.all(this.requests).then((responses) => {
        this.requests = [];
      });
    }
  }

  mutatePastTrip(trip){
    const state = this.getState().default;
    let mutation = upsertTrip(trip);
    let time = new moment();
    let callback = (res) => {
      try{
        this.dispatch({
          type: "removeFromQueue",
          name: "pastTrips",
          time: time
        });
      }catch(e) {
        console.log(e);
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
      try{
        this.dispatch({
          type: "tripSynced",
          time: time,
          objectId: res.data.upsertTripMutation.trip._id
        });
      }catch(e) {
        console.log(e);
      }
      return {response: res};
    }
    return this.performMutation(mutation.query, mutation.variables, callback.bind(this));
  }

  mutateFishingEvent(fishingEvent, tripId){
    let q = upsertFishingEvent(fishingEvent, tripId);
    let time = new moment();
    let callback = (res) => {
      this.dispatch({
        type: "fishingEventSynced",
        time: time,
        objectId: fishingEvent.objectId
      });
      return {response: res};
    }
    return this.performMutation(q, fishingEvent, callback.bind(this));
  }

  performMutation(query, variables, success, dispatch){
    return this.api.mutate(query, variables, this.getState().default.auth)
      .then(success)
      .catch((err) => {
        this.dispatch({
          type: "syncError",
          time: new moment(),
          err: err
        })
      });
  }

}


export default SyncWorker;
