"use strict";
import moment from 'moment';
import ModelUtils from '../utils/ModelUtils';
import TripModel from '../models/TripModel';
let initialState = ModelUtils.blankModel(TripModel);

const TripReducer = (state = initialState, action) => {

    switch(action.type) {
        case 'endTrip':
            return ModelUtils.blankModel(TripModel);
            break;
        case 'updateTrip':
            console.log("Reducing", action.attr, action.update[action.attr]);
            return Object.assign({}, state, action.update, {lastChange: moment() });
            break;
        case 'setTripId':
            return Object.assign({}, state,
              {lastSubmitted: action.lastSubmitted, id: action.id });
            break;
        case 'startTrip':
            return Object.assign({}, state, {started: true });
            break;
    }
    return Object.assign({}, state);
};

export default TripReducer;
