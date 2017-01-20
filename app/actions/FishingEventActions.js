"use strict";
import moment from 'moment';
import TripActions from './TripActions';
const tripActions = new TripActions();

class FishingEventActions {

  startFishingEvent(position) {
    return (dispatch, getState) => {
      const state = getState().default;
      dispatch({
        type: 'startFishingEvent',
        location: position,
        tripId: state.trip.objectId,
        timestamp: moment(),
        wingSpread: state.trip.wingSpread,
        headlineHeight: state.trip.headlineHeight,
      });
      const fishingEvents = state.fishingEvents.events;
      if(fishingEvents.length){
          dispatch(this.setViewingFishingEvent(eventId));
      }
    };
  }
  endFishingEvent(fishingEventId, pos) {
    return (dispatch) => {
      dispatch({
        type: 'endFishingEvent',
        location: pos,
        timestamp: moment(),
        id: fishingEventId,
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

  // Use this to change other species weight
    return (dispatch, getState) => {
      dispatch({
          type: 'setFishingEventValue',
          inputId,
          fishingEventId,
          value,
          timestamp: moment()
      });
    }
  }

  setfishingEventLocationValue(fishingEventId, changes) {
      return {
          type: 'setLocationValue',
          changes,
          timestamp: moment(),
          id: fishingEventId,
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
