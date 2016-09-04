'use strict';
import{
  StyleSheet,
  Text,
  View,
  TextInput,
} from 'react-native';

import Validator from '../utils/Validator';

import React from 'react';
import AutoSuggestBar from './common/AutoSuggestBar';
import {inputStyles, textStyles} from '../styles/styles';
import ViewActions from '../actions/ViewActions';
import reactMixin from 'react-mixin';
import Subscribable from 'Subscribable';
import {connect} from 'react-redux';
import colors from '../styles/colors';

const viewActions = new ViewActions();

class PortPicker extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      value: "",
      portType: props.portType,
      changedByEvent: false,
      error: false
    }
  }

  componentWillMount(){
    this.__mounted = true;
    this.setState({
      value: this.props.value
    });
    this.addListenerOn(this.props.eventEmitter,
                       'AutoSuggestResultPress',
                       this.autoSuggestEmitted.bind(this));
  }

  componentWillReceiveProps(props){
    if(this.state.portType !== props.portType || this.state.changedByEvent){
      this.setState({
        value: props.value
      });
    }
    this.setState({
      changedByEvent: false
    });
    this.setState({
      portType: props.portType
    });
  }

  autoSuggestEmitted(event){
    if(event.inputId == this.props.inputId){
      this.setState({
        changedByEvent: true,
        value: event.value
      });
      setTimeout(() => {
        this.forceUpdate();
        if(this.refs.textInput){
          this.refs.textInput.blur();
        }
      });
    }
  }

  onFocus(){
    let userFavourites = this.props.favourites[this.props.name];
    let favourites = userFavourites ? Object.keys(userFavourites).sort((k1, k2) => {
      return userFavourites[k1] - userFavourites[k2];
    }) : [];
    this.props.dispatch(viewActions.initAutoSuggestBarChoices(this.props.choices,
                                                              favourites,
                                                              this.props.value,
                                                              this.props.name,
                                                              this.props.inputId));
    this.props.dispatch(viewActions.toggleAutoSuggestBar(true));
  }

  onBlur(event){
    this.props.onChange(this.state.value);
    this.props.dispatch(viewActions.toggleAutoSuggestBar(false));
  }

  componentWillUnmount(){
    this.props.dispatch(viewActions.toggleAutoSuggestBar(false));
  }

  onChangeText(text) {
    text = text.toLowerCase();
    this.setState({
      value: text
    });
    this.props.dispatch(viewActions.changeAutoSuggestBarText(text, this.props.name));
  }

  render () {
    let style = [{fontSize: 16, flex: 1, height: 30, color: colors.black},
                  textStyles.font, this.props.textStyle];
    return(
      <TextInput
        style={style}
        onFocus={this.onFocus.bind(this)}
        onBlur={this.onBlur.bind(this)}
        onChangeText={this.onChangeText.bind(this)}
        value={this.state.value}
        placeholder={this.props.placeholder}
        placeholderTextColor={colors.black}
        selectTextOnFocus={true}
        autoCapitalize={'none'}
        autoCorrect={false}
        ref={'textInput'}
        editable={!this.props.disabled}
      />)
  }
};

reactMixin(PortPicker.prototype, Subscribable.Mixin);

const select = (State, dispatch) => {
  let state = State.default;
  return {
    eventEmitter: state.uiEvents.eventEmitter,
    favourites: state.me.autoSuggestFavourites
  };
}

export default connect(select)(PortPicker);
