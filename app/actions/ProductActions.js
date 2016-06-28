"use strict";
import moment from 'moment';

class CatchActions{
    changeSpecies(id, catchId, value) {
        return {
            type: 'changeSpecies',
            'id': id,
            'catchId': catchId,
            'value': value,
            timestamp: moment()
        };
    }
    changeWeight(id, catchId, value) {
        return {
            type: 'changeWeight',
            'id': id,
            'catchId': catchId,
            'value': value,
            timestamp: moment()
        };
    }
    changeCustom(name, id, catchId, value) {
        return {
            type: 'changeCustom',
            'name': name,
            'id': id,
            'catchId': catchId,
            'value': value,
            timestamp: moment()
        };
    }
    
}

export default CatchActions;
