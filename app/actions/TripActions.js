"use strict";
import moment from 'moment';

class TripActions{
  startTrip(trip) {
    return{
      type: 'startTrip',
      timestamp: moment(),
    }
  }

  endTrip(trip, fishingEvents, vesselId){
    return {
      type: 'endTrip',
      timestamp: moment(),
      trip: trip,
      fishingEvents: fishingEvents,
      vesselId: vesselId
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
