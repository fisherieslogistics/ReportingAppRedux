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
      return {
          fishingEventId: fishingEventId,
          type: 'changeEventGear',
          key: key,
          value: value,
          objectId: objectId
      };
    }
}

export default GearActions;
