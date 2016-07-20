"use strict";
import moment from 'moment';

class GearActions{

    changeCurrentGear(key, value) {
        return {
            type: 'changeCurrentGear',
            key: key,
            value: value,
        };
    }

    changeEventGear(fishingEventId, objectId, key, value){
      return (dispatch, getState) => {
        dispatch({
          fishingEventId: fishingEventId,
          type: 'changeEventGear',
          key: key,
          value: value,
          objectId: objectId,
          formType: getState().default.me.formType
        });
      }
    }
}

export default GearActions;
