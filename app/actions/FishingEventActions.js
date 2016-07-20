"use strict";
import moment from 'moment';

class FishingEventActions{

    startFishingEvent(gear, position) {
        return (dispatch, getState) => {
            const state = getState().default;
            dispatch({
                type: 'startFishingEvent',
                location: position,
                gear: gear,
                tripId: state.trip.objectId,
                timestamp: moment(),
                formType: state.me.formType
            });
            let fishingEvents = state.fishingEvents.events;
            if(fishingEvents.length){
                let eventId = fishingEvents[fishingEvents.length - 1].id;
                dispatch(this.setViewingFishingEvent(eventId));
            }
        };
    }
    endFishingEvent(fishingEventId, pos) {
      return (dispatch, getState) => {
        dispatch({
          type: 'endFishingEvent',
          location: pos,
          timestamp: moment(),
          id: fishingEventId,
          formType: getState().default.me.formType
        });
      }
    }
    cancelFishingEvent(id) {
      return(dispatch) => {
        dispatch({
            type: 'cancelFishingEvent',
            timestamp: moment()
        });
        dispatch(this.setViewingFishingEvent(id -1));
      }
    }

    setfishingEventValue(fishingEventId, inputId, value) {
      return (dispatch, getState) => {
        dispatch({
            type: 'setFishingEventValue',
            inputId: inputId,
            fishingEventId: fishingEventId,
            value: value,
            formType: getState().default.me.formType,
            timestamp: moment()
        });
        dispatch({
          type: 'addFavourite',
          favouriteName: inputId,
          value: value
        })
      }
    }

    setfishingEventLocationValue(fishingEventId, changes) {
        return {
            type: 'setLocationValue',
            changes: changes,
            timestamp: moment(),
            id: fishingEventId,
            formType: getState().default.me.formType,
        };
    }
    setViewingFishingEvent(id) {
        return(dispatch) => {
            dispatch({
                type: 'setViewingFishingEvent',
                fishingEventId: id
            });
        }
    }
    hideLocationEditor(){
        return {
            type: 'hideLocationEditor'
        };
    }
    showLocationEditor(){
        return {
            type: 'showLocationEditor'
        };
    }
}

export default FishingEventActions
