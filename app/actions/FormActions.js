"use strict";
import moment from 'moment';
import Helper from '../utils/Helper';
const helper = new Helper();

class FormActions{
  setViewingForm(form){
    return {
      type: 'setViewingForm',
      form: form
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
