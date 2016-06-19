"use strict";
import moment from 'moment';

class TripActions{
    startTrip(initialValues) {
        return (dispatch, getState) => {
            dispatch({
                type: 'startTrip',
                initialValues: initialValues,
                timestamp: moment()
            });

            const trip = {
                leavingPort: initialValues.leavingPort,
                estimatedReturnPort: initialValues.estimatedReturnPort,
                sailingTime: initialValues.sailingTime.toISOString(),
                ETA: initialValues.ETA.toISOString(),
                vessel: getState().default.me.vessel
            };
        };
    }

    endTrip(finalValues) {
        const self = this;
        return (dispatch, getState) => {
            let allShotsComplete = true;

            const fishingEvents = getState().default.trip.shoots.shoots;

            fishingEvents.forEach((s)=>{
                if(!s.finished || !s.committed){
                    allShotsComplete = false;
                }
            });
            if(allShotsComplete){
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

    showEndTrip() {
        return {
            type: 'showEndTrip',
            timestamp: moment()
        };
    }

    hideEndTrip() {
        return {
            type: 'hideEndTrip',
            timestamp: moment()
        };
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
