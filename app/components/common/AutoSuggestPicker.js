'use strict';
import{
  StyleSheet,
  Text,
  View,
  TextInput,
} from 'react-native';


import React from 'react';
import reactMixin from 'react-mixin';
import Subscribable from 'Subscribable';
import {connect} from 'react-redux';

import Validator from '../../utils/Validator';
import {inputStyles, textStyles, colors} from '../../styles/styles';
import ViewActions from '../../actions/ViewActions';
import AutoSuggestBar from './AutoSuggestBar';
import FocusOnDemandTextInput from './FocusOnDemandTextInput';

const viewActions = new ViewActions();

class AutoSuggestPicker extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      value: "",
      inputId: props.inputId,
      changedByEvent: false,
      error: false
    }
    this.autoSuggestEmitted = this.autoSuggestEmitted.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  componentWillMount(){
    this.__mounted = true;
    this.setState({
      value: this.props.value
    });
    this.addListenerOn(this.props.eventEmitter,
                       'AutoSuggestResultPress',
                       this.autoSuggestEmitted);
  }

  componentWillReceiveProps(props){
    if(this.state.inputId !== props.inputId || (this.state.changedByEvent)){
      this.setState({
        value: props.value
      });
    }
    this.setState({
      changedByEvent: false,
      inputId: props.inputId,
    });
  }

  autoSuggestEmitted(event){
    if(event.inputId == this.props.inputId){
      this.setState({
        changedByEvent: true,
        value: event.value
      });
      this.props.onChange(event.value);
      setTimeout(() => {
        this.onBlur(event);
      })
    }
  }

  onKeyPress(event) {
    if(event.nativeEvent.key === 'Enter' && this.props.onEnterPress){
      this.props.onEnterPress(this.props.attributeId);
    }
  }

  onFocus(){
    let userFavourites = this.props.favourites[this.props.attributeId];
    let favourites = userFavourites ? Object.keys(userFavourites).sort((k1, k2) => {
      return userFavourites[k1] - userFavourites[k2];
    }) : [];
    this.props.dispatch(viewActions.initAutoSuggestBarChoices(this.props.choices,
                                                              [],
                                                              this.props.value,
                                                              this.props.name,
                                                              this.props.inputId,
                                                              ));
    this.props.dispatch(viewActions.toggleAutoSuggestBar(true));
    this.props.editingCallback(this.props.name);
  }

  onBlur(event){
    this.props.onChange(this.state.value);
    this.props.dispatch(viewActions.toggleAutoSuggestBar(false));
    this.props.editingCallback();
  }

  componentWillUnmount(){
    this.props.dispatch(viewActions.toggleAutoSuggestBar(false));
    this.props.editingCallback();
  }

  onChangeText(text) {
    this.setState({
      value: text
    });
    this.props.dispatch(viewActions.changeAutoSuggestBarText(text, this.props.name));
  }

  render () {
    let style = [inputStyles.textInput, this.props.styles | {}];
    return(
      <FocusOnDemandTextInput
        style={style}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onChangeText={this.onChangeText}
        value={this.state.value}
        placeholder={this.props.placeholder}
        placeholderTextColor={colors.black}
        selectTextOnFocus={true}
        autoCapitalize={this.props.autoCapitalize || 'none'}
        autoCorrect={false}
        ref={'textInput'}
        editable={!this.props.disabled}
        focus={ this.props.focus }
        onKeyPress={ this.onKeyPress }
      />)
  }
};

reactMixin(AutoSuggestPicker.prototype, Subscribable.Mixin);

const select = (State, dispatch) => {
  let state = State.default;
  return {
    eventEmitter: state.uiEvents.eventEmitter,
    favourites: state.me.autoSuggestFavourites
  };
}

export default connect(select)(AutoSuggestPicker);
