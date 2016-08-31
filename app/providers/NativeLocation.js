import React, { DeviceEventEmitter } from 'react-native';
import { RNLocation } from 'NativeModules';

class NativeLocation {

  constructor(){
    this.startUpdatingLocation();
    this.position = null;
  }

  getPosition(){
    return this.position;
  }

  startUpdatingLocation(){
    RNLocation.requestAlwaysAuthorization();
    RNLocation.setDistanceFilter(5.0);
    RNLocation.setDesiredAccuracy(2);
    RNLocation.startUpdatingLocation();
    const subscription = DeviceEventEmitter.addListener(
      'locationUpdated',
      (location) => {
        console.log(location);
        this.position = location;
        /* Example location returned
        {
          coords: {
            speed: -1,
            longitude: -0.1337,
            latitude: 51.50998,
            accuracy: 5,
            heading: -1,
            altitude: 0,
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
