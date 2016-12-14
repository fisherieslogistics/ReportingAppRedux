import moment from 'moment';
import ModelUtils from '../utils/ModelUtils';
import Helper from '../utils/Helper';
import ProductModel from '../models/ProductModel';

import  {getFormModelByTypeCode, getFishingEventModelByTypeCode} from '../utils/FormUtils';

const helper = new Helper();

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
          const deletedProducts = Object.assign({}, state.deletedProducts);
          deletedProducts[state.events.length + 1] = [];
          state = changeState(state, { deletedProducts });
          return newFishingEvent(state, action.location, action.formType);
        case 'endFishingEvent':
          return endFishingEvent(state, action.location, action.id, action.formType);
        case 'cancelFishingEvent':
          return changeState(state, {events: [...state.events.slice(0, state.events.length - 1)]});
        case 'setFishingEventValue':
          const change = {};
          change[action.inputId] = action.value;
          if(action.inputId === 'bottomDepth'){
            change.groundropeDepth = action.value
          }
          return changeEvent(action.fishingEventId - 1, state, change, action.formType);
        case 'setLocationValue':
          //always negative whatever they put it for lat
          const negativeLatChanges = Object.assign({}, action.changes, {lat: (0 - Math.abs(parseFloat(action.changes.lat)))});
          return changeEvent(action.id - 1, state, {locationAtStart: negativeLatChanges}, action.formType);
        case 'changeSpecies':
          return ChangeCatch(action, state, "code", action.formType);
        case 'changeWeight':
          return ChangeCatch(action, state, "weight", action.formType);
        case 'changeCustom':
          return ChangeCatch(action, state, action.name, action.formType);
        case 'addProduct':
          state = clearDeletedProducts(action.fishingEventId, state);
          state = addNewCatch(action.fishingEventId, state, action.formType);
          return state;
        case 'deleteProduct':
          return stashDeletedProduct(state, action);
        case 'undoDeleteProduct':
          return undoDeleteProduct(state, action);
        case 'formSigned':
          action.fishingEvents.forEach((fe) => {
            state = changeEvent(fe.id - 1, state, {signature: action.signature,
                                                   dateSigned: action.dateSigned,
                                                   committed: true}, action.formType);
          });
          return Object.assign({}, state);
        case 'addUnsoughtCatch':
          const addChange = {lastChange: new moment()};
          addChange[action.unsoughtType] = action.unsoughtCatch;
          return changeEvent(action.fishingEventId - 1, state, addChange, action.formType);
        default:
          return state;
    }
}

const changeEvent = (index, state, changes, formType) => {
  changes.lastChange = moment();
  const updatedEvent = Object.assign({}, state.events[index], changes);
  updatedEvent.eventValid = calculateEventValid(updatedEvent, formType);
  updatedEvent.productsValid = calculateEventProductsValid(updatedEvent);
  return replaceFishingEvent(state, updatedEvent);
}

const undoDeleteProduct = (state, {fishingEventId, formType}) => {
  const product = state.deletedProducts[fishingEventId].pop();
  return addProductToEvent(fishingEventId, product, state, formType);
}

const clearDeletedProducts = (fishingEventId, state) => {
  const change = {};
  change[fishingEventId] = [];
  const deleted = Object.assign(state.deletedProducts, change);
  return Object.assign(state, {deletedProducts: deleted});
}

const stashDeletedProduct = (state, {fishingEventId, productIndex, formType}) => {
  const fishingEvent = state.events[fishingEventId -1];
  const product = fishingEvent.products[productIndex];
  const deletedProducts = Object.assign({}, state.deletedProducts);
  if(fishingEventId in deletedProducts){
    deletedProducts[fishingEventId].push(product);
  }else{
    deletedProducts[fishingEventId] = [product];
  }
  const newProducts = [
    ...fishingEvent.products.slice(0, productIndex),
    ...fishingEvent.products.slice(productIndex + 1, fishingEvent.products.length)
  ];
  state = changeEvent(fishingEventId-1, state, {products: newProducts}, formType);
  return changeState(state, { deletedProducts });
}

const changeState = (state, change) => Object.assign({}, state, change)

const replaceFishingEvent = (state, updatedEvent) => Object.assign({}, state,
    {events: [
      ...state.events.slice(0, updatedEvent.id -1),
      updatedEvent,
      ...state.events.slice(updatedEvent.id)
    ]
  });

const calculateEventProductsValid = (fEvent) => {
  let valid = true;
  const usedCodes = [];
  fEvent.products.forEach(p => {
    if(!p.code || !p.weight) {
      valid = false;
    }
    if(usedCodes.indexOf(p.code) !== -1){
      valid = false;
    }
    usedCodes.push(p.code);
  });
  return valid && fEvent.products.length;
}

const calculateEventValid = (fEvent, formType) => {
  const fishingEventModel = getFishingEventModelByTypeCode(formType);
  let valid = true;
  fishingEventModel.complete.forEach((attr) => {
    if(attr.valid){
      if(attr.valid && !attr.valid.func(fEvent[attr.id])){
        valid = false;
      }
    }
  });
  return valid;
}

const addProductToEvent = (fishingEventId, product, state, formType) => {
  const fishingEventProducts = [...state.events[fishingEventId -1].products, product];
  return changeEvent(fishingEventId -1, state, {products: fishingEventProducts}, formType);
}

const addNewCatch = (fishingEventId, state, formType) => {
  const product = ModelUtils.blankModel(ProductModel);
  return addProductToEvent(fishingEventId, product, state, formType);
}

const ChangeCatch = (action, state, attr, formType) => {
  const fishingEventIndex = action.fishingEventId - 1;
  const change = {}
  change[attr] = action.value;
  const newCatch = Object.assign({}, state.events[fishingEventIndex].products[action.catchIndex], change)
  const fishingEventChange = {};
  fishingEventChange.products = [
      ...state.events[fishingEventIndex].products.slice(0, action.catchIndex),
      newCatch,
      ...state.events[fishingEventIndex].products.slice(action.catchIndex + 1)
  ];
  const updatedEvent = Object.assign({}, state.events[fishingEventIndex], fishingEventChange);
  updatedEvent.lastChange = moment();
  updatedEvent.eventValid = calculateEventValid(updatedEvent, formType);
  updatedEvent.productsValid = calculateEventProductsValid(updatedEvent);
  return Object.assign({}, state, {events: [
      ...state.events.slice(0, fishingEventIndex),
      updatedEvent,
      ...state.events.slice(fishingEventIndex + 1)
  ]});
}

const endFishingEvent = (state, location, id, formType) => {
  const change = {};
  change.datetimeAtEnd = moment();
  change.locationAtEnd = location;
  change.nonFishProtected = false;
  const fishingEventToUpdate = Object.assign({}, state.events[id - 1], change);
  fishingEventToUpdate.eventValid = calculateEventValid(fishingEventToUpdate, formType);
  return Object.assign({}, state, {events: [
      ...state.events.slice(0, id - 1),
      fishingEventToUpdate,
      ...state.events.slice(id, state.events.length)
  ]});
};

const newFishingEvent = (state, location, formType) => {
  const fishingEventModel = getFishingEventModelByTypeCode(formType);
  const newEvent = ModelUtils.blankModel(fishingEventModel.complete, 'FishingEvent');
  newEvent.id = state.events.length + 1;
  newEvent.datetimeAtStart = moment();
  newEvent.locationAtStart = Object.assign({}, location);
  newEvent.products = [];
  const previousEvent = state.events[newEvent.id - 2];
  if(previousEvent){
    fishingEventModel.complete.filter(attr => attr.repeating).forEach((attribute) => {
      newEvent[attribute.id] = previousEvent[attribute.id];
    });
    newEvent.products = previousEvent.products.filter(
      p => !['OTH', 'Other Species Weight'].includes(p.code)).map(
        p => Object.assign({}, p, { weight: 0 }));
  }
  for(let i = newEvent.products.length; i < 9; i++) {
    newEvent.products.push(ModelUtils.blankModel(ProductModel));
  }
  newEvent.products[8].code = 'OTH';
  newEvent.products[8].weight = 0;
  newEvent.eventValid = false;
  newEvent.productsValid = false;
  return Object.assign({}, state, {
      events: [
          ...state.events,
          newEvent
      ]
  });
};
