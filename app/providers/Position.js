'use strict';
import request from 'superagent';

function getPosition(successCallback, onError){
  return navigator.geolocation.getCurrentPosition(
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
  return setInterval(() => getPosition(successCallback, onError), 2000);
}

function clearWatch(watchId){
  clearInterval(watchId);
}

function requestPosition(url, successCallback, onError){
  return request.get(url).end((err, res) => {
        if(err){
          onError(err);
        }else{
          try{
            successCallback(JSON.parse(res.text));
          }catch(e){
            onError(e)
          }
  }});
}

function pollHttpPosition(url, successCallback, onError) {
  return setInterval(() => {
    requestPosition(url, successCallback, onError);
  }, 3000);

}

export {getPosition, watchPositon, clearWatch, pollHttpPosition, requestPosition}
