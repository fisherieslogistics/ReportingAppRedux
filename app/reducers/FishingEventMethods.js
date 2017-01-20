import ModelUtils from '../utils/ModelUtils';
import ProductModel from '../models/ProductModel';
import moment from 'moment';

function changeEvent(index, state, changes) {
  changes.lastChange = moment();
  const fEvent = state.events[index];
  const updatedEvent = update(fEvent, changes);
  updatedEvent.eventValid = calculateEventValid(updatedEvent);
  updatedEvent.productsValid = calculateEventProductsValid(updatedEvent);
  return replaceFishingEvent(state, updatedEvent);
}

function undoDeleteProduct(state, {fishingEventId}) {
  const product = state.deletedProducts[fishingEventId].pop();
  return addProductToEvent(fishingEventId, product, state);
}

function clearDeletedProducts(fishingEventId, state) {
  const change = {};
  change[fishingEventId] = [];
  const deleted = update(state.deletedProducts, change);
  return update(state, { deletedProducts: deleted });
}

function stashDeletedProduct(state, {fishingEventId, productIndex}) {
  const fishingEvent = state.events[fishingEventId -1];
  const product = fishingEvent.products[productIndex];
  const deletedProducts = update({}, state.deletedProducts);
  if(fishingEventId in deletedProducts){
    deletedProducts[fishingEventId].push(product);
  }else{
    deletedProducts[fishingEventId] = [product];
  }
  const newProducts = [
    ...fishingEvent.products.slice(0, productIndex),
    ...fishingEvent.products.slice(productIndex + 1, fishingEvent.products.length)
  ];
  state = changeEvent(fishingEventId-1, state, { products: newProducts });
  return update(state, { deletedProducts });
}

function update(obj, change) {
  return Object.assign({}, obj, change);
}

function replaceFishingEvent(state, updatedEvent){
  const events = [
    ...state.events.slice(0, updatedEvent.id -1),
    updatedEvent, ...state.events.slice(updatedEvent.id)
  ];
  return update(state, { events });
}

function calculateEventProductsValid(fEvent) {
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

function calculateEventValid(fEvent) {
  let valid = true;
  ModelUtils.getFishingEventModel().forEach((attr) => {
    if(attr.valid){
      if(attr.valid && !attr.valid.func(fEvent[attr.id])){
        valid = false;
      }
    }
  });
  return valid;
}

function addProductToEvent (fishingEventId, product, state) {
  const fishingEventProducts = [...state.events[fishingEventId -1].products, product];
  return changeEvent(fishingEventId -1, state, {products: fishingEventProducts});
}

function addNewCatch (fishingEventId, state) {
  const product = ModelUtils.blankModel(ProductModel, 'PRODUCT');
  return addProductToEvent(fishingEventId, product, state);
}

function changeCatch (action, state, attr) {
  const fishingEventIndex = action.fishingEventId - 1;
  const change = {}
  change[attr] = action.value;
  const newCatch = update(state.events[fishingEventIndex].products[action.catchIndex], change)
  const fishingEventChange = {};
  fishingEventChange.products = [
      ...state.events[fishingEventIndex].products.slice(0, action.catchIndex),
      newCatch,
      ...state.events[fishingEventIndex].products.slice(action.catchIndex + 1)
  ];
  const updatedEvent = update(state.events[fishingEventIndex], fishingEventChange);
  updatedEvent.lastChange = moment();
  updatedEvent.productsValid = calculateEventProductsValid(updatedEvent);
  updatedEvent.eventValid = calculateEventValid(updatedEvent);
  return update(state, {events: [
      ...state.events.slice(0, fishingEventIndex),
      updatedEvent,
      ...state.events.slice(fishingEventIndex + 1)
  ]});
}

function endFishingEvent (state, location, id) {
  const change = {};
  change.datetimeAtEnd = moment();
  change.locationAtEnd = location;
  change.nonFishProtected = false;
  const fishingEventToUpdate = update(state.events[id - 1], change);
  fishingEventToUpdate.eventValid = calculateEventValid(fishingEventToUpdate);
  return update(state, {events: [
      ...state.events.slice(0, id - 1),
      fishingEventToUpdate,
      ...state.events.slice(id, state.events.length)
  ]});
}

function newFishingEvent (state, location) {
  const fishingEventModel = ModelUtils.getFishingEventModel();
  const newEvent = ModelUtils.blankModel(fishingEventModel, 'FishingEvent');
  newEvent.id = state.events.length + 1;
  newEvent.datetimeAtStart = moment();
  newEvent.locationAtStart = location;
  newEvent.products = [];
  const previousEvent = state.events[newEvent.id - 2];
  if(previousEvent){
    fishingEventModel.filter(attr => attr.repeating).forEach((attribute) => {
      newEvent[attribute.id] = previousEvent[attribute.id];
    });
    newEvent.products = previousEvent.products.map(
        p => update(p, { weight: 0 }));
  }
  for(let i = newEvent.products.length; i < 9; i++) {
    newEvent.products.push(ModelUtils.blankModel(ProductModel, 'PRODUCT'));
  }
  newEvent.eventValid = false;
  newEvent.productsValid = false;
  const events = [...state.events, newEvent];
  return update(state, { events });
}

export {
  changeEvent,
  undoDeleteProduct,
  clearDeletedProducts,
  stashDeletedProduct,
  update,
  replaceFishingEvent,
  calculateEventProductsValid,
  calculateEventValid,
  newFishingEvent,
  endFishingEvent,
  changeCatch,
  addNewCatch,
  addProductToEvent,
};
