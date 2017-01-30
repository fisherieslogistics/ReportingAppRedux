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

const formModel = FormModel.concat(TCERFormModel);

function renderForm(text, styles){
  return (
    <Image source={require('../images/TCER.png')} style={[styles.bgImageTCER]}>
      <View style={styles.form}>
        {text}
      </View>
    </Image>
  );
}

const helper = new Helper();

function createForms(fishingEvents) {
  const forms = [];
  const newForm = (fe) => {
    const values = {
      id: forms.length + 1,
      created: new moment(fe.datetimeAtStart.unix()),
      fishingEvents: [helper.assign({}, fe)]
    }
    const form = helper.assign(ModelUtils.blankModel(formModel, 'FORM'), values);
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

export { createForms, renderForm }
