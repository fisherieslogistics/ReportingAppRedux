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
import species_codes from '../constants/speciesCodes.json';

class FishPicker extends React.Component {

    constructor(props){
      super(props);
      this.state = {
        valid: true,
        value: props.value || ""
      }
    }

    componentWillReceiveProps(props){
      this.setState({
        valid: Validator.valid.productCode.func(props.value),
        value: props.value
      })
    }

    onTyping (text) {
      text = text.toLowerCase();
      this.setState({
        value: text
      });
      this.setState({valid: (text.length === 3 || text.length === 0)});

      if((text.length === 3 && species_codes.indexOf(text) !== -1) || !text.length){
        this.props.onChange(text);
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
      return (
          <TextInput
            style={[styles.textInput, this.props.style || {}, this.state.valid ? {} : styles.invalid]}
            onChangeText={this.onTyping.bind(this)}
            value={this.state.value}
            maxLength={3}
            autoCapitalize={'none'}
            autoCorrect={false}/>
      );
    }
};

const styles = StyleSheet.create({
  textInput: {
    borderColor: 'gray',
    borderWidth: 1,
    height: 30,
    width: 80,
    paddingLeft: 10,
  },
  invalid: {
    backgroundColor: '#FFB3BA'
  },
});

export default FishPicker;
