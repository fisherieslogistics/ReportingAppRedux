"use strict";
import moment from 'moment';

class TripActions{
  startTrip() {
    return{
      type: 'startTrip',
      timestamp: moment()
    }
  }
  endTrip(){
    return {
      type: 'endTrip',
      timestamp: moment()
    }
  }
  _endTrip(finalValues) {
    const self = this;
    return (dispatch, getState) => {
      let allEventsComplete = true;

      const fishingEvents = getState().default.trip.shoots.shoots;

      fishingEvents.forEach((s)=>{
          if(!s.finished || !s.committed){
              allEventsComplete = false;
          }
      });
      if(allEventsComplete){
          var trip = Object.assign({}, getState().default.trip, finalValues);
          let queryString = `
          {
            updateTrip(
              Id: "${trip.id}",
              binsOfIce: ${trip.binsOfIce},
              message: "${trip.message}",
              unloadPort: "${trip.unloadPort}",
              time: "${moment().toISOString()}"
            ) {
              id: Id,
            }
          }
          `;
          if(trip.id){
              dispatch({
                  type: 'pushGraphQueue',
                  item: {
                      value: queryString
                  }
              });
          }
          dispatch({
              type: 'finalizeTrip',
              finalValues: finalValues,
              timestamp: moment()
          });
          dispatch({
              type: 'endTrip',
              timestamp: moment()
          });
      }
    };
  }

  updateTrip(attribute, value){
    let update = {}
    update[attribute] = value;
    return {
      type: 'updateTrip',
      update: update,
    }
  }

  shiftGraphQueue(){
      return(dispatch) => {
          dispatch({
              type: 'shiftGraphQueue'
          });
      }
  }
  shiftFormsQueue(){
      return(dispatch) => {
          dispatch({
              type: 'shiftFormsQueue'
          });
      }
  }

}

export default TripActions;
