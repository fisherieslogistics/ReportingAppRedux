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

import net from 'react-native-tcp';

var HOST = 'fisherieslogistics.com';
var PORT = 5004;

var client = new net.Socket();
client.connect(PORT, HOST, function() {
  console.log('CONNECTED TO: ' + HOST + ':' + PORT);
});

client.on('data', function(data) {

  console.log('DATA: ' + data);

});

client.on('close', function() {
  console.log('Connection closed');
    client.connect(PORT, HOST, function() {
        console.log('CONNECTED TO: ' + HOST + ':' + PORT);
    });
});




var msgpack = require("msgpack-lite");

function generateSetances(type, input, payloadLength = 250) {

  function generateString(numberOfFragments, fragmentIndex, fragment) {
    return `$FLL,${type},${numberOfFragments},${fragmentIndex},${fragment}*45`;
  }

  var buffer = msgpack.encode(input);
  const data = buffer.toString('base64');
  const fragmentLength = payloadLength - generateString(99, 99, '').length;
  const numberOfFragments = Math.ceil(data.length/fragmentLength);
  const output = [];
  for(var i = 1; i <= numberOfFragments; i++) {
    const fragment = data.slice((i - 1) * fragmentLength, i * fragmentLength);
    output.push(generateString(numberOfFragments, i,  fragment));
  }
  return output;
}



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
    generateSetances('TRP', mutation.variables).map((sentance) => {
      client.write(`${sentance}\r\n`);
    });
    callback.bind(this)({});
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
    generateSetances('TRP', mutation.variables).map((sentance) => {
      client.write(`${sentance}\r\n`);
    })
    callback.bind(this)({});
   }

  mutateFishingEvent(fishingEvent, tripId, formType){
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
    generateSetances('FSHEVT', mutation.variables).map((sentance) => {
      client.write(`${sentance}\r\n`);
    })
    callback.bind(this)({});
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
