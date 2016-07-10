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
    this.timeToSync = TIMEOUT + 3000;
    this.requests = [];
    this.startSync();
  }

  startSync(){
    this.interval = setInterval(() => this.sync(), this.timeToSync);
  }

  sync(){
    const state = this.getState().default;
    if(this.requests.length || (!state.auth.loggedIn)){
      console.log("request length or not logged", this.requests.length, (!state.auth.loggedIn));
      return;
    }

    const fEventIds = Object.keys(state.sync.fishingEvents);
    this.requests = state.fishingEvents.events.filter(fe => (fEventIds.indexOf(fe.objectId) !== -1))
                                              .map(fe => this.mutateFishingEvent(fe, state.trip.objectId));

    if(state.sync.trip){
      this.requests.push(this.mutateTrip(state.trip, state.me.vessel.id));
    }

    state.sync.queues.pastTrips.forEach((t) => {
      this.requests.push(this.mutateTrip(t.trip, t.vesselId));
      t.fishingEvents.forEach(fe => this.requests.push(this.mutateFishingEvent(fe, t.trip.objectId)));
    });

    if(this.requests.length){
      Promise.all(this.requests).then((responses) => {
        this.requests = [];
        console.log("done", responses);
      });
    }
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
    console.log(fishingEvent, tripId);
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
    console.log(query);
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
