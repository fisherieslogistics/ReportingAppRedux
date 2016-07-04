"use strict";
import moment from 'moment';
import ModelUtils from '../utils/ModelUtils';
import FormModel from '../models/FormModel';
import TCERFormModel from '../models/TCERFormModel';
import Helper from '../utils/Helper';
import {createForms} from '../utils/FormUtils';
const helper = new Helper();
const formModel = FormModel.concat(TCERFormModel);



let initialState = {
  currentTrip: {
    forms: null
  },
  pastTrips: [],
  viewingForm: null,
  viewingTripId: null
}

const FormReducer = (state = initialState, action) => {
  switch(action.type) {
    case 'endTrip':
      let forms = createForms(action.fishingEvents, formModel);
      let trip = update(action.trip, {forms: forms});
      return update(state, {pastTrips: [...state.pastTrips, trip], currentTrip: initialState.currentTrip});
      break;
    case 'setViewingForm':
      return update(state, {viewingForm: action.form});
    }
    return state;
};

const update = (obj, change) => {
  return Object.assign({}, obj, change);
}

export default FormReducer;
