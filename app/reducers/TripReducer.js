"use strict";
import moment from 'moment';
import ModelUtils from '../utils/ModelUtils';
import TripModel from '../models/TripModel';
let initialState = ModelUtils.blankModel(TripModel, 'Trip');

const TripReducer = (state = initialState, action) => {

    switch(action.type) {
        case 'endTrip':
            let t = ModelUtils.blankModel(TripModel, 'Trip');
            t.startDate = new moment();
            t.endDate = new moment().add(2, 'days');
            t.startPort = action.trip.startPort;
            t.endPort = action.trip.endPort;
            t.message = action.message;
            return t;
        case 'updateTrip':
            return Object.assign({}, state, action.update);
        case 'startTrip':
            return Object.assign({}, state, {started: true, vesselId: action.vesselId});
    }
    return Object.assign({}, state);
};

export default TripReducer;
