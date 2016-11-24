"use strict";
import moment from 'moment';

class VesselActions{
    setVessel (vessel) {
        return {
            type: 'setVessel',
            vessel: vessel
        };
    }
}

export default VesselActions;
