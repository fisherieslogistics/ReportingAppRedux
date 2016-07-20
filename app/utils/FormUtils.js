import Helper from './Helper';
import moment from 'moment';
import ModelUtils from './ModelUtils';

import FormModel from '../models/FormModel';
import TCERFormModel from '../models/TCERFormModel';
import LCERFormModel from '../models/LCERFormModel';

import FishingEventModel from '../models/FishingEventModel';
import TCERFishingEventModel from '../models/TCERFishingEventModel';
import LCERFishingEventModel from '../models/LCERFishingEventModel';

const lcerModel = FormModel.concat(LCERFormModel);
const tcerModel = FormModel.concat(LCERFormModel);

const tcerFishingEventModel = FishingEventModel.concat(TCERFishingEventModel);
const lcerFishingEventModel = FishingEventModel.concat(LCERFishingEventModel);

const formModels = {
  tcer: tcerModel,
  lcer: lcerModel,
}

const fishingEventModels = {
  tcer: tcerFishingEventModel,
  lcer: lcerFishingEventModel,
}

const helper = new Helper();

function firstEventValue(fishingEvents, id){
  if(typeof id === 'function'){
    return id(fishingEvents[0]);
  }
  return fishingEvents[0][id];
};

function createForms(fishingEvents, formModel) {
  let forms = [];
  const newForm = (fe) => {
    let values = {
      id: forms.length + 1,
      created: new moment(fe.datetimeAtStart.unix()),
      fishingEvents: [helper.assign({}, fe)]
    }
    let form = helper.assign(ModelUtils.blankModel(formModel), values);
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

function getFormModelByTypeCode(typeCode){
  if(! typeCode in formModels){
    throw new Error("invalid type code for form model");
  }
  return formModels[typeCode];
}

function getFishingEventModelByTypeCode(typeCode){
  if(! typeCode in fishingEventModels){
    throw new Error("invalid type code for fishing event model");
  }
  return fishingEventModels[typeCode];
}

export {firstEventValue, createForms, getFormByTypeCode, getFishingEventModelByTypeCode}
