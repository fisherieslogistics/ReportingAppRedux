"use strict";
import moment from 'moment';
import Helper from '../utils/Helper';
const helper = new Helper();

class FormActions{
  setViewingForm(form, index){
    return {
      type: 'setViewingForm',
      form: form,
      index: index
    }
  }
  signForm(form, signature){
    return (dispatch, getState) => {
      dispatch({
        type: 'formSigned',
        fishingEvents: form.fishingEvents,
        signature: signature,
        dateSigned: new moment(),
        formType: getState().default.me.formType,
      });
    }
  }
}

export default FormActions;
