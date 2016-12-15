"use strict";
import moment from 'moment';

const initialState = {
  trip: null,
  fishingEvents: {},
  queues: {
    pastTrips: [],
    geopoints:[],
    ports: [],
    messages: [],
  },
  updatedAt: new moment()
}
//this is boken - fix graphql server to upserttrips
export default (state = initialState, action) => {
  switch (action.type) {
    case "fishingEventSynced":
      delete state.fishingEvents[action.objectId];
      return state;
    case 'pastTripSynced':
      state.queues.pastTrips.shift();
      return state;
    case "tripSynced":
      state.trip = null;
      return state;
    case 'addToQueue':
      state.queues[action.name].push(action.obj);
      return state;
    case 'removeFromQueue':
      state.queues[action.name].shift();
      return state;
    case "clearQueue":
      state.queues[action.name] = [];
      return state;
    case 'changeSpecies':
    case 'changeWeight':
    case 'changeCustom':
    case 'addProduct':
    case 'deleteProduct':
    case 'undoDeleteProduct':
    case 'syncEvent':
      if(action.objectId){
        state.fishingEvents[action.objectId] = new moment();
      }
      return state;
    case "startTrip":
      state.trip = new moment();
      return state;
    case "updateTrip":
      if(action.started){
        state.trip = new moment();
      }
      return state;
    case "endTrip":
      state.trip = null;
      const _trip = Object.assign({}, action.trip);
      _trip.message = action.message;
      _trip.complete = true;
      state.queues.pastTrips.push({
        trip: _trip,
        fishingEvents: action.fishingEvents.filter(fe => !!state.fishingEvents[fe.objectId]),
        vesselId: action.vesselId,
        formType: action.formType,
      });
      state = Object.assign({}, state, { fishingEvents: {}});
      return state;
    case "syncError":
      state.updatedAt = new moment();
      return state;
    case "sendMessage":
      state.queues.messages.push(action.message);
      return state;
    case "messageSent":
      state.queues.messages.shift();
      return state;
    default:
      return state;
  }
};
