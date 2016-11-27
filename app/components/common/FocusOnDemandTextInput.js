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
      this._component.focus;
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
    this.clearTimeout(this.focusTimeout);
    if(focus) {
      this.focusTimeout = setTimeout(this.focus);
    }
  }

}
