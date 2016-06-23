"use strict";
import moment from 'moment';
import Helper from '../utils/Helper';
const helper = new Helper();

class FormActions{
  setViewingForm(formId, tripId){
    return {
      type: 'setViewingForm',
      formId: formId,
      tripId: tripId
    }
  }
  showingForms(resources, fishingEvents){
    return {
      type: 'showingForms',
      resources: resources,
      fishingEvents: fishingEvents
    }
  }
}

export default FormActions;
