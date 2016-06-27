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

class FishPicker extends React.Component {

    constructor(props){
      super(props);
      this.state = {
        value: props.value || ""
      }
    }

    componentWillReceiveProps(props){
      this.setState({
        value: props.value
      })
    }

    onChangeText(text) {
      text = text.toLowerCase();
      this.props.onChangeText(text);
      this.setState({
        value: text
      });
      this.setState({valid: (text.length === 3 || text.length === 0)});
      if((text.length === 3 && speciesCodes.indexOf(text) !== -1) || !text.length){
        this.props.onChangeValue(text);
        return;
      }
      if(text.length == 3){
        AlertIOS.alert(text, "Invalid Species Code");
        this.setState({
          value: ""
        });
        return;
      }
    }

    render () {
      return(
        <TextInput
          style={[inputStyle.textInput]}
          onFocus={this.props.onFocus}
          onBlur={this.props.onBlur}
          onChangeText={this.onChangeText.bind(this)}
          value={this.state.value}
          maxLength={3}
          autoCapitalize={'none'}
          autoCorrect={false}
        />)

    }
};

export default FishPicker;
