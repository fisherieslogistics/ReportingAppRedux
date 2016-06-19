"use strict";
import moment from 'moment';

const getLokkaClient = require('./getLokkaClient');
const graphQLEndpoint = require('./GraphQLEndpoint');

class VesselActions{
    setVessel (vessel) {
        return {
            type: 'setVessel',
            vessel: vessel
        };
    }
}

export default VesselActions;
