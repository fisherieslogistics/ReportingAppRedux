'use strict';
import{
} from 'react-native';


import React from 'react';
import reactMixin from 'react-mixin';
import {connect} from 'react-redux';
/* eslint-disable */
import Subscribable from 'Subscribable';
/* eslint-enable */
import {inputStyles, colors} from '../../styles/styles';
import ViewActions from '../../actions/ViewActions';
import FocusOnDemandTextInput from './FocusOnDemandTextInput';

const viewActions = new ViewActions();

class AutoSuggestPicker extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      value: props.value ? props.value.toString() : "",
    }
    this.autoSuggestEmitted = this.autoSuggestEmitted.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  componentWillReceiveProps(nextProps){
    this.setState({
      value: nextProps.value,
    });
  }

  componentWillMount(){
    this.__mounted = true
    this.addListenerOn(this.props.eventEmitter,
                       'AutoSuggestResultPress',
                       this.autoSuggestEmitted);
  }

  autoSuggestEmitted(event){
    if(event.inputId === this.props.inputId){
      this.onBlur(null, event.value);
      this.refs.textInput.blur();
    }
  }

  onKeyPress(event) {
    if(event.nativeEvent.key === 'Enter' && this.props.onEnterPress){
      this.props.onEnterPress(event.nativeEvent, this.state.value);
    }
  }

  onFocus(){
    const userFavourites = this.props.favourites[this.props.attributeId];
    const favourites = userFavourites ? Object.keys(userFavourites).sort((k1, k2) => userFavourites[k1] - userFavourites[k2]) : [];
    this.props.dispatch(viewActions.initAutoSuggestBarChoices(this.props.choices,
                                                              [],
                                                              this.props.showAll ? "" : this.props.value,
                                                              this.props.inputId,
                                                              ));

    this.props.dispatch(viewActions.toggleAutoSuggestBar(true));
    this.props.handleFocus(this.props.inputId);
  }

  onBlur(event, eventValue){
    this.props.onChange(eventValue || this.state.value);
    this.props.dispatch(viewActions.toggleAutoSuggestBar(false));
    this.props.handleBlur(this.props.inputId);
  }

  componentWillUnmount(){
    this.props.dispatch(viewActions.toggleAutoSuggestBar(false));
  }

  onChangeText(text) {
    this.setState({
      value: text,
    });
    this.props.dispatch(viewActions.changeAutoSuggestBarText(this.props.showAll ? "" :  text, this.props.name));
  }

  render () {
    const style = [inputStyles.textInput, this.props.styles | {}];
    return(
      <FocusOnDemandTextInput
        style={style}
        onFocus={ this.onFocus }
        onBlur={ this.onBlur }
        onChangeText={this.onChangeText}
        value={ this.state.value }
        placeholder={this.props.placeholder}
        placeholderTextColor={colors.black}
        selectTextOnFocus
        autoCapitalize={this.props.autoCapitalize || 'none'}
        autoCorrect={false}
        ref={'textInput'}
        editable={ !this.props.disabled }
        isFocused={ this.props.isFocused }
        onKeyPress={ this.onKeyPress }
        maxLength={ this.props.maxLength || 900 }
      />)
  }
}

reactMixin(AutoSuggestPicker.prototype, Subscribable.Mixin);

const select = (State, dispatch) => {
  const state = State.default;
  return {
    eventEmitter: state.uiEvents.eventEmitter,
    favourites: state.me.autoSuggestFavourites
  };
}

export default connect(select)(AutoSuggestPicker);
