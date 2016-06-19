import Sexagesimal from 'sexagesimal';
import AsyncStorage from 'AsyncStorage';
import moment from 'moment';

class Helper {
    getDegreesMinutesFromLocation(location) {
        const lat = Sexagesimal.format(location.lat, 'lat').split(" ");
        const lon = Sexagesimal.format(location.lon, 'lon').split(" ");
        return {
            latDegrees: parseInt(lat[0].replace(/\D/g,'')),
            latMinutes: lat.length >= 3 ? parseInt(lat[1].replace(/\D/g,'')) : 0,
            latSeconds: lat.length >= 4 ? parseInt(lat[2].replace(/\D/g,'')) : 0,
            lonDegrees: parseInt(lon[0].replace(/\D/g,'')),
            lonMinutes: lon.length >= 3 ? parseInt(lon[1].replace(/\D/g,'')) : 0,
            lonSeconds: lon.length >= 4 ? parseInt(lon[2].replace(/\D/g,'')) : 0
        };
    }
    createGuid() {
      const s4 = () => {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    }
    editLocation(changes, location) {
        let degMin = this.getDegreesMinutesFromLocation(location);
        degMin = Object.assign({}, degMin, changes);
        return this.parseLocation(degMin);
    }
    parseLocation(degMin){
        return {lat: parseInt(degMin.latDegrees) + (parseFloat(parseInt(degMin.latMinutes) / 60) + (parseFloat(parseInt(degMin.latSeconds) / 3600))),
                lon: parseInt(degMin.lonDegrees) + (parseFloat(parseInt(degMin.lonMinutes) / 60) + (parseFloat(parseInt(degMin.lonSeconds) / 3600)))};
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
            if(state.IsAMomentObject) {
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
          return this.inflate(jsonData);
        }
    };

    serialize(state) {
        return JSON.stringify(this.deflate(state));
    };

    async loadSavedState(callback) {
        let s = await AsyncStorage.getItem('savedState');
        let savedState = this.deserialize(s) || {};
        callback(savedState);
    };

    async saveToLocalStorage(state, actionType) {
      switch (actionType) {
        case 'loadSavedState':
          return;
        case 'updateGps':
          return;
      }
      await AsyncStorage.setItem('savedState', this.serialize(state));
    };

    assign(obj, change){
      return Object.assign({}, obj, change);
    };

};

export default Helper;
