"use strict";
import moment from 'moment';

import {updateFishingEvent} from './SyncActions';

class FishingEventActions{

    startFishingEvent(gear) {
        return (dispatch, getState) => {
            dispatch({
                type: 'startFishingEvent',
                location: getState().default.location.location,
                gear: gear,
                timestamp: moment()
            });
            let fishingEvents = getState().default.fishingEvents.events;
            if(fishingEvents.length){
                let eventId = fishingEvents[fishingEvents.length - 1].id;
                dispatch(this.setViewingFishingEvent(eventId));
            }
            updateFishingEvent()
        };
    }
    endFishingEvent(fishingEventId) {
        return (dispatch, getState) => {
            dispatch({
                type: 'endFishingEvent',
                location: getState().default.location.location,
                timestamp: moment(),
                id: fishingEventId
            });

        };
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
            timestamp: moment()
        });
        dispatch({
          type: 'addFavourite',
          favouriteName: inputId,
          value: value
        })
      }
    }

    setFishingEventServerId(fishingEventId, serverId, lastSubmitted) {
      return (dispatch, getState) => {
        dispatch({
          type: 'setFishingEventId',
          fishyFishId: serverId,
          lastSubmitted: lastSubmitted
        });
       }
    }

    setfishingEventLocationValue(fishingEventId, changes) {
        return {
            type: 'setLocationValue',
            changes: changes,
            timestamp: moment(),
            id: fishingEventId
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
