"use strict";

class LocationActions {

  NMEAStringRecieved(NMEAString) {
    return {
      type: 'NMEAStringRecieved',
      payload: { NMEAString },
      error: false,
    };
  }

}

export default LocationActions;
