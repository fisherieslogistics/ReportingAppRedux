'use strict';
import{
  StyleSheet,
  Text,
  View,
  TextInput,
  ListView,
  AlertIOS
} from 'react-native';

import Validator from '../utils/Validator';

import React from 'react';
import AutoSuggestBar from './common/AutoSuggestBar';
import {inputStyles} from '../styles/styles';
import speciesCodesDesc from '../constants/speciesDesc.json';
import ViewActions from '../actions/ViewActions';
import reactMixin from 'react-mixin';
import Subscribable from 'Subscribable';
import {connect} from 'react-redux';
import FocusOnDemandTextInput from './common/FocusOnDemandTextInput';

const viewActions = new ViewActions();

class FishPicker extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      value: "",
      fishingEventId: props.fishingEventId,
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
    if(this.state.fishingEventId !== props.fishingEvent.id || this.state.changedByEvent){
      this.setState({
        value: props.value
      });
    }
    this.setState({
      changedByEvent: false
    });
    this.setState({
      fishingEventId: props.fishingEvent.id
    });
  }

  autoSuggestEmitted(event){
    console.log(event.inputId == this.props.inputId, event.inputId, this.props.inputId)
    if(event.inputId == this.props.inputId){
      this.setState({
        changedByEvent: true,
        value: event.value
      });
      this.props.onEnterPress(this.props.name);
      setTimeout(this.onBlur);
    }
  }

  onFocus(){
    let userFavourites = this.props.favourites[this.props.name];
    let favourites = userFavourites ? Object.keys(userFavourites).sort((k1, k2) => {
      return userFavourites[k1] - userFavourites[k2];
    }) : [];
    this.props.dispatch(viewActions.initAutoSuggestBarChoices(speciesCodesDesc,
                                                              favourites,
                                                              this.props.value,
                                                              this.props.name,
                                                              this.props.inputId));
    this.props.dispatch(viewActions.toggleAutoSuggestBar(true));
    this.props.editingCallback(this.props.name);
  }

  onBlur(){
    this.props.onChange(this.state.value);
    this.props.dispatch(viewActions.toggleAutoSuggestBar(false));
    this.props.editingCallback();
  }

  componentWillUnmount(){
    this.props.dispatch(viewActions.toggleAutoSuggestBar(false));
    this.props.editingCallback();
  }

  onChangeText(text) {
    text = text.toLowerCase();
    this.setState({
      value: text
    });
    this.props.dispatch(viewActions.changeAutoSuggestBarText(text, this.props.name));
  }

  onKeyPress(event) {
    if(event.nativeEvent.key === 'Enter' && this.props.onEnterPress){
      this.props.onEnterPress(this.props.name);
    }
  }

  render () {
    return(
      <FocusOnDemandTextInput
        style={[inputStyles.textInput]}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onChangeText={this.onChangeText}
        value={this.state.value}
        maxLength={3}
        selectTextOnFocus={true}
        autoCapitalize={'none'}
        autoCorrect={false}
        onKeyPress={this.onKeyPress}
        ref={'textInput'}
        focus={ this.props.focus }
      />)

  }
};

reactMixin(FishPicker.prototype, Subscribable.Mixin);

const select = (State, dispatch) => {
    let state = State.default;
    return {
      eventEmitter: state.uiEvents.eventEmitter,
      favourites: state.me.autoSuggestFavourites
    };
}

export default connect(select)(FishPicker);
