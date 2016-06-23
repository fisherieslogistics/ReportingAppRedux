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
  showingForms(fishingEvents){
    return {
      type: 'showingForms',
      fishingEvents: fishingEvents
    }
  }
}

export default FormActions;
