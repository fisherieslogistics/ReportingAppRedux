"use strict";

class LocationActions {

  NMEAStringRecieved(NMEAString, position) {
    return {
      type: 'NMEAStringRecieved',
      payload: { NMEAString, position },
      error: false,
    };
  }

}

export default LocationActions;
