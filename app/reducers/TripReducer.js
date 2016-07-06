"use strict";
import moment from 'moment';
import ModelUtils from '../utils/ModelUtils';
import TripModel from '../models/TripModel';
let initialState = ModelUtils.blankModel(TripModel);

const TripReducer = (state = initialState, action) => {

    switch(action.type) {
        case 'endTrip':
            let t = ModelUtils.blankModel(TripModel);
            t.sailingTime = new moment();
            t.ETA = new moment().add(2, 'days');
            t.portFrom = action.trip.portFrom;
            t.portTo = action.trip.portTo;
            return t;
        case 'updateTrip':
            return Object.assign({}, state, action.update, {lastChange: moment() });
        case 'setTripId':
            return Object.assign({}, state,
              {lastSubmitted: action.lastSubmitted, id: action.id });
        case 'startTrip':
            return Object.assign({}, state, {started: true });
    }
    return Object.assign({}, state);
};

export default TripReducer;
