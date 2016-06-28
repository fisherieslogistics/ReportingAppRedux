import moment from 'moment';
import Helper from '../utils/Helper';
import EventEmitter from 'EventEmitter';

const helper = new Helper();
const assign = helper.assign;

let initialState = {
  viewingFishingEventId: 1,
  detailView: "catch",
  autoSuggestBar: {
    choices: [],
    favourites: [],
    favouritesChangedAt: null,
    text: "",
    name: null,
    visible: false
  },
  eventEmitter: null
}

export default (state = initialState, action) => {
    if(!state.eventEmitter){
      state = update(state, {eventEmitter: new EventEmitter()});
    }
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
        console.log(action);
        return update(state, {autoSuggestBar: update(state.autoSuggestBar, {
          visible: action.visible
        })});
    default:
        return state;
    }
};

const update = (obj, change) => {
  return Object.assign({}, obj, change);
}
