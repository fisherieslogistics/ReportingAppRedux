"use strict";
import moment from 'moment';

class TripActions{
  startTrip(vesselId) {
    return{
      type: 'startTrip',
      timestamp: moment(),
      vesselId: vesselId
    }
  }

  endTrip(trip, fishingEvents, vesselId, message){
    return {
      type: 'endTrip',
      timestamp: moment(),
      trip: trip,
      fishingEvents: fishingEvents,
      vesselId: vesselId,
      message: message
    }
  }

  updateTrip(attribute, value, started){
    let update = {}
    update[attribute] = value;
    return {
      type: 'updateTrip',
      update: update,
      attr: attribute,
      started: started
    }
  }
}

export default TripActions;
