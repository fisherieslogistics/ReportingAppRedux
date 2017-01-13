'use strict';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import React from 'react';
import {inputStyles, colors } from '../styles/styles';
import Sexagesimal from 'sexagesimal';
import Icon from 'react-native-vector-icons/FontAwesome';
import ModalLocationForm from './ModalLocationForm';

class LocationEditor extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      modalVisible: false
    }
  }

  renderLocation(){
    const posText = `${Sexagesimal.format(this.props.value.lat, 'lat')}  -  ${Sexagesimal.format(this.props.value.lon, 'lon')}`;
    return (
      <View style={ [styles.wrapper] }>
        <TouchableOpacity
          onPress={() => this.setState({modalVisible: true}) }
          style={{flexDirection: 'row', flex: 1 }}
        >
          <Icon name={ "pencil" }
                size={ 20 }
                color={ colors.lightBlue }
                style={{ marginTop: 8, left: -24 }}
          />
          <Text style={ [inputStyles.textInput, {fontSize: 18, left: -18}] }>
            { posText }
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  render(){
    return (
      <View>
        { this.state.modalVisible ? null : this.renderLocation() }
        <ModalLocationForm
          visible={ this.state.modalVisible }
          onRequestClose={ () => this.setState({modalVisible: false}) }
          location={ this.props.value }
          onChange={ this.props.onChange }
          attribute={ this.props.attribute }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'stretch',
  },
});

export default LocationEditor;
