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
      ew: ew,
      ns: ns
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
    let lat = parseInt(degMin.latDegrees) + (parseFloat(degMin.latMinutes) / 60) + (parseFloat(degMin.latSeconds) / 3600);
    let lon = parseInt(degMin.lonDegrees) + (parseFloat(degMin.lonMinutes) / 60) + (parseFloat(degMin.lonSeconds) / 3600);
    return {
      lon: lonHemisphere == 'East' ? lon : (lon * -1),
      lat: latHemisphere == 'North' ? lat : (lat * -1)
    };
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
        for (let key in state) {
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
        for (let key in state) {
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
      console.log(e);
      return this.inflate(jsonData);
    }
  };

  serialize(state) {
    let deflated = this.deflate(state);
    return JSON.stringify(deflated);
  };

  clearLocalStorage(){
    AsyncStorage.clear(() => console.log("clear"));
  }

  loadSavedState(callback) {
    AsyncStorage.getItem('savedState', (err, state)=>{
      if(err){
        console.log(err, state);
      }
      let savedState = this.deserialize(state) || {};
      callback(savedState);
    });
  };

  async saveToLocalStorage(state, actionType, key) {
    switch (actionType) {
      case 'loadSavedState':
      case 'updateGps':
      case 'changeAutoSuggestBarText':
      case 'initAutoSuggestBarChoices':
      case 'toggleAutoSuggestBar':
      case 'uiPositionUpdate':
      return;
    }
    if(actionType.indexOf('@@redux') !== -1){
      return;
    }
    let serializedState = this.serialize(state);
    await AsyncStorage.setItem('savedState', serializedState, (err, something) => {
      if(err){
        console.log(err, something);
      }
    });
  };

  assign(obj, change){
    return Object.assign({}, obj, change);
  };

  timeAgo(date){
    var now = new Date();
    var rightNow = moment(now);
    var before = moment(date);
    return before.from(rightNow);
  };

  mostCommon(list, attribute){
    var occurances = {};
    var max = 0;
    var result;
    list.forEach((t) => {
      let val = attribute ? t[attribute] : t;
      let key = JSON.stringify(val);
      occurances[key]=(occurances[key] || 0)+1;
      if(occurances[key] > max) {
        max = occurances[key];
        result = val;
      }
    });
    return result;
  };

  concatArrays(arrays){
    return [].concat.apply([], arrays);
  }

  getTotals(products){
    let totals = {};
    products.forEach((p) => {
      if(p.weight){
        totals[p.code] = ((totals[p.code] || 0) + parseInt(p.weight));
      }
    });
    return Object.keys(totals).map((k) => {
      return {code: k, weight: parseInt(totals[k])};
    });
  }

  getUncountedWeight(products, numberOfCounted){
    let totals = this.getTotals(products);
    //sort highest to lowest - take the sum of the lowest remaining past the numberOfCounted
    return totals.sort((c1, c2) => parseInt(c2.weight) - parseInt(c1.weight))
    .map(t => t.weight)
    .slice(numberOfCounted, totals.length)
    .reduce((n, b) => { return parseInt(n) + parseInt(b)}, 0);
  }

  isA(typeStr, obj){
    return typeof obj === typeStr && obj !== null;
  }

  updateAuth(oldAuth, newAuth){
    let expiryTime = new moment();
    expiryTime.add(newAuth.expires_in, 'second');
    return Object.assign({}, oldAuth, {
      accessToken: newAuth.access_token,
      refreshToken : newAuth.refresh_token,
      tokenType: newAuth.token_type,
      expiresAt: expiryTime,
      stormpathAccessTokenHref: newAuth.stormpath_access_token_href,
      loggedIn: true});
    }

    tripCanStart(trip){
      return (trip.leavingPort && trip.sailingTime && trip.ETA && trip.estimatedReturnPort && (!trip.started))
    }

  };

  export default Helper;
