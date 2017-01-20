"use strict";
import moment from 'moment';

class LocationActions {

  NMEAStringRecieved(NMEAString) {
    return {
      type: 'NMEAStringRecieved',
      payload: { data: NMEAString, timestamp: new moment().toISOString() },
      error: false,
    };
  }

}

export default LocationActions;
