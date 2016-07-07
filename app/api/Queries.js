
const upsertFishingEvent = (fEvent, tripId) => {
  return `
    mutation {
      upsertFishingEvent(
        ${ fEvent.objectId ? 'Id: "' + fEvent.objectId + '",' : '' }
        trip: "${ tripId }",
        numberOfInTrip: ${ fEvent.id },
        nonFishProtected: ${ fEvent.nonFishProtected ? true : false },
        averageSpeed: ${ fEvent.averageSpeed },
        bottomDepth: ${ fEvent.bottomDepth },
        endDate: "${ fEvent.datetimeAtEnd.toISOString()  }",
        startDate: "${ fEvent.datetimeAtStart.toISOString() }",
        finished: true,
        groundropeDepth: ${ fEvent.groundropeDepth },
        targetSpecies: "${ fEvent.targetSpecies }",
        committed: ${ !!fEvent.committed },
        locationStart: ${ JSON.stringify(JSON.stringify({lat: fEvent.locationAtStart.lat, lon: fEvent.locationAtStart.lon})) },
        locationEnd: ${ JSON.stringify(JSON.stringify({lat: fEvent.locationAtEnd.lat, lon: fEvent.locationAtEnd.lon})) },
        tow: ${ JSON.stringify(JSON.stringify(fEvent.tow)) },
        custom: ${ JSON.stringify(JSON.stringify(fEvent.trawl)) },
        catches: ${ util.inspect(fEvent.products.filter(p => p.code && p.weight)).replace(/\'/g, '"') }
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