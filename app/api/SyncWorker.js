'use strict';
import {
  upsertTrip,
  upsertFishingEvent,
  createMessage,
} from './Queries';

import moment from 'moment';
import ApiActions from '../actions/ApiActions.js';
import net from 'react-native-tcp';
import msgpack from 'msgpack-lite';

const apiActions = new ApiActions();
const helper = new Helper();
const TIMEOUT = 10000;

const HOST = 'fisherieslogistics.com';
const PORT = 5004;

function generateSetances(type, input, payloadLength = 250) {

  function generateString(numberOfFragments, fragmentIndex, fragment) {
    return `$FLL,${type},${numberOfFragments},${fragmentIndex},${fragment}*45`;
  }

  const buffer = msgpack.encode(input);
  const data = buffer.toString('base64');
  const fragmentLength = payloadLength - generateString(99, 99, '').length;
  const numberOfFragments = Math.ceil(data.length/fragmentLength);
  const output = [];
  for(let i = 1; i <= numberOfFragments; i++) {
    const fragment = data.slice((i - 1) * fragmentLength, i * fragmentLength);
    output.push(generateString(numberOfFragments, i,  fragment));
  }
  return output;
}

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
    this.startSync();

    this.client = new net.Socket();

    this.client.connect(PORT, HOST, () => {
      console.log('CONNECTED TO: ' + HOST + ':' + PORT);
    });

    this.client.on('data', (data) => {
      console.log('DATA: ' + data);
    });

    this.client.on('close', () => {
      console.log('Connection closed');
      this.client.connect(PORT, HOST, () => {
        console.log('CONNECTED TO: ' + HOST + ':' + PORT);
      });
    });

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
    /*this.requests = state.fishingEvents.events.filter(fe => (fEventIds.indexOf(fe.objectId) !== -1))
                                              .map(fe => this.mutateFishingEvent(fe, state.trip.objectId, formType));*/
    //if(state.sync.trip){
      this.requests.push(this.mutateTrip(state.trip, state.me.vessel.id));
    //}
    console.log(this.requests);
    /*state.sync.queues.pastTrips.forEach((t) => {
      const pastRequests = [];
      t.fishingEvents.forEach(fe => pastRequests.push(this.mutateFishingEvent(fe, t.trip.objectId, t.formType)));
      return this.mutatePastTrip(t.trip, t.vesselId).then(() => Promise.all(pastRequests));
    });*/

    /*this.requests.forEach(req => {

    })*/
      /*8Promise.all(this.requests).then(() => {
        this.requests = [];
        apiActions.checkMe(this.getState().default.auth, this.dispatch);
      });*/
  }

  mutateTrip(trip){
    const mutation = upsertTrip(trip);
    generateSetances('TRP', mutation.variables).map(
      (sentance) => this.client.write(`${sentance}\r\n`));
      //return this.performMutation(mutation.query, mutation.variables, this.dispatchMutateTrip);
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
    generateSetances('TRP', mutation.variables).map((sentance) => {
      //client.write(`${sentance}\r\n`);
    });
    callback.bind(this)({});
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

  mutatePastTrip(trip){
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
  }

  mutateFishingEvent(fishingEvent, tripId, formType){
    const q = upsertFishingEvent(fishingEvent, tripId);
    const time = new moment();
    const callback = (res) => {
      this.dispatch({
        type: "fishingEventSynced",
        time,
        objectId: fishingEvent.objectId
      });
      return {response: res};
    }
    generateSetances('FSHEVT', mutation.variables).map((sentance) => {
    //  client.write(`${sentance}\r\n`);
    })
    callback.bind(this)({});
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
