'use strict';
import {
  TextInput,
} from 'react-native';
import React from 'react';

export default class FocusOnDemandTextInput extends TextInput {

  focus() {
    this._component.focus();
  }

  componentWillReceiveProps(nextProps) {
    const { focus } = nextProps;
    if(focus) {
      this.focus();
    }
  }

}
