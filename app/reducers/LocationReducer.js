"use strict";
import moment from 'moment';

const initialState = {
    location: {
        lat: 0,
        lon: 0
    },
    lastUpdated: new moment()
};

const LocationReducer = (state, action) => {
    if (typeof state === 'undefined') {
        return initialState;
    }

    switch(action.type) {
        case 'updateGps':
            return {
                location: Object.assign({}, action.location),
                lastUpdated: new moment()
            };
        default:
            return state;
    }
};

export default LocationReducer;
