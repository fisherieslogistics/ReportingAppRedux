import moment from 'moment';
import ModelUtils from '../utils/ModelUtils';
import Helper from '../utils/Helper';
import FishingEventModel from '../models/FishingEventModel';
import TCERFishingEventModel from '../models/TCERFishingEventModel';
import {findCombinedErrors, findErrors} from '../utils/ModelErrors';
import ProductModel from '../models/ProductModel';
const helper = new Helper();
const NUMBER_OF_PRODUCTS = 12;
const fishingEventModel = FishingEventModel.concat(TCERFishingEventModel);

const allFishingEventAttrs = Object.keys(fishingEventModel);

let initialState = {
  events: [],
  errors: {},
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
          return newFishingEvent(state, action.location, action.gear);
        case 'endFishingEvent':
          return endFishingEvent(state, action.location, action.id);
        case 'cancelFishingEvent':
          return changeState(state, {events: [...state.events.slice(0, state.events.length - 1)]});
        case 'setFishingEventValue':
          let change = {};
          change[action.inputId] = action.value;
          return changeEvent(action.fishingEventId - 1, state, change);
        case 'setLocationValue':
          //always negative whatever they put it for lat
          let negativeLatChanges = Object.assign({}, action.changes, {lat: (0 - Math.abs(parseFloat(action.changes.lat)))});
          return changeEvent(action.id - 1, state, {locationAtStart: negativeLatChanges});
        case 'changeSpecies':
          return ChangeCatch(action, state, "code");
        case 'changeWeight':
          return ChangeCatch(action, state, "weight");
        case 'changeCustom':
          return ChangeCatch(action, state, action.name);
        case 'addProduct':
          state = clearDeletedProducts(action.fishingEventId, state);
          return addNewCatch(action.fishingEventId, state);
        case 'deleteProduct':
          return stashDeletedProduct(state, action);
        case 'undoDeleteProduct':
          return undoDeleteProduct(state, action);
        case 'changeEventGear':
          let gearChange = {};
          gearChange[action.key] = action.value;
          return changeEvent(action.fishingEventId - 1, state, gearChange)
        case 'formSigned':
          action.fishingEvents.forEach((fe) => {
            state = changeEvent(fe.id - 1, state, {signature: action.signature,
                                                   dateSigned: action.dateSigned,
                                                   committed: true});
          });
          return Object.assign({}, state);
        default:
            return state;
    }
}

const undoDeleteProduct = (state, {fishingEventId}) => {
  let product = state.deletedProducts[fishingEventId].pop();
  return addProductToEvent(fishingEventId, product, state);
}

const clearDeletedProducts = (fishingEventId, state) => {
  let change = {};
  change[fishingEventId] = [];
  let deleted = Object.assign(state.deletedProducts, change);
  return Object.assign(state, {deletedProducts: deleted});
}

const stashDeletedProduct = (state, {fishingEventId, productIndex}) => {
  let fishingEvent = state.events[fishingEventId -1];
  let product = fishingEvent.products[productIndex];
  let deletedProducts = Object.assign({}, state.deletedProducts);
  if(fishingEventId in deletedProducts){
    deletedProducts[fishingEventId].push(product);
  }else{
    deletedProducts[fishingEventId] = [product];
  }
  let newProducts = [
    ...fishingEvent.products.slice(0, productIndex),
    ...fishingEvent.products.slice(productIndex + 1, fishingEvent.products.length)
  ];
  state = changeEvent(fishingEventId-1, state, {products: newProducts});
  return changeState(state, {deletedProducts: deletedProducts});
}

const changeState = (state, change) => {
  return Object.assign({}, state, change);
}

const changeEvent = (index, state, changes) => {
  changes.lastChange = moment();
  updatedEvent = Object.assign({}, state.events[index], changes);
  updatedEvent.eventValid = calculateEventValid(updatedEvent);
  return replaceFishingEvent(state, updatedEvent);
}

const replaceFishingEvent = (state, updatedEvent) => {
  return Object.assign({}, state,
    {events: [
      ...state.events.slice(0, updatedEvent.id -1),
      updatedEvent,
      ...state.events.slice(updatedEvent.id)
    ]
  });
}

const blankCatch = () => {
  return ModelUtils.blankModel(ProductModel);
}

const getNewProduct = (fishingEventId, state) => {
  let product = blankCatch();
  let fishingEvent = state.events[fishingEventId-1];
  if(fishingEventId > 1){
    const previousEvent = state.events[fishingEventId - 2];
    const previousProduct = previousEvent.products[fishingEvent.products.length];
    if(previousProduct){
      ['code', 'containerType', 'treatment', 'state'].forEach((a) => {
        product[a] = previousProduct[a] || product[a];
      });
    }
  }
  return product;
}

const addNewCatch = (fishingEventId, state) => {
  let product = getNewProduct(fishingEventId, state);
  return addProductToEvent(fishingEventId, product, state);
}

const addProductToEvent = (fishingEventId, product, state) => {
  let fishingEventProducts = [...state.events[fishingEventId -1].products, product];
  return changeEvent(fishingEventId -1, state, {products: fishingEventProducts});
}

const ChangeCatch = (action, state, attr) => {
  let fishingEventIndex = action.fishingEventId - 1;
  let change = {}
  change[attr] = action.value;
  let newCatch = Object.assign({}, state.events[fishingEventIndex].products[action.catchIndex], change)
  let fishingEventChange = {};
  fishingEventChange.products = [
      ...state.events[fishingEventIndex].products.slice(0, action.catchIndex),
      newCatch,
      ...state.events[fishingEventIndex].products.slice(action.catchIndex + 1)
  ];
  updatedEvent = Object.assign({}, state.events[fishingEventIndex], fishingEventChange);
  updatedEvent.lastChange = moment();
  updatedEvent.eventValid = calculateEventValid(updatedEvent);
  return Object.assign({}, state, {events: [
      ...state.events.slice(0, fishingEventIndex),
      updatedEvent,
      ...state.events.slice(fishingEventIndex + 1)
  ]});
}

const endFishingEvent = (state, location, id) => {
  let change = {};
  change.datetimeAtEnd = moment();
  change.locationAtEnd = location;
  let fishingEventToUpdate = Object.assign({}, state.events[id - 1], change);
  fishingEventToUpdate.eventValid = calculateEventValid(fishingEventToUpdate);
  return Object.assign({}, state, {events: [
      ...state.events.slice(0, id - 1),
      fishingEventToUpdate,
      ...state.events.slice(id, state.events.length)
  ]});
};

const calculateEventValid = (fEvent) => {
  let valid = true;
  let productsValid = !fEvent.products.find(p => !(p.weight && p.code)) && fEvent.products.length;
  fishingEventModel.forEach((attr) => {
    if(attr.valid){
      if(attr.valid && !attr.valid.func(fEvent[attr.id])){
        valid = false;
        console.log(attr.id, fEvent[attr.id]);
      }
    }
  });
  return valid && productsValid;
};

const setFishingEventGear = (fishingEvent, gear) => {
  Object.keys(gear).forEach((k) => {
    if(allFishingEventAttrs.indexOf(k) !== -1){
      fishingEvent[k] = gear[k];
    }
  });
  return fishingEvent;
}

const newFishingEvent = (state, location, gear) => {
  let newEvent = ModelUtils.blankModel(fishingEventModel);
  let id = state.events.length + 1;
  const objectId = newEvent.objectId;
  newEvent.id = id;
  let deletedProducts = Object.assign({}, state.deletedProducts);
  deletedProducts[id] = [];
  state = changeState(state, {deletedProducts: deletedProducts});
  newEvent.datetimeAtStart = moment();
  let Location = Object.assign({}, location);
  newEvent.locationAtStart = Location;
  newEvent.products = [];
  let previousEvent = state.events.length ? Object.assign({}, state.events[state.events.length - 1]) : null;
  if(previousEvent){
    newEvent.targetSpecies = "" + previousEvent.targetSpecies;
    TCERFishingEventModel.forEach((attribute) => {
      let update = {};
      update[attribute.id] = previousEvent[attribute.id];
      newEvent = Object.assign({}, newEvent, update);
    });
  }
  newEvent.objectId = objectId;
  return Object.assign({}, state, {
      events: [
          ...state.events,
          newEvent
      ]
  });
};
