"use strict";
import moment from 'moment';

const initialState = {
    location: {
        lat: 45.55,
        lon: 174.23
    },
    last_updated: moment()
};

const LocationReducer = (state, action) => {
    if (typeof state === 'undefined') {
        return initialState;
    }

    switch(action.type) {
        case 'update_gps':
            return {
                location: Object.assign({}, action.location),
                last_updated: moment()
            };
        default:
            return state;
    }
};

export default LocationReducer;
