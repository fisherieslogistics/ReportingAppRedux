"use strict";
import moment from 'moment';

const initialState = {
  trip: null,
  fishingEvents: {},
  queues: {
    pastTrips: [],
    geopoints:[],
    ports: [],
  },
  updatedAt: new moment()
}
//this is boken - fix graphql server to upserttrips
export default (state = initialState, action) => {
  switch (action.type) {
    case "fishingEventSynced":
      let updatedAt = state.fishingEvents[action.objectId];
      if(updatedAt && updatedAt.unix() < action.time.unix()){
        delete state.fishingEvents[action.objectId];
      }
      return state;
    case "tripSynced":
      if(state.trip && state.trip.unix() < action.time.unix()){
        state.trip = null;
      }
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
    case 'changeEventGear':
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
      let _trip = Object.assign({}, action.trip);
      _trip.message = action.message;
      _trip.completed = true;
      state.queues.pastTrips.push({
        trip: _trip,
        fishingEvents: action.fishingEvents.filter(fe => !!state.fishingEvents[fe.objectId]),
        vesselId: action.vesselId,
        formType: action.formType
      });
      state = Object.assign({}, state, { fishingEvents: {});
      return state;
    case 'formSigned':
      action.fishingEvents.forEach((fe) => {
        state.fishingEvents[fe.objectId] = new moment();
      });
      return state;
    case "syncError":
      state.updatedAt = new moment();
      console.warn(action.err);
      return state;
    default:
      return state;
  }
};
