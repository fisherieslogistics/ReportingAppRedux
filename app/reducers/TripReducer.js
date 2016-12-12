"use strict";
import moment from 'moment';
import ModelUtils from '../utils/ModelUtils';
import TripModel from '../models/TripModel';

function newTrip(){
  const trip = ModelUtils.blankModel(TripModel, 'Trip');
  const startDate = new moment();
  trip.startDate = startDate;
  trip.endDate = startDate.clone().add(2, "days");
  return trip;
}

const initialState = newTrip();

const TripReducer = (state = initialState, action) => {

    switch(action.type) {
        case 'endTrip':
            return newTrip();
        case 'updateTrip':
            return Object.assign({}, state, action.update);
        case 'startTrip':
            return Object.assign({}, state, { started: true, vesselId: action.vesselId });
    }

    return Object.assign({}, state);
};

export default TripReducer;
