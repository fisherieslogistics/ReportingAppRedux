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
import speciesCodes from '../constants/speciesCodes.json';
import AutoSuggestBar from './AutoSuggestBar';
let codes = speciesCodes.map((s) => { return {value: s, description: s + " description"}});

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
      this.setState({
        value: text
      });
      this.setState({valid: (text.length === 3 || text.length === 0)});

      if((text.length === 3 && speciesCodes.indexOf(text) !== -1) || !text.length){
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
      return(
        <AutoSuggestBar
         choices={codes}
         favourites={["bco", "rco", "sna", "tar", "gur"]}
         maxResults={10}
         onChangeText={this.onChangeText.bind(this)}
      />);

    }
};

export default FishPicker;
