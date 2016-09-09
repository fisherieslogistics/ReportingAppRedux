import util from 'util';
import Helper from '../utils/Helper';
import version from '../constants/version';
const helper = new Helper();

function getCustom(fEvent){
  const tcer = {
    headlineHeight: fEvent.headlineHeight || 0,
    wingSpread: fEvent.wingSpread || 0,
  };
  const lcer = {
    numberOfHooks: fEvent.numberOfHooks || 0,
    hookSpacing: fEvent.hookSpacing || 0,
  };
  if('numberOfHooks' in fEvent){
    return JSON.stringify(lcer);
  }
  return JSON.stringify(tcer);
}

function parseProducts(products){
  const catches = products.filter((x) => !!x.code).map((c) => {
    let prod = Object.assign({}, c, {
      weight: parseInt(c.weight || 0),
      numberOfContainers: parseInt(c.numberOfContainers || 0),
      containerType: c.containerType || "",
      state: c.state || "",
      treatment: c.treatment || "iced",
      grade: c.grade || "",
    });
    delete prod["objectId"];
    return prod;
  });
  return catches;
}

function parseUnsoughtCatches(fEvent){
  const otherCatches = {};
  ['discards', 'protecteds', 'incidents'].forEach( name => {
    const items = fEvent[name].map(item => {
      const newItem = Object.assign({}, item);
      delete newItem.objectId;
      return newItem;
    });
    otherCatches[name] = items;
  });
  return otherCatches;
}


function upsertFishingEvent(fEvent, tripId) {
  const otherCatches = parseUnsoughtCatches(fEvent);
  const catches = parseProducts(fEvent.products);
  const custom = getCustom(fEvent);
  const startLoc = helper.locationToGeoJSON(fEvent.locationAtStart);
  const endLoc = helper.locationToGeoJSON(fEvent.locationAtEnd);
  const fishingEventInput = {
    id: fEvent.objectId,
    trip_id: tripId,
    numberOfInTrip: fEvent.id,
    nonFishProtected: !!fEvent.nonFishProtected,
    averageSpeed: parseFloat(fEvent.averageSpeed || 0),
    bottomDepth: parseInt(fEvent.bottomDepth || 0),
    endDate: fEvent.datetimeAtEnd ? fEvent.datetimeAtEnd.toISOString() : null,
    startDate: fEvent.datetimeAtStart.toISOString(),
    finished: true,
    groundropeDepth: parseInt(fEvent.groundropeDepth || 0),
    targetSpecies: fEvent.targetSpecies,
    committed: !!fEvent.committed,
    custom: custom,
    locationStart: startLoc,
    locationEnd: endLoc,
    catches: catches,
    discards: otherCatches.discards,
    protecteds: otherCatches.protecteds,
    incidents: otherCatches.incidents,
    version: version,
    __legacyId: fEvent.__legacyId || null,
  };
  return {
    query: `
      mutation($data: UpsertFishingEventMutation2Input!) {
        upsertFishingEvent2(input: $data)
        {
          fishingEvent {
            id
          }
        }
      }
    `,
    variables: {
      fishingEvent: fishingEventInput,
      clientMutationId: "fisData2" + new Date().getTime(),
    }
  };
}

const upsertTrip = (trip) => {
  let _trip = Object.assign({}, trip, {
    id: trip.objectId,
    startDate: trip.startDate.toISOString(),
    endDate: trip.endDate.toISOString(),
    vessel_id: trip.vesselId,
    complete: trip.complete,
    endPort: trip.endPort,
    startPort: trip.startPort,
    __legacyId: trip.__legacyId || null,
  });
  delete _trip.started;
  delete _trip.objectId;
  delete _trip.vesselId;
  return {
    query: `
      mutation($data: UpsertTripMutation2Input!){
        upsertTrip2(input: $data)
          {
            trip{
              id
            }
          }
      }
    `,
    variables: {
      trip: _trip,
      clientMutationId: "tripData2" + new Date().getTime()
    }
  };
}
export {upsertTrip, upsertFishingEvent};

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
