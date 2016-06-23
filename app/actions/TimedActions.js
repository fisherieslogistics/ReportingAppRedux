'use strict';
var moment = require('moment');
var util = require('util');

import Helper from '../utils/Helper';
import FishingEventActions from './FishingEventActions';
import TripActions from './TripActions';
import request from 'superagent';
import Client from '../utils/Client';

const tripActions = new TripActions();
const helper = new Helper();
const fishingEventActions = new FishingEventActions();

class TimedActions {

  checkTrip(getState, dispatch, callback) {
      let state = getState().default;
      const trip = state.trip;
      const startTime = moment();
      if(!trip){
          callback(arguments[0], arguments[1], arguments[2]);
          return;
      }
      if(trip.lastChange && !trip.id) {

          client.mutate(`
            {
              newTrip: createTrip(
                leavingPort: "${trip.leavingPort}",
                estimatedReturnPort: "${trip.estimatedReturnPort}",
                sailingTime: "${trip.sailingTime.toISOString()}",
                ETA: "${trip.ETA.toISOString()}",
                vessel: "${state.me.vessel.id}"
              ) {
                id: Id,
              }
            }
            `).then((responce) => {
                callback(arguments[0], arguments[1], arguments[2]);
                dispatch({
                    type: 'setTripId',
                    id: responce.newTrip.id,
                    lastSubmitted: startTime
                });
            });
      } else if(trip && trip.lastChange && trip.lastChange.isAfter(trip.lastSubmitted) && trip.time) {
          const client = getLokkaClient.default(state, dispatch);
          client.mutate(`
            {
              updateTrip(
                Id: "${trip.id}",
                binsOfIce: ${trip.binsOfIce},
                message: "${trip.message}",
                unloadPort: "${trip.unloadPort}",
                time: "${trip.ETA.toISOString()}",
              ) {
                id: Id,
              }
            }
            `).then((responce) => {
                dispatch({
                    type: 'setTripId',
                    id: responce.updateTrip.id,
                    lastSubmitted: startTime
                });
                callback(arguments[0], arguments[1], arguments[2]);
            });
      }else {
        callback(arguments[0], arguments[1], arguments[2]);
      }
  }

  checkFishingEvents(getState, dispatch, callback) {
      let state = getState().default;
      if(!state.trip.id || !state.trip.shoots.shoots.length) {
        callback(arguments[0], arguments[1], arguments[2]);
        return;
      }

      let requests = state.trip.shoots.shoots.map((shoot) => {
          if(!shoot.lastChange) {
              return;
          }
          if(!shoot.lastSubmitted || shoot.lastChange.isAfter(shoot.lastSubmitted)) {
              let products = shoot.catches.filter((fish) => {
                  if (fish.code == "" || fish.weight == "") {
                      return false;
                  } else {
                      return true;
                  }
              }).map((c)=>{
                  let weight = parseInt(c.weight);
                  if(isNaN(weight)){
                    c.weight = 0;
                  }
                  config.sizes.forEach((s) => {
                      let kgs = parseInt(c[s]);
                      if(isNaN(kgs)){
                        kgs = 0;
                      }
                      c[s] = kgs;
                  });
                  return c;
              });

              const client = getLokkaClient.default(state, dispatch);

              const startTime = moment();

              let datetimeAtEnd = shoot.datetimeAtEnd ? shoot.datetimeAtEnd.toISOString() : new moment().toISOString();
              shoot.trawl.headlineHeight = shoot.headlineHeight;
              shoot.trawl.wingSpread = shoot.wingSpread;
              let query = `
                {
                  FishingEvent: upsertFishingEvent(
                    ${ shoot.fishyFishId ? 'Id: "' + shoot.fishyFishId + '",' : '' }
                    trip: "${ state.trip.id }",
                    numberOfInTrip: ${ shoot.id },
                    nonFishProtected: ${ shoot.nonFishProtected ? true : false },
                    averageSpeed: ${ shoot.averageSpeed },
                    bottomDepth: ${ shoot.bottomDepth },
                    endDate: "${ datetimeAtEnd }",
                    startDate: "${ shoot.datetimeAtStart.toISOString() }",
                    finished: true,
                    groundropeDepth: ${ shoot.groundropeDepth },
                    targetSpecies: "${ shoot.targetSpecies }",
                    committed: ${ !!shoot.committed },
                    locationStart: ${ JSON.stringify(JSON.stringify({lat: shoot.locationAtStart.lat, lon: shoot.locationAtStart.lon})) },
                    locationEnd: ${ JSON.stringify(JSON.stringify({lat: shoot.locationAtEnd.lat, lon: shoot.locationAtEnd.lon})) },
                    tow: ${ JSON.stringify(JSON.stringify(shoot.tow)) },
                    custom: ${ JSON.stringify(JSON.stringify(shoot.trawl)) },
                    catches: ${ util.inspect(catches).replace(/\'/g, '"') }
                  ) {
                    id: Id,
                  }
                }
              `;
              return client.mutate(query).catch((err)=>{console.log(err);}).then((response, err) => {
                  //TODO make serverside return something on update
                  if(response && response.FishingEvent){
                    dispatch({
                        type: 'setShootId',
                        shootId: shoot.id,
                        fishyFishId: response.FishingEvent.id,
                        lastSubmitted: startTime
                    });
                  }
              });
          }
      }).filter((req)=>{
        return !!req;
      });
      Promise.all(requests).then(() => {
        callback(arguments[0], arguments[1], arguments[2]);
      });
  }

  startActions(dispatch, getState) {
      var self = this;
      const updateLocation = (coords) =>{
        let point =  { "type": "Point", "coordinates": [ coords.longitude,
                                                         coords.latitude, 0.0, new Date().getTime() ] };
        dispatch({
            type: 'updateGps',
            location: {
                lat: coords.latitude,
                lon: coords.longitude,
                speed: coords.speed,
                point: point
            }
        });
     }

    function getPosition(){
      navigator.geolocation.getCurrentPosition(
           (position) => {
             updateLocation(position.coords);
             setTimeout(getPosition, 800);
           },
           (error) => {
             alert(error.message);
             console.log(error);
             setTimeout(getPosition, 10000);
           },
           {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
      );
    }

    function watchPositon(){
      navigator.geolocation.watchPosition(
        (position) => {
          updateLocation(position.coords);
        },
        (error) => {
           console.log(error);
        },
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
      );
    }

    function timedCheckTrip(){
      setTimeout(() => {
        self.checkTrip(getState, dispatch, timedCheckTrip);
      }, 5000);
    }

    function timedCheckFishing(){
      setTimeout(() => {
        self.checkFishingEvents(getState, dispatch, timedCheckFishing);
      }, 5000);
    }

    //timedCheckTrip();
    //timedCheckFishing();

    //getPosition();

    function checkGraphQueue() {
        var state = getState().default;
        if(state.queue.graphApi.length){
            let item = state.queue.graphApi[0];
            const client = getLokkaClient.default(state, dispatch);
            client.mutate(item.value).then((res, err) => {
                  if(!err){
                    dispatch(tripActions.shiftGraphQueue());
                  }
                  setTimeout(checkGraphQueue, 5000);
              });
        }else{
            setTimeout(checkGraphQueue, 5000);
        }
    }

    function sendPost(item){
      return new Promise((resolve, reject) => {
        let user = getState().default.me;
        let data = {forms: item.value, user: user};
        request.post('http://southernware.co.nz:8010/uploadForms')
          .type('form')
          .send({ 'uploadForms': JSON.stringify(data)})
          .end((err, res) => {
            if(err) {
              console.log(err);
              setTimeout(checkFormQueue, 5000);
            } else {
              dispatch(tripActions.shiftFormsQueue());
              setTimeout(checkFormQueue, 5000);
              resolve(res);
            }
          });
      });
    }

    function checkFormQueue() {
        var state = getState().default;
        if(state.queue.formsApi.length){
            let item = state.queue.formsApi[0];
            sendPost(item);
        }else{
            setTimeout(checkFormQueue, 5000);
        }
    }

    //checkGraphQueue();
    //checkFormQueue();
  }
};

export default TimedActions;
