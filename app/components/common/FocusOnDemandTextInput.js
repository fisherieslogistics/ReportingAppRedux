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
    this.clearTimeout(this.focusTimeout);
    if(this._component){
      this.focusTimeout = setTimeout(this._component.focus);
    }
  }

  componentWillUnmount(){
    this.clearTimeout(this.blurTimeout);
    if(this._component){
      this.blurTimeout = setTimeout(this._component.blur);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { focus } = nextProps;
    if(focus) {
      this.focus();
    }
  }

}
