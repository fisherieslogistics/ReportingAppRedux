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
import AutoSuggestBar from './AutoSuggestBar';
import inputStyle from '../styles/inputStyle';
import speciesCodes from '../constants/speciesCodes.json';
import ViewActions from '../actions/ViewActions';
import reactMixin from 'react-mixin';
import Subscribable from 'Subscribable';
import {connect} from 'react-redux';

const viewActions = new ViewActions();
const speciesCodesDesc = speciesCodes.map((s) => {
  return {value: s, description: s + " Description " + s};
});

class FishPicker extends React.Component {

    constructor(props){
      super(props);
      this.state = {
        value: "",
        fishingEventId: props.fishingEventId
      }
    }

    componentWillMount(){
      this.setState({
        value: this.props.value
      });
      this.addListenerOn(this.props.eventEmitter,
                         'AutoSuggestResultPress',
                         this.autoSuggestEmitted.bind(this));
    }

    componentWillReceiveProps(props){
      if(this.state.fishingEventId !== props.fishingEvent.id){
        this.setState({
          value: props.value
        });
      }
      this.setState({
        fishingEventId: props.fishingEvent.id
      });
    }

    autoSuggestEmitted(event){
      if(event.name == event.name){
        this.props.onChange(event.value);
        setTimeout(() => {
          this.setState({
            value: this.props.value
          });
        });
        if(this.refs.textInput){
          this.refs.textInput.blur();
        }
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
                                                                this.props.name));
      this.props.dispatch(viewActions.toggleAutoSuggestBar(true));
    }

    onBlur(){
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
      if((text.length === 3 && speciesCodes.indexOf(text) !== -1) || !text.length){
        this.props.onChange(text);
        return;
      }
      if(text.length == 3){
        AlertIOS.alert(text, "Invalid Species Code");
        this.setState({
          value: ""
        });
        this.props.dispatch(viewActions.changeAutoSuggestBarText("", this.props.name));
        return;
      }
    }

    render () {
      return(
        <TextInput
          style={[inputStyle.textInput]}
          onFocus={this.onFocus.bind(this)}
          onBlur={this.onBlur.bind(this)}
          onChangeText={this.onChangeText.bind(this)}
          value={this.state.value}
          maxLength={3}
          autoCapitalize={'none'}
          autoCorrect={false}
          ref={'textInput'}
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
