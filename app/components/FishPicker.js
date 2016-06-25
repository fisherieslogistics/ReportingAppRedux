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
        value: props.value || ""
      }
    }

    componentWillReceiveProps(props){
      this.setState({
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
            style={[styles.textInput]}
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
    borderBottomColor: '#b0b0b0',
    borderBottomWidth: 1,
    alignSelf: 'stretch',
    fontSize: 20,
    color: "#707070",
    flex: 1
  },
});

export default FishPicker;
