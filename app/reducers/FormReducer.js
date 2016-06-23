"use strict";
import moment from 'moment';
import ModelUtils from '../utils/ModelUtils';
import FormModel from '../models/FormModel';
import TCERFormModel from '../models/TCERFormModel';
import FishingEventModel from '../models/FishingEventModel';
import TCERFishingEventModel from '../models/TCERFishingEventModel';
import Helper from '../utils/Helper';

const helper = new Helper();
const formModel = FormModel.concat(TCERFormModel);
const fishingEventModel = FishingEventModel.concat(TCERFishingEventModel);

let initialState = {
  currentTrip: {
    forms: {}
  },
  pastTrips: [],
  viewingForm: null,
  viewingTripId: null
}

const FormReducer = (state = initialState, action) => {
  switch(action.type) {
    case 'endTrip':
      let resources = {trip: action.trip, user: action.user, vessel: action.vessel};
      let forms = createForms(action.fishingEvents, resources, formModel);
      let trip = update(action.trip, {forms: forms});
      return update(state, {pastTrips: [...state.pastTrips, trip], currentTrip: initialState.currentTrip});
      break;
    case 'showingForms':
      let _forms = createForms(action.fishingEvents, action.resources, formModel);
      let currentTrip = update(state.currentTrip, {forms: _forms});
      return update(state, {currentTrip: currentTrip});
      break;
    case 'setViewingForm':
      if(action.tripId){
        let form = state.pastTrips[action.tripId].forms[action.formId];
        return update(state, {viewingForm: form});
      }else{
        return update(state, {viewingForm: state.currentTrip[action.formId]});
      }
      break;
    }
    return state;
};

const update = (obj, change) => {
  return Object.assign({}, obj, change);
}

const setGenericFormValues = (model, form, resources) => {
  FormModel.forEach((attr) => {
    if(attr.resource){
      form[attr.id] = resources[attr.resource][attr.key || attr.id];
    }
  });
  return form
}

const setSpecificValues = (form, model) => {
  model.forEach((attr) => {
    if(attr.resolve){
      form[attr.id] = attr.resolve(form);
    }
    if(attr.resolveFromEvents){
      form[attr.id] = attr.resolveFromEvents(form.fishingEvents, attr.id);
    }
  });
  return form;
}

const createForms = (fishingEvents, resources, model) => {
  let forms = [];
  const newForm = (fe) => {
    let values = {
      id: forms.length + 1,
      created: new moment(fe.datetimeAtStart.unix()),
      fishingEvents: [helper.assign({}, fe)]
    }
    let form = helper.assign(ModelUtils.blankModel(model), values);
    forms.push(setGenericFormValues(model, form, resources));
  }
  let addFishingEvent = (fe) => {
    let _form = forms[forms.length -1];
    let formReady = (_form && _form.fishingEvents.length !== _form.meta.eventsPerForm) ? true : false;
    if(formReady && _form.meta.compatible(_form.fishingEvents[_form.fishingEvents.length -1], fe)){
      _form.fishingEvents.push(helper.assign(fe));
    }else {
      newForm(fe);
    }
  }
  fishingEvents.forEach(addFishingEvent);
  return forms.map((f) => {
    return setSpecificValues(f, TCERFormModel);
  });
}

export default FormReducer;
