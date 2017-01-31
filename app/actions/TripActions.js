"use strict";
import moment from 'moment';

class TripActions{
  startTrip(vesselId) {
    return{
      type: 'startTrip',
      timestamp: moment(),
      vesselId
    }
  }

  endTrip(trip, fishingEvents, vesselId, message){
    return (dispatch) => {
      dispatch({
        type: 'endTrip',
        timestamp: moment(),
        trip,
        fishingEvents,
        vesselId,
        message,
      });
    }
  }

  updateTrip(name, value, started){
    const update = {}
    update[name] = value;
    return {
      type: 'updateTrip',
      update,
      attr: name,
      started,
    }
  }
}

export default TripActions;
