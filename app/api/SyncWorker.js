'use strict';
import {
  upsertTrip,
  upsertFishingEvent,
  createMessage,
} from './Queries';

import moment from 'moment';
import ApiActions from '../actions/ApiActions';
import UserActions from '../actions/UserActions';
const apiActions = new ApiActions();
const userActions = new UserActions();

class SyncWorker {

  constructor(dispatch, getState, api, timeToSync) {
    this.dispatch = dispatch;
    this.api = api;
    this.getState = getState;
    this.timeToSync = timeToSync;
    this.requests = [];
    this.dispatchMutateTrip = this.dispatchMutateTrip.bind(this);
    this.dispatchMutatePastTrip = this.dispatchMutatePastTrip.bind(this);
    this.dispatchMutateFishingEvent = this.dispatchMutateFishingEvent.bind(this);
    this.sync = this.sync.bind(this);
    this.mutateTrip = this.mutateTrip.bind(this);
    this.mutateFishingEvent = this.mutateFishingEvent.bind(this);
    this.mutatePastTrip = this.mutatePastTrip.bind(this);
    this.dispatchMessageSent = this.dispatchMessageSent.bind(this);
    this.mutateMessage = this.mutateMessage.bind(this);
    this.performMutation = this.performMutation.bind(this);
    // this.startSync();
  }

  startSync(){
    clearTimeout(this.syncTime);
    this.syncTime = setTimeout(this.sync, this.timeToSync);
  }

  sync(){

    const state = this.getState().default;
    if(!state.auth.loggedIn){
      return;
    }
    this.requests.push(apiActions.checkMe(this.getState().default.auth, this.dispatch));
    const fEventIds = Object.keys(state.sync.fishingEvents);
    this.requests = state.fishingEvents.events.filter(fe => (fEventIds.indexOf(fe.objectId) !== -1))
                                              .map(fe => this.mutateFishingEvent(fe, state.trip.objectId,));
    if(state.sync.trip){
      this.requests.push(this.mutateTrip(state.trip, state.me.vessel.id));
    }

    const msg = state.sync.queues.messages.shift();
    if(msg) {
      this.requests.push(this.mutateMessage(msg));
    }

    const allPastRequests = state.sync.queues.pastTrips.map(
      (t) => new Promise(resolve => this.mutatePastTrip(t.trip, t.vesselId).then(
        () => Promise.all(t.fishingEvents.map(fe => this.mutateFishingEvent(fe, t.trip.objectId))).then(resolve))));

    Promise.all([ ...this.requests.concat(allPastRequests)]).then(() => {
      this.requests = [];
      this.syncTimeout = setTimeout(this.sync, this.timeToSync);
    }).catch(() => {
      this.requests = [];
      this.syncTimeout = setTimeout(this.sync, this.timeToSync);
    });
  }

  dispatchMessageSent() {
    this.dispatch(userActions.messageSent());
  }

  dispatchTrip(actionType) {
    this.dispatch({
      type: actionType,
    });
  }

  dispatchMutatePastTrip(){
    return this.dispatchTrip("pastTripSynced");
  }

  dispatchMutateTrip(){
    return this.dispatchTrip("tripSynced");
  }

  mutatePastTrip(trip){
    const mutation = upsertTrip(trip);
    return this.performMutation(mutation.query, mutation.variables, this.dispatchMutatePastTrip);
  }

  mutateMessage(message) {
    const { query, variables } = createMessage(message);
    return this.performMutation(query, variables, this.dispatchMessageSent);
  }

  mutateTrip(trip){
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

  mutateFishingEvent(fishingEvent, tripId){
    const query = upsertFishingEvent(fishingEvent, tripId);
    return this.performMutation(query.query, query.variables, (res) => { this.dispatchMutateFishingEvent(fishingEvent, res); });
  }

  performMutation(query, variables, success){
    return new Promise((resolve, reject) => this.api.mutate(
      query, variables, this.getState().default.auth).then(
        (res) => {
          const diso = success(res);
          resolve(diso);
        }).catch(
          (err) => reject(err)));
  }

}


export default SyncWorker;
