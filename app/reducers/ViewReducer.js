import moment from 'moment';
import Helper from '../utils/Helper';
import EventEmitter from 'EventEmitter';
import Orientation from 'react-native-orientation';
const helper = new Helper();
const assign = helper.assign;

let initialState = {
  viewingFishingEventId: 1,
  detailView: "catch",
  uiOrientation: 'PORTRAIT',
  width: 768,
  height: 1024,
  autoSuggestBar: {
    choices: [],
    favourites: [],
    taken: [],
    text: "",
    name: null,
    visible: false,
    inputId: null
  },
}


export default (state = initialState, action) => {
    switch (action.type) {
      case 'setViewingFishingEvent':
        return update(state, {viewingFishingEventId: action.fishingEventId});
      case 'initAutoSuggestBarChoices':
        //use a name change to tell it to re initialise
        return update(state, {autoSuggestBar: update(state.autoSuggestBar, action)});
      case 'changeAutoSuggestBarText':
        return update(state, {autoSuggestBar: update(state.autoSuggestBar, {
          text: action.text,
          name: action.name
        })});
      case 'toggleAutoSuggestBar':
        if(action.visible){
          return update(state, {autoSuggestBar: update(state.autoSuggestBar, {
            visible: action.visible
          })});
        }
        return update(state, {autoSuggestBar: initialState.autoSuggestBar});
      case 'uiOrientation':
        console.log(action);
        switch (action.uiOrientation) {
          case 'PORTRAIT':
          case 'PORTRAITUPSIDEDOWN':
            return update(state, {width: 768, height: 1024, uiOrientation: action.uiOrientation});
          case 'LANDSCAPE':
          case 'LANDSCAPEUPSIDEDOWN':
            return update(state, {width: 1024, height: 768, uiOrientation: action.uiOrientation});
        }
    default:
        return state;
    }
};

const update = (obj, change) => {
  return Object.assign({}, obj, change);
}
