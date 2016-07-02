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

    changeEventGear(fishingEventId, key, value){
      return {
          fishingEventId: fishingEventId,
          type: 'changeEventGear',
          key: key,
          value: value,
      };
    }
}

export default GearActions;
