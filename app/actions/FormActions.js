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
  signForm(form, signature){
    return {
      type: 'formSigned',
      fishingEvents: form.fishingEvents,
      form: form,
      signature: signature,
      dateSigned: new moment(),
    }
  }
}

export default FormActions;
