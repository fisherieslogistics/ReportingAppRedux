import moment from 'moment';
import ModelUtils from '../utils/ModelUtils';
import Helper from '../utils/Helper';
import FishingEventModel from '../models/FishingEventModel';
import TCERFishingEventModel from '../models/TCERFishingEventModel';
import {findCombinedErrors, findErrors} from '../utils/ModelErrors';
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
            return newFishingEvent(state, action.location, action.trawl);
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
    let errUpdate = updateErrors(updatedEvent, state);
    return Object.assign({}, state,
      {events: [
        ...state.events.slice(0, index),
        updatedEvent,
        ...state.events.slice(index + 1)
      ],
      errors: Object.assign({}, state.errors, errUpdate)
    });
}

const ChangeCatch = (action, state, attr) => {
    let fishingEventId = action.id - 1;
    let change = {}
    change[attr] = action.value;
    let newCatch = Object.assign({}, state.events[fishingEventId].products[action.catchId], change)
    let fishingEventChange = {};
    fishingEventChange.products = [
        ...state.events[fishingEventId].products.slice(0, action.catchId),
        newCatch,
        ...state.events[fishingEventId].products.slice(action.catchId + 1)
    ];
    updatedEvent = Object.assign({}, state.events[fishingEventId], fishingEventChange);
    updatedEvent.lastChange = moment();
    updatedEvent.productsValid = calculateProductsValid(updatedEvent);
    return Object.assign({}, state, {events: [
        ...state.events.slice(0, fishingEventId),
        updatedEvent,
        ...state.events.slice(fishingEventId + 1)
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

const CreateBlankSpeciesWeightPairs = (number) => {
    let result = [];
    for(let i = 0; i < number; i++){
      result.push({code: "", weight: ""});
    }
    return result;
};


const newFishingEvent = (state, location, trawl) => {
    let newEvent = ModelUtils.blankModel(fishingEventModel);
    let id = state.events.length + 1;
    newEvent.id = id;
    newEvent.datetimeAtStart = moment();
    let Location = Object.assign({}, location);
    newEvent.locationAtStart = Location;
    newEvent.products = CreateBlankSpeciesWeightPairs(NUMBER_OF_PRODUCTS);
    let previousEvent = state.events.length ? Object.assign({}, state.events[state.events.length - 1]) : null;
    if(previousEvent){
      newEvent.targetSpecies = "" + previousEvent.targetSpecies;
      newEvent.custom = Object.assign({}, previousEvent.custom);
      fishingMethodSpecificModel.forEach((attribute) => {
        let update = {};
        update[attribute.id] = previousEvent[attribute.id];
        newEvent = Object.assign({}, newEvent, update);
      });
      previousEvent.products.forEach((c, i) =>{
        newEvent.products[i].code = "" + c.code;
      });
    }
    return Object.assign({}, state, {
        events: [
            ...state.events,
            newEvent
        ]
    });
};
