import FormModel from '../models/FormModel';
import TCERFormModel from '../models/TCERFormModel';
import Helper from './Helper';
import moment from 'moment';
import ModelUtils from './ModelUtils';
const helper = new Helper();

function firstEventValue(fishingEvents, id){
  if(typeof id === 'function'){
    return id(fishingEvents[0]);
  }
  return fishingEvents[0][id];
};

const createForms = (fishingEvents) => {
  let forms = [];
  const newForm = (fe) => {
    console.log(fe);
    let values = {
      id: forms.length + 1,
      created: new moment(fe.datetimeAtStart.unix()),
      fishingEvents: [helper.assign({}, fe)]
    }
    let form = helper.assign(ModelUtils.blankModel(FormModel.concat(TCERFormModel)), values);
    newForm.signature = fe.signature;
    forms.push(form);
  }
  let addFishingEvent = (fe, shotNumber) => {
    let _form = forms[forms.length -1];
    let formReady = (_form && _form.fishingEvents.length !== _form.meta.eventsPerForm) ? true : false;
    if(formReady && _form.meta.compatible(_form.fishingEvents[_form.fishingEvents.length -1], fe)){
      _form.fishingEvents.push(helper.assign(fe, {numberInForm: _form.fishingEvents.length + 1}));
    }else {
      newForm(helper.assign(fe, {numberInForm: 1}));
    }
  }
  fishingEvents.forEach((fe, i) => {
    let shotNum = i+1;
    addFishingEvent(helper.assign(fe, {shotNumber: shotNum}));
  });
  return forms;
}

export {firstEventValue, createForms}
