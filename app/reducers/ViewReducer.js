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
    text: "",
    uivisible: false,
    inputId: null
  },
}

const update = (obj, change) => Object.assign({}, obj, change)

initialState = getOrientationDetail(initialState, Orientation.getInitialOrientation());

export default (state = initialState, action) => {
    if(!state.orientation){
      state = getOrientationDetail(state, Orientation.getInitialOrientation());
    }
    switch (action.type) {
      case 'setViewingFishingEvent':
        return update(state, {viewingEventId: action.fishingEventId});
      case 'initAutoSuggestBarChoices':
        //use a name change to tell it to re initialise
        return update(state, { autoSuggestBar: update(state.autoSuggestBar, action) });
      case 'changeAutoSuggestBarText':
        return update(state, {autoSuggestBar: update(state.autoSuggestBar, {
          text: action.text,
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
  switch (orientation) {
    case 'PORTRAIT':
    case 'PORTRAITUPSIDEDOWN':
      const newState = update(state, { width: 768, height: 1024, orientation });
      return newState;
    case 'LANDSCAPE':
    case 'LANDSCAPEUPSIDEDOWN':
      const newLState = update(state, { width: 1024, height: 768, orientation });
      return newLState;
    default:
      return state;
  }
}
