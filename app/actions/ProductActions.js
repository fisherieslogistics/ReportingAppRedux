"use strict";
import moment from 'moment';

class CatchActions{
    changeSpecies(id, catchId, value) {
        return {
            type: 'changeSpecies',
            fishingEventId: id,
            catchIndex: catchId,
            value: value,
            timestamp: moment()
        };
    }
    changeWeight(id, catchId, value) {
        return {
            type: 'changeWeight',
            fishingEventId: id,
            catchIndex: catchId,
            value: value,
            timestamp: moment()
        };
    }
    changeCustom(name, id, catchId, value) {
        return {
            type: 'changeCustom',
            name: name,
            fishingEventId: id,
            catchIndex: catchId,
            value: value,
            timestamp: moment()
        };
    }
    addProduct(id){
      return {
        type: 'addProduct',
        fishingEventId: id
      }
    }

}

export default CatchActions;
