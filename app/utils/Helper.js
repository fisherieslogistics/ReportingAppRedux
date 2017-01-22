import Sexagesimal from 'sexagesimal';
import AsyncStorage from 'AsyncStorage';
import moment from 'moment';

class Helper {
  getDegreesMinutesFromLocation(location) {
    const lat = Sexagesimal.format(location.lat, 'lat').split(" ");
    const lon = Sexagesimal.format(location.lon, 'lon').split(" ");
    let ew = "East";
    let ns = "North";
    if(location.lat <= 0){
      ns = "South";
    }
    if(location.lon < 0){
      ew = "West";
    }
    return {
      latDegrees: parseInt(lat[0].replace(/\D/g,'')),
      latMinutes: lat.length >= 3 ? parseInt(lat[1].replace(/\D/g,'')) : 0,
      latSeconds: lat.length >= 4 ? parseInt(lat[2].replace(/\D/g,'')) : 0,
      lonDegrees: parseInt(lon[0].replace(/\D/g,'')),
      lonMinutes: lon.length >= 3 ? parseInt(lon[1].replace(/\D/g,'')) : 0,
      lonSeconds: lon.length >= 4 ? parseInt(lon[2].replace(/\D/g,'')) : 0,
      ew,
      ns
    };
  }
  formatLocation(location){
    return {lat: Sexagesimal.format(location.lat, 'lat'),
    lon: Sexagesimal.format(location.lon, 'lon')};
  }
  editLocation(changes, location) {
    let degMin = this.getDegreesMinutesFromLocation(location);
    degMin = Object.assign({}, degMin, changes);
    return this.parseLocation(degMin);
  }
  parseLocation(degMin, lonHemisphere, latHemisphere){
    const lat = parseInt(degMin.latDegrees) + (parseFloat(degMin.latMinutes) / 60) + (parseFloat(degMin.latSeconds) / 3600);
    const lon = parseInt(degMin.lonDegrees) + (parseFloat(degMin.lonMinutes) / 60) + (parseFloat(degMin.lonSeconds) / 3600);
    return {
      lon: lonHemisphere === 'East' ? lon : (lon * -1),
      lat: latHemisphere === 'North' ? lat : (lat * -1)
    };
  }
  getLatestPosition(locationState) {
    console.log(locationState);
    return {
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
    };
  }
  locationToGeoJSON(location){
    return JSON.stringify(
      { type: "Feature", geometry:
        { type: "Point", coordinates: [location.lon, location.lat]}});
  }
  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  randRange(min, max) {
    return Math.random() * (max - min) + min;
  }

  inflate (state) {
    if (typeof state === 'undefined' || state == null) {
      return state;
    }
    if(Object.prototype.toString.call(state) === '[object Array]') {
      for (let i = 0; i < state.length; i++) {
        state[i] = this.inflate(state[i]);
      }
      return state;
    } else if(typeof state === 'object') {
      if(state.savedMoment) {
        return moment(state.savedMoment);
      } else {
        for (const key in state) {
          if (state.hasOwnProperty(key)) {
            state[key] = this.inflate(state[key]);
          }
        }
        return state;
      }
    }
    return state;
  }

  deflate(state) {

    if(Object.prototype.toString.call(state)==='[object Array]') {
      //Is var as let causes error;
      var clone = [];
      for (let i=0; i<state.length; i++) {
        clone[i] = this.deflate(state[i]);
      }
      return clone;
    } else if(typeof state === 'object' && state) {
      if(state._isAMomentObject) {
        return { savedMoment: state.toISOString() };
      } else {
        var clone = {};
        for (const key in state) {
          if (state.hasOwnProperty(key) && key.slice(0, 2) != 'ui') {
            clone[key] = this.deflate(state[key]);
          }
        }
        return clone;
      }
    }
    return state;
  }

  deserialize(jsonData) {
    try{
      const state = JSON.parse(jsonData);
      return this.inflate(state);
    }catch(e){
      console.warn(e);
      return this.inflate(jsonData);
    }
  }

  serialize(state) {
    const deflated = this.deflate(state);
    return JSON.stringify(deflated);
  }

  clearLocalStorage(){
    AsyncStorage.clear(() => null);
  }

  loadSavedStateAsync() {
    return new Promise((resolve, reject) => {
      this.loadSavedState((savedState, err) => {
        if(err){
          return reject(err);
        }
        return resolve(savedState);
      });
    });
  }

  loadSavedState(callback) {
    AsyncStorage.getItem('savedState', (err, state)=>{
      if(err){
        console.warn(err);
      }
      const savedState = this.deserialize(state);
      callback(savedState);
    });
  }

  saveErrorToLocalStorage(state, err) {
    const serializedState = this.serialize({
      error: err,
      state,
    });
    return AsyncStorage.setItem('errorState', serializedState, () => {});
  }

  async saveToLocalStorage(state, actionType) {
    switch (actionType) {
      case 'loadSavedState':
      case 'changeAutoSuggestBarText':
      case 'initAutoSuggestBarChoices':
      case 'toggleAutoSuggestBar':
      case 'NMEAStringRecieved':
      return;
    }
    if(actionType.indexOf('@@redux') !== -1){
      return;
    }
    const serializedState = this.serialize(state);
    return await AsyncStorage.setItem('savedState', serializedState, (err, something) => {
      if(err){
        console.warn(err);
      }
    });
  }

  assign(obj, change){
    return Object.assign({}, obj, change);
  }

  timeAgo(date){
    const now = new Date();
    const rightNow = moment(now);
    const before = moment(date);
    return before.from(rightNow);
  }

  mostCommon(list, attribute){
    const occurances = {};
    let max = 0;
    let result;
    list.forEach((t) => {
      const val = attribute ? t[attribute] : t;
      const key = JSON.stringify(val);
      occurances[key]=(occurances[key] || 0)+1;
      if(occurances[key] > max) {
        max = occurances[key];
        result = val;
      }
    });
    return result;
  }

  concatArrays(arrays){
    return [].concat.apply([], arrays);
  }

  getTotals(products){
    const totals = {};
    products.forEach((p) => {
      if(p.weight){
        totals[p.code] = ((totals[p.code] || 0) + parseInt(p.weight));
      }
    });
    return Object.keys(totals).map((k) => ({code: k, weight: parseInt(totals[k])}));
  }

  getUncountedWeight(products, numberOfCounted){
    const totals = this.getTotals(products);
    //sort highest to lowest - take the sum of the lowest remaining past the numberOfCounted
    return totals.sort((c1, c2) => parseInt(c2.weight) - parseInt(c1.weight))
    .map(t => t.weight)
    .slice(numberOfCounted, totals.length)
    .reduce((n, b) => parseInt(n) + parseInt(b), 0);
  }

  isA(typeStr, obj){
    return typeof obj === typeStr && obj !== null;
  }

  tripCanStart(trip){
    if(trip.started) {
      return false;
    }
    return [
      'startPort',
      'startDate',
      'endDate',
      'endPort',
      'headlineHeight',
      'wingSpread'
    ].every(key => !!trip[key]);
  }

  getHistoryTrip(trip){
    const {
      startDate,
      startPort,
      endPort,
      endDate,
      fishingEvents,
      objectId,
      wingSpread,
      headlineHeight,
    } = trip;
    return {
      startDate,
      startPort,
      endPort,
      endDate,
      fishingEvents,
      objectId,
      wingSpread,
      headlineHeight,
    };
  }

  }

  export default Helper;
