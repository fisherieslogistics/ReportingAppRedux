"use strict";
import moment from 'moment';
import ModelUtils from '../utils/ModelUtils';
import TripModel from '../models/TripModel';

const initialState = ModelUtils.blankModel(TripModel, 'Trip');
const startDate = new moment();
initialState.startDate = startDate;
initialState.endDate = startDate.add(2, "days");

const TripReducer = (state = initialState, action) => {

    switch(action.type) {
        case 'endTrip':
            state.complete = true;
            return state;
        case 'updateTrip':
            return Object.assign({}, state, action.update);
        case 'startTrip':
            return Object.assign({}, state, { started: true, vesselId: action.vesselId });
    }
    
    return Object.assign({}, state);
};

export default TripReducer;
