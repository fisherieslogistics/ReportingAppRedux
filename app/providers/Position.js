'use strict';

function getPosition(successCallback, onError){
  navigator.geolocation.getCurrentPosition(
    (position) => {
      successCallback(position);
    },
    (err) => {
       onError(err);
    },
    {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
  );
}

function watchPositon(successCallback, onError){
  navigator.geolocation.watchPosition(
    (position) => {
      successCallback(position);
    },
    (err) => {
       onError(err);
    },
    {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
  );
}

function clearWatch(watchId){
  navigator.geolocation.clearWatch(watchId);
}

export {getPosition, watchPositon, clearWatch}
