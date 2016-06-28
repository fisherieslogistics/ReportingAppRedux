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
        value: ""
      }
    }

    componentWillMount(){
      this.setState({
        value: this.props.value
      });
      this.addListenerOn(this.props.eventEmitter, 'AutoSuggestResultPress', this.autoSuggestEmitted.bind(this));
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
      this.props.dispatch(viewActions.initAutoSuggestBarChoices(speciesCodesDesc,
                                                                ["rco", "bco"],
                                                                this.props.value,
                                                                this.props.name));
      this.props.dispatch(viewActions.toggleAutoSuggestBar(true));
    }

    onBlur(){
      this.props.dispatch(viewActions.initAutoSuggestBarChoices([],
                                                                [],
                                                                "",
                                                                ""));
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
      eventEmitter: state.view.eventEmitter
    };
}

export default connect(select)(FishPicker);
