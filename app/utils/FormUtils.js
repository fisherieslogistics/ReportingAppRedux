'use strict';
import {
  Image,
  View,
} from 'react-native';
import React from 'react';

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
const tcerModel = FormModel.concat(TCERFormModel);

const tcerFishingEventModel = FishingEventModel.concat(TCERFishingEventModel);
const lcerFishingEventModel = FishingEventModel.concat(LCERFishingEventModel);

function renderForm(formType, text, styles){
  switch(formType){
    case 'tcer':
      return (
        <Image source={require('../images/TCER.png')} style={[styles.bgImageTCER]}>
          <View style={styles.form}>
            {text}
          </View>
        </Image>
      );
    case 'lcer':
      return (
        <Image source={require('../images/LCER.png')} style={[styles.bgImageLCER]}>
          <View style={styles.form}>
            {text}
          </View>
        </Image>
      );
  }
}

const formModels = {
  tcer: tcerModel,
  lcer: lcerModel,
}

const fishingEventModels = {
  tcer: {
    complete: tcerFishingEventModel,
    specific: TCERFishingEventModel,
  },
  lcer: {
    complete: lcerFishingEventModel,
    specific: LCERFishingEventModel,
  }
}

const helper = new Helper();

function firstEventValue(fishingEvents, id){
  if(typeof id === 'function'){
    return id(fishingEvents[0]);
  }
  return fishingEvents[0][id];
}

function createForms(fishingEvents, formType) {
  const formModel = formModels[formType];
  const forms = [];
  const newForm = (fe) => {
    const values = {
      id: forms.length + 1,
      created: new moment(fe.datetimeAtStart.unix()),
      fishingEvents: [helper.assign({}, fe)]
    }
    const form = helper.assign(ModelUtils.blankModel(formModel), values);
    newForm.signature = fe.signature;
    forms.push(form);
  }
  const addFishingEvent = (fe) => {
    const _form = forms[forms.length -1];
    const formReady = (_form && _form.fishingEvents.length !== _form.meta.eventsPerForm);
    if(formReady && _form.meta.compatible(_form.fishingEvents[_form.fishingEvents.length -1], fe)){
      _form.fishingEvents.push(helper.assign(fe, {numberInForm: _form.fishingEvents.length + 1}));
    }else {
      newForm(helper.assign(fe, {numberInForm: 1}));
    }
  }
  fishingEvents.forEach((fe, i) => {
    const shotNum = i+1;
    addFishingEvent(helper.assign(fe, {shotNumber: shotNum}));
  });
  return forms;
}

function getFormModelByTypeCode(typeCode){
  if(!( typeCode in formModels)){
    throw new Error("invalid type code for form model");
  }
  return formModels[typeCode];
}

function getFishingEventModelByTypeCode(typeCode){
  if(!( typeCode in fishingEventModels)){
    throw new Error("invalid type code for fishing event model");
  }
  return fishingEventModels[typeCode];
}

export {firstEventValue, createForms, getFormModelByTypeCode, getFishingEventModelByTypeCode, renderForm}
