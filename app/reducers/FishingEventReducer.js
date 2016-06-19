import moment from 'moment';
import ModelUtils from '../utils/ModelUtils';
import Helper from '../utils/Helper';
import FishingEvent from '../models/FishingEvent';
import TCERFishingEvent from '../models/TCERFishingEvent';
const helper = new Helper();
const NUMBER_OF_products = 15;

let fishingEventModel = [...FishingEvent.concat(TCERFishingEvent)];
let fishingMethodSpecificModel = TCERFishingEvent;

let initialState = {
  events: [
    {id: 1, datetimeAtEnd: new moment(), datetimeAtStart: new moment(), catchValid: true},
    {id: 2, datetimeAtEnd: new moment(), datetimeAtStart: new moment(), catchValid: true, products: [
      {code: "sna", weight: "2344"},
      {code: "lin", weight: "4500"},
      {code: "sta", weight: "3433"},
      {code: "", weight: ""},
      {code: "", weight: ""},
      {code: "", weight: ""},
      {code: "", weight: ""},
      {code: "", weight: ""},
      {code: "", weight: ""},
      {code: "", weight: ""},
      {code: "", weight: ""},
      {code: "", weight: ""},
    ]},
    {id: 3, datetimeAtEnd: new moment(), datetimeAtStart: new moment(), catchValid: true, products: []},
    {id: 4, datetimeAtEnd: new moment(), datetimeAtStart: new moment(), catchValid: false, products: []},
    {id: 5, datetimeAtEnd: new moment(), datetimeAtStart: new moment(), catchValid: false, products: []},
    {id: 6, datetimeAtEnd: new moment(), datetimeAtStart: new moment(), catchValid: true, products: []},
    {id: 7, datetimeAtEnd: new moment(), datetimeAtStart: new moment(), catchValid: false, products: []},
    {id: 8, datetimeAtEnd: new moment(), datetimeAtStart: new moment(), catchValid: true, products: []},
    {id: 9, datetimeAtEnd: new moment(), datetimeAtStart: new moment(), catchValid: true, products: []},
    {id: 10, datetimeAtEnd: new moment(), datetimeAtStart: new moment(), catchValid: true, products: []},
    {id: 11, datetimeAtEnd: null, datetimeAtStart: new moment(), catchValid: false, products: []}
  ]
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
            return ChangeShot(action.fishingEventId - 1, state, change);
        case 'setLocationValue':
            //always negative whatever they put it for lat
            let negativeLatChanges = Object.assign({}, action.changes, {lat: (0 - Math.abs(parseFloat(action.changes.lat)))});
            return ChangeShot(action.id - 1, state, {locationAtStart: negativeLatChanges});
        case 'changeSpecies':
            return ChangeCatch(action, state, "code");
        case 'changeWeight':
            return ChangeCatch(action, state, "weight");
        case 'changeCategoryNumOf':
            return ChangeCatch(action, state, action.name);
        case 'setFishingEventId':
            return ChangeShot(action.fishingEventId - 1, state, { fishyFishId: action.fishyFishId, lastSubmitted: action.lastSubmitted }, true);
        default:
            return state;
    }
}

const changeState = (state, change) => {
  return Object.assign({}, state, change);
}

const ChangeShot = (index, state, changes, silent) => {
    updatedShot = Object.assign({}, state.events[index], changes);
    if(!silent){
        updatedShot.lastChange = moment();
    }
    return Object.assign({}, state, {events: [
        ...state.events.slice(0, index),
        updatedShot,
        ...state.events.slice(index + 1)
    ]});
}


const ChangeCatch = (action, state, attr, silent) => {
    let fishingEventId = action.id - 1;
    let change = {}
    change[attr] = action.value;
    let newCatch = Object.assign({}, state.events[fishingEventId].products[action.catchId], change)

    let fishingEventChange = {};
    fishingEventChange["products"] = [
        ...state.events[fishingEventId].products.slice(0, action.catchId),
        newCatch,
        ...state.events[fishingEventId].products.slice(action.catchId + 1)
    ];
    if(!silent && state.events[fishingEventId].finished) {
        change.lastChange = moment();
    }
    updatedShot = Object.assign({}, state.events[fishingEventId], fishingEventChange);
    updatedShot.lastChange = moment();
    updatedShot.caughtDiscardValid = CalculateCaughtDiscardValid(updatedShot);
    return Object.assign({}, state, {events: [
        ...state.events.slice(0, fishingEventId),
        updatedShot,
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

const CalculateCaughtDiscardValid = (Event) => {
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
      result.push({code: '', weight: '' });
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
    newEvent.products = CreateBlankSpeciesWeightPairs(NUMBER_OF_products);

    let previousEvent = state.events.length ? Object.assign({}, state.events[state.events.length - 1]) : null;
    if(previousEvent){
      newEvent.targetSpecies = previousEvent.targetSpecies;
      newEvent.custom = previousEvent.custom;
      fishingMethodSpecificModel.forEach((attribute) => {
        newEvent[attribute.id] = previousEvent[attribute.id];
      });
      previousEvent.products.forEach((c, i) =>{
        newEvent.products[i].code = c.code;
      });
    }

    return Object.assign({}, state, {
        events: [
            ...state.events,
            newEvent
        ]
    });
};
