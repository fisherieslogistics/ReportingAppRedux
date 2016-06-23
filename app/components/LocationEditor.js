'use strict';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ListView,
  AlertIOS
} from 'react-native';

import React from 'react';
import inputStyle from '../styles/inputField';
import styles from '../styles/style';

class LocationEditor extends Component {

    constructor(){
      this.state = {
        lonDegrees: null,
        latDegrees: null,
        lonMinutes: null,
        latMinutes: null,
        latSeconds: null,
        lonSeconds: null
      }
    }

    onFinish (location) {

    }

    onChange(){
      
    }

    render () {
      return (
          <View>

          </View>
      );
    }

};

export default FishPicker;
