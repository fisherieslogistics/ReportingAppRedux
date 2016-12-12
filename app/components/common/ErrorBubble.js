'use strict';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import React, { Component } from 'react';
import Triangle from 'react-native-triangle';
import { errorBubbleStyles } from '../../styles/styles';

const styles = StyleSheet.create(errorBubbleStyles);

class ErrorBubble extends Component {

  shouldComponentUpdate(nextProps) {
    return this.props.isFocused !== nextProps.isFocused;
  }

  render(){
    const errKey = `error_${this.props.inputId}_error_`;
    if(!this.props.isFocused) {
      return (
        <View
          key={ errKey }
          style={ styles.errorDot }
        />
      );
    }

    const bubbleStyles = [styles.bubble, styles.shadow];
    const triangleStyles = [styles.shadow, styles.triangle1];

    return (
      <View key={ errKey } style={ bubbleStyles }>
        <Text style={ styles.labelError }>
          { this.props.attribute.valid.errorMessage }
        </Text>
        <Triangle
          width={16}
          height={12}
          color={ 'white' }
          direction={ 'down' }
          style={ triangleStyles }
        />
      </View>
    );
  }
}

export default ErrorBubble;
