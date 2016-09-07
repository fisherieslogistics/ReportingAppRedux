import util from 'util';
import Helper from '../utils/Helper';
import version from '../constants/version';
const helper = new Helper();

const upsertFishingEvent = (fEvent, tripId) => {
  const catches = fEvent.products.filter((x) => !!x.code)
                                 .map((c) => {
                                     let prod = Object.assign({}, c, {weight: parseInt(c.weight || 0),
                                                                      numberOfContainers: parseInt(c.numberOfContainers | 0)});
                                     delete prod["objectId"];
                                     return prod;
                                  });
  let custom = {
    headlineHeight: fEvent.headlineHeight || 0,
    wingSpread: fEvent.wingSpread || 0
  };
  const otherCatches = {};
  ['discards', 'protecteds', 'incidents'].forEach( name => {
    otherCatches[name] = fEvent[name].map(item => {
      const newItem = Object.assign({}, item);
      delete newItem.objectId;
      return newItem;
    });
  });
  const startLoc = helper.locationToGeoJSON(fEvent.locationAtStart);
  const endLoc = helper.locationToGeoJSON(fEvent.locationAtEnd);
  return `
    mutation {
      upsertFishingEvent(
        id: "${fEvent.objectId}",
        trip_id: "${ tripId }",
        numberOfInTrip: ${ fEvent.id },
        nonFishProtected: ${ fEvent.nonFishProtected ? true : false },
        averageSpeed: ${ parseFloat(fEvent.averageSpeed || 0) },
        bottomDepth: ${ parseInt(fEvent.bottomDepth || 0)},
        endDate: "${ fEvent.datetimeAtEnd ? fEvent.datetimeAtEnd.toISOString() : fEvent.datetimeAtStart.toISOString()  }",
        startDate: "${ fEvent.datetimeAtStart.toISOString() }",
        finished: true,
        groundropeDepth: ${ parseInt(fEvent.groundropeDepth || 0) },
        targetSpecies: "${ fEvent.targetSpecies }",
        committed: ${ !!fEvent.committed },
        custom: ${ JSON.stringify(JSON.stringify(custom)) },
        locationStart: ${startLoc},
        locationEnd: ${endLoc},
        catches: ${ util.inspect(catches).replace(/\'/g, '"') },
        discards: ${ util.inspect(otherCatches.discards).replace(/\'/g, '"') },
        protecteds: ${ util.inspect(otherCatches.protecteds).replace(/\'/g, '"') },
        incidents: ${ util.inspect(otherCatches.incidents).replace(/\'/g, '"') },
        version: ${version},
      ) {
        _id,
      }
    }
  `
}

const upsertLCERFishingEvent = (fEvent, tripId) => {
  const catches = fEvent.products.filter((x) => !!x.code).map((c) => {
    let prod = Object.assign({}, c, {weight: parseInt(c.weight || 0),
                                     numberOfContainers: parseInt(c.numberOfContainers | 0)});
    delete prod["objectId"];
    return prod;
  });
  let custom = {
    numberOfHooks: fEvent.numberOfHooks || 0,
    hookSpacing: fEvent.hookSpacing || 0
  };
  const startLoc = helper.locationToGeoJSON(fEvent.locationAtStart);
  const endLoc = helper.locationToGeoJSON(fEvent.locationAtEnd);
  const otherCatches = {};
  ['discards', 'protecteds', 'incidents'].forEach( name => {
    otherCatches[name] = fEvent[name].map(item => {
      const newItem = Object.assign({}, item);
      delete newItem.objectId;
      return newItem;
    });
  });
  return `
    mutation {
      upsertFishingEvent(
        id: "${fEvent.objectId}",
        trip_id: "${ tripId }",
        numberOfInTrip: ${ fEvent.id },
        nonFishProtected: ${ fEvent.nonFishProtected ? true : false },
        endDate: "${ fEvent.datetimeAtEnd ? fEvent.datetimeAtEnd.toISOString() : fEvent.datetimeAtStart.toISOString()  }",
        startDate: "${ fEvent.datetimeAtStart.toISOString() }",
        finished: true,
        targetSpecies: "${ fEvent.targetSpecies }",
        committed: ${ !!fEvent.committed },
        bottomDepth: ${ parseInt(fEvent.bottomDepth || 0)},
        custom: ${ JSON.stringify(JSON.stringify(custom)) },
        locationStart: ${startLoc},
        locationEnd: ${endLoc},
        catches: ${ util.inspect(catches).replace(/\'/g, '"') }
        discards: ${ util.inspect(otherCatches.discards).replace(/\'/g, '"') },
        protecteds: ${ util.inspect(otherCatches.protecteds).replace(/\'/g, '"') },
        incidents: ${ util.inspect(otherCatches.incidents).replace(/\'/g, '"') },
        version: ${version},
      ) {
        _id,
      }
    }
  `
}

const upsertTrip = (trip) => {
  let _trip = Object.assign({}, trip, {
    _id: trip.objectId,
    startDate: trip.sailingTime.toISOString(),
    endDate: trip.ETA.toISOString(),
    vessel_id: trip.vesselId,
    complete: trip.completed,
    unloadPort: trip.portTo,
    leavingPort: trip.portFrom,
  });
  delete _trip.started;
  delete _trip.lastSubmitted;
  delete _trip.lastChange;
  delete _trip.objectId;
  delete _trip.vesselId;
  return {
    query: `
      mutation($data: UpsertTripMutationInput!){
        upsertTripMutation(input: $data)
          {
            trip{
              _id
            }
          }
      }
    `,
    variables: {
      trip: _trip,
      clientMutationId: "tripData" + new Date().getTime()
    }
  };
}

export {upsertTrip, upsertFishingEvent, upsertLCERFishingEvent};

export default {
  getMe: `
    {
      viewer {
        firstName
        lastName
        username
        email
        formData{
          cedric_client_number
          first_name
          form_type
          last_name
          permit_holder_number
          permit_holder_name
        }
        vessels {
            name
            registration
          id: _id
        }
      }
    }
  `,
  upsertGeopoints:`
     mutation($data: UpsertGeoPointsInput!){
       upsertGeoPointsMutation(input: $data)
         {
           geopointIds
         }
     }
  `,
}
