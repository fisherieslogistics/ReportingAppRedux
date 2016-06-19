"use strict";
import moment from 'moment';

class GearActions{
    saveGearData(data) {
        return {
            type: 'saveGearData',
            data: data,
            timestamp: moment()
        };
    }
    closeGearEditor(data) {
        return {
            type: 'closeGearEditor',
            data: data,
            timestamp: moment()
        };
    }
    openGearEditor(data) {
        return {
            type: 'openGearEditor',
            data: data,
            timestamp: moment()
        };
    }
}

export default GearActions;
