import util from 'util';

const upsertFishingEvent = (fEvent, tripId) => {
  console.log(JSON.stringify(fEvent));
  const catches = fEvent.products.map((c) => {
    let prod = Object.assign(c, {weight: parseInt(c.weight || 0),
                                 numberOfContainers: parseInt(c.numberOfContainers | 0)});
    delete prod["objectId"];
    return prod;
  });
  return `
    mutation {
      upsertFishingEvent(
        _id: "${fEvent.objectId}",
        trip: "${ tripId }",
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
        locationStart: ${ JSON.stringify(JSON.stringify({lat: fEvent.locationAtStart.lat, lon: fEvent.locationAtStart.lon})) },
        locationEnd: ${ JSON.stringify(JSON.stringify({lat: fEvent.locationAtEnd.lat, lon: fEvent.locationAtEnd.lon})) },
        custom: ${ JSON.stringify(JSON.stringify(fEvent.gear)) },
        catches: ${ util.inspect(catches).replace(/\'/g, '"') }
      ) {
        id,
      }
    }
  `
}

const newTrip = (trip, vesselId) => {
  let query = `
      mutation {
        createTrip(
          leavingPort: "${trip.portFrom}",
          estimatedReturnPort: "${trip.portTo}",
          sailingTime: "${trip.sailingTime.toISOString()}",
          ETA: "${trip.ETA.toISOString()}",
          vessel: "${vesselId}"
        ){
          id
        }
      }
  `
  return {query: query, variables: {}};
}

const updateTrip = (trip) => {
  return `
    mutation {
      updateTrip(
        Id: "${trip.id}",
        binsOfIce:0,
        message: "${trip.message}",
        unloadPort: "${trip.portTo}",
        time: "${trip.ETA.toISOString()}",
      ) {
        id
      }
    }
    `}

export {newTrip, upsertFishingEvent, updateTrip};

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
