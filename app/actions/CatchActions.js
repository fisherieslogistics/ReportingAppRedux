"use strict";
import moment from 'moment';

class CatchActions{
    openCatchDetail(id) {
        return {
            type: 'showCatchEditor',
            id: id,
            timestamp: moment()
        };
    }
    closeCatchDetail() {
        return {
            type: 'hideCatchEditor',
            timestamp: moment()
        };
    }
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
    errors(errors){
        return{
            type: 'catchErrors',
            catchErrors: errors
        }
    }
}

export default CatchActions;
