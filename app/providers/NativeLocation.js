import React, { DeviceEventEmitter } from 'react-native';
//import RNLocation, { Location } from 'NativeModules';
var { RNLocation: Location } = require('NativeModules');

console.log("RN LOCATION", Location);

//const Location = RNLocation.Location;

class NativeLocation {

  constructor(props){
    this.locationStarted = false;
    this.locationAuthorized = false;
    this.startUpdatingLocation();
    this.position = {
      coords: {
        speed: -1,
        longitude: 0,
        latitude: 0,
        accuracy: 500,
        heading: -1,
        altitude: -7000,
        altitudeAccuracy: -1
      },
      timestamp: 0,
    };
  }

  getPosition(){
    return this.position;
  }

  startUpdatingLocation(){
    Location.requestAlwaysAuthorization();
    Location.getAuthorizationStatus((authorization) => {
      this.locationStarted = true;
      // authorization is a string which is either "authorizedAlways",
      // "authorizedWhenInUse", "denied", "notDetermined" or "restricted"
      if(authorization === "authorizedAlways"){
        this.locationAuthorized = true;
        Location.setAllowsBackgroundLocationUpdates(true);
        Location.setDistanceFilter(5.0);
        Location.setDesiredAccuracy(2);
        Location.startUpdatingLocation();
      }
    });

    const subscription = DeviceEventEmitter.addListener(
      'locationUpdated',
      (location) => {
        this.position = location;
        /* Example location returned
        {
          coords: {
            speed: -1,
            longitude: -0.1337,
            latitude: 51.50998,
            accuracy: 5,
            heading: -1,
            altitude: -80000,
            altitudeAccuracy: -1
          },
          timestamp: 1446007304457.029
        }
        */
      }
    );
  }
}

export default NativeLocation;
