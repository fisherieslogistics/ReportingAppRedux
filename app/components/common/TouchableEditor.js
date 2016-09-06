'use strict';
import {
  View,
  Text,
  Switch,
  AlertIOS,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, { Component } from 'react';

export default class TouchableEditor extends Component {

  constructor(props){
    super(props)
    this.onPress = this.onPress.bind(this);
  }

  onPress(){
    this.props.onPress();
  }

  render(){
    const styles = this.props.styles;
    return (
      <TouchableOpacity
        style={ this.props.wrapperStyle }
        key={ this.props.inputId }
        onPress={ this.onPress }
      >
          <View style={[styles.row, styles.labelRow]}>
            <Text style={styles.labelText}>
              { this.props.label }
            </Text>
            { this.props.errorView }
          </View>
          <View style={[styles.row, styles.editorRow]}>
            { this.props.input }
          </View>
      </TouchableOpacity>
    )
  }
}
