"use strict";
import moment from 'moment';

class TripActions{
  startTrip(trip) {
    return{
      type: 'startTrip',
      timestamp: moment(),
    }
  }

  endTrip(){
    return {
      type: 'endTrip',
      timestamp: moment()
    }
  }

  updateTrip(attribute, value, trip){
    let update = {}
    update[attribute] = value;
    return {
      type: 'updateTrip',
      update: update,
      attr: attribute
    }
  }
}

export default TripActions;
