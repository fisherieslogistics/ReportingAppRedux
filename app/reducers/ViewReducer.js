import moment from 'moment';
import Helper from '../utils/Helper';
import EventEmitter from 'EventEmitter';
import Orientation from 'react-native-orientation';
const helper = new Helper();
const assign = helper.assign;

let initialState = {
  viewingEventId: 1,
  detailView: "catch",
  orientation: 'PORTRAIT',
  width: 768,
  height: 1024,
  autoSuggestBar: {
    choices: [],
    favourites: [],
    taken: [],
    text: "",
    name: null,
    uivisible: false,
    inputId: null
  },
}


export default (state = initialState, action) => {
    if(!state.orientation){
      state = getOrientationDetail(state, Orientation.getInitialOrientation());
    };
    switch (action.type) {
      case 'setViewingFishingEvent':
        return update(state, {viewingEventId: action.fishingEventId});
      case 'initAutoSuggestBarChoices':
        //use a name change to tell it to re initialise
        return update(state, {autoSuggestBar: update(state.autoSuggestBar, action)});
      case 'changeAutoSuggestBarText':
        return update(state, {autoSuggestBar: update(state.autoSuggestBar, {
          text: action.text,
          name: action.name
        })});
      case 'toggleAutoSuggestBar':
        state.autoSuggestBar.uivisible = action.visible;
        return state;
      case 'orientation':
        return getOrientationDetail(state, action.orientation);
    default:
        return state;
    }
};

function getOrientationDetail(state, orientation){
  console.log("ORI", orientation);
  switch (orientation) {
    case 'PORTRAIT':
    case 'PORTRAITUPSIDEDOWN':
      return update(state, {width: 768, height: 1024, orientation: orientation});
    case 'LANDSCAPE':
    case 'LANDSCAPEUPSIDEDOWN':
      return update(state, {width: 1024, height: 768, orientation: orientation});
    default:
      return update(state, {width: 1024, height: 768, orientation: orientation});
  }
};

const update = (obj, change) => {
  return Object.assign({}, obj, change);
}
