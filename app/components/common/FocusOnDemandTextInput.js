'use strict';
import {
  TextInput,
} from 'react-native';

export default class FocusOnDemandTextInput extends TextInput {

  constructor(props){
    super(props);
  }

  focus() {
    this.clearTimeout(this.focusTimeout);
    if(this._component){
      this.focusTimeout = setTimeout(this._component.focus);
      this.props.onFocus()
    }
  }

  makeBlur(){
    this.clearTimeout(this.blurTimeout);
    if(this._component){
      this.blurTimeout = setTimeout(this._component.blur);
    }
  }

  componentWillUnmount(){
    this.makeBlur();
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.isFocused) {
      this.focus();
    }
    if((!nextProps.isFocused) && this.props.isFocused){
      this.makeBlur();
    }
  }

}
