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
this is boken - fix graphql server to upserttrips
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
      if(!action.objectId){
        debugger
      }
      state.fishingEvents[action.objectId] = new moment();
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
      state.queues.pastTrips.push({
        trip: Object.assign({}, action.trip),
        fishingEvents: action.fishingEvents.filter(fe => !!state.fishingEvents[action.objectId]),
        vesselId: action.vesselId
      });
      return state;
    case "syncError":
      state.updatedAt = new moment();
      console.log(action.err);
      return state;
    default:
      return state;
  }
  return state;
};
