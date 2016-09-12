'use strict';
import {
  TextInput,
} from 'react-native';
import React from 'react';

export default class FocusOnDemandTextInput extends TextInput {

  constructor(props){
    super(props)
  }

  focus() {
    if(this._component){
      this._component.focus();
    }
  }

  componentWillUnmount(){
    if(this._component){
      this._component.blur();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { focus } = nextProps;
    if(focus) {
      this.focus();
    }
  }

}
