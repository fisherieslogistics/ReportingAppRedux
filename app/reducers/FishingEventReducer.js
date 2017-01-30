import moment from 'moment';

import {
  update,
  changeEvent,
  newFishingEvent,
  endFishingEvent,
  changeCatch,
  clearDeletedProducts,
  undoDeleteProduct,
  stashDeletedProduct,
  addNewCatch
} from './FishingEventMethods';

const initialState = {
  events: [],
  deletedProducts: {}
}

export default (state = initialState, action) => {
    if (typeof state === 'undefined') {
        return initialState;
    }
    switch(action.type) {
        case 'endTrip':
          return initialState;
        case 'startFishingEvent':
          const deletedProducts = update({}, state.deletedProducts);
          deletedProducts[state.events.length + 1] = [];
          state = update(state, { deletedProducts });
          return newFishingEvent(state, action.location, action.wingSpread, action.headlineHeight);
        case 'endFishingEvent':
          return endFishingEvent(state, action.location, action.id);
        case 'cancelFishingEvent':
          return update(state, {events: [...state.events.slice(0, state.events.length - 1)]});
        case 'setFishingEventValue':
          const change = {};
          change[action.inputId] = action.value;
          if(action.inputId === 'bottomDepth'){
            change.groundropeDepth = action.value
          }
          return changeEvent(action.fishingEventId - 1, state, change);
        case 'setLocationValue':
          //always negative whatever they put it for lat
          const negativeLatChanges = update(action.changes, {lat: (0 - Math.abs(parseFloat(action.changes.lat)))});
          return changeEvent(action.id - 1, state, {locationAtStart: negativeLatChanges});
        case 'changeSpecies':
          return changeCatch(action, state, "code");
        case 'changeWeight':
          return changeCatch(action, state, "weight");
        case 'changeCustom':
          return changeCatch(action, state, action.name);
        case 'addProduct':
          state = clearDeletedProducts(action.fishingEventId, state);
          return addNewCatch(action.fishingEventId, state);
        case 'deleteProduct':
          return stashDeletedProduct(state, action);
        case 'undoDeleteProduct':
          return undoDeleteProduct(state, action);
        case 'formSigned':
          action.fishingEvents.forEach((fe) => {
            state = changeEvent(fe.id - 1, state, {signature: action.signature,
                                                   dateSigned: action.dateSigned,
                                                   committed: true});
          });
          return state;
        case 'addUnsoughtCatch':
          const addChange = {lastChange: new moment()};
          addChange[action.unsoughtType] = action.unsoughtCatch;
          return changeEvent(action.fishingEventId - 1, state, addChange);
        default:
          return state;
    }
}
