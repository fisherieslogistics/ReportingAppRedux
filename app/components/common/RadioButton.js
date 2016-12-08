'use strict';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import React from 'react';
import { colors } from '../../styles/styles';
import Icon from 'react-native-vector-icons/FontAwesome';

const styles = StyleSheet.create({
  radioButton: {
    flex: 1,
    flexDirection: 'row',
    padding: 8,
    borderRadius: 5,
    borderColor: colors.blue,
    margin: 6,
  },
  radioButtonIcon: {
    alignSelf: 'flex-end',
    flex: 0.3,
  },
  radioButtonText: {
    fontSize: 18,
    color: colors.green,
    alignSelf: 'flex-start',
    flex: 0.7,
  },
});

function renderRadioButton(text, selected, onSelect, index) {
  const opacity = selected ? 1 : 0.7;
  const fontWeight = selected ? '700' : '100';
  const borderWidth = selected ? 2 : 1;
  const icon = (
    <Icon name={"check"}
          size={ 20 }
          color={ "green" }
          style={ [styles.radioButtonIcon, { opacity }] }
    />
  );
  return (
    <TouchableOpacity onPress={ onSelect }
                      key={ `${index}_${text}` }
                      style={ [styles.radioButton, { borderWidth }] }
    >
      <Text style={ [styles.radioButtonText, { fontWeight }]} >
        { text }
      </Text>
      { selected ? icon : null }
    </TouchableOpacity>
  );
}

export { renderRadioButton };
