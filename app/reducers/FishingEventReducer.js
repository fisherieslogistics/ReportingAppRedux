import moment from 'moment';
import ModelUtils from '../utils/ModelUtils';
import Helper from '../utils/Helper';
import FishingEventModel from '../models/FishingEventModel';
import TCERFishingEventModel from '../models/TCERFishingEventModel';
import {findCombinedErrors, findErrors} from '../utils/ModelErrors';
import ProductModel from '../models/ProductModel';
const helper = new Helper();
const NUMBER_OF_PRODUCTS = 12;
const fishingEventModel = [...FishingEventModel.concat(TCERFishingEventModel)];
const fishingMethodSpecificModel = TCERFishingEventModel;

let initialState = {
  events: [],
  errors: {}
}

export default (state = initialState, action) => {
    if (typeof state === 'undefined') {
        return initialState;
    }
    switch(action.type) {
        case 'startFishingEvent':
          return newFishingEvent(state, action.location, action.gear);
        case 'endFishingEvent':
          return endFishingEvent(state, action.location, action.id);
        case 'cancelFishingEvent':
          return changeState(state, {events: [...state.events.slice(0, state.events.length - 1)]});
        case 'setFishingEventValue':
          let change = {};
          change[action.inputId] = action.value;
          return ChangeEvent(action.fishingEventId - 1, state, change);
        case 'setLocationValue':
          //always negative whatever they put it for lat
          let negativeLatChanges = Object.assign({}, action.changes, {lat: (0 - Math.abs(parseFloat(action.changes.lat)))});
          return ChangeEvent(action.id - 1, state, {locationAtStart: negativeLatChanges});
        case 'changeSpecies':
          return ChangeCatch(action, state, "code");
        case 'changeWeight':
          return ChangeCatch(action, state, "weight");
        case 'changeCustom':
          return ChangeCatch(action, state, action.name);
        case 'setFishingEventId':
          return ChangeEvent(action.fishingEventId - 1, state, { fishyFishId: action.fishyFishId, lastSubmitted: action.lastSubmitted }, true);
        case 'addProduct':
          return addNewCatch(action.fishingEventId, state);
        case 'changeEventGear':
          let fishingEvent = state.events[action.fishingEventId -1];
          const gearChange = {};
          gearChange[action.key] = action.value;
          let gear = Object.assign({}, fishingEvent.gear, gearChange);
          fishingEvent = setFishingEventGear(fishingEvent, gear);
          return replaceFishingEvent(state, fishingEvent);
        case 'formSigned':
          action.fishingEvents.forEach((fe) => {
            state = ChangeEvent(fe.id, state, {signature: action.signature, dateSigned: action.dateSigned});
          });
          return state;
        default:
            return state;
    }
}

const updateErrors = (fishingEvent, state) => {
  let change = {};
  change[fishingEvent.id] = findErrors(fishingEventModel, fishingEvent).concat(findCombinedErrors(fishingEventModel, fishingEvent));
  return change;
}

const changeState = (state, change) => {
  return Object.assign({}, state, change);
}

const ChangeEvent = (index, state, changes) => {
  changes.lastChange = moment();
  updatedEvent = Object.assign({}, state.events[index], changes);
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

const addNewCatch = (fishingEventId, state) => {
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
  let fishingEventProducts = [...state.events[fishingEventId -1].products];
  fishingEventProducts.push(product);
  return ChangeEvent(fishingEventId -1, state, {products: fishingEventProducts});
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
  updatedEvent.productsValid = calculateProductsValid(updatedEvent);
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
  return Object.assign({}, state, {events: [
      ...state.events.slice(0, id - 1),
      fishingEventToUpdate,
      ...state.events.slice(id, state.events.length)
  ]});
};

const calculateProductsValid = (Event) => {
  let products = Event.products;
  let hasAtLeastOne = false;
  for(let i = 0; i < products.length; i++) {
      if(products[i].code != '' && products[i].weight != '' && products[i].weight != 0) {
          hasAtLeastOne = true;
      }
  }
  return hasAtLeastOne;
};

const setFishingEventGear = (fishingEvent, gear) => {
  fishingEvent = Object.assign({}, fishingEvent, {gear: gear});
  Object.keys(gear).forEach((k) => {
    if(k in fishingEvent){
      fishingEvent[k] = fishingEvent.gear[k];
    }
  });
  return fishingEvent;
}

const newFishingEvent = (state, location, gear) => {
  let newEvent = ModelUtils.blankModel(fishingEventModel);
  let id = state.events.length + 1;
  newEvent.id = id;
  newEvent.datetimeAtStart = moment();
  let Location = Object.assign({}, location);
  newEvent.locationAtStart = Location;
  newEvent.products = [];
  let previousEvent = state.events.length ? Object.assign({}, state.events[state.events.length - 1]) : null;
  if(previousEvent){
    newEvent.targetSpecies = "" + previousEvent.targetSpecies;
    fishingMethodSpecificModel.forEach((attribute) => {
      let update = {};
      update[attribute.id] = previousEvent[attribute.id];
      newEvent = Object.assign({}, newEvent, update);
    });
    newEvent = setFishingEventGear(newEvent, Object.assign({}, previousEvent.gear));
  }else{
    newEvent = setFishingEventGear(newEvent, Object.assign({}, gear));
  }
  return Object.assign({}, state, {
      events: [
          ...state.events,
          newEvent
      ]
  });
};
