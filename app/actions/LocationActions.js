"use strict";

class LocationActions {

  NMEAStringRecieved(NMEAString) {
    return {
      type: 'NMEAStringRecieved',
      payload: { data: NMEAString },
      error: false,
    };
  }

}

export default LocationActions;
