'use strict';
import {
  View,
  Text,
  AlertIOS,
  TouchableOpacity,
  Modal,
  TextInput,
  Dimensions,
  StyleSheet,
} from 'react-native';

import React from 'react';
import {inputStyles, textStyles, colors} from '../styles/styles';
import Sexagesimal from 'sexagesimal';
import moment from 'moment';
import {LongButton} from './common/Buttons';
import Helper from '../utils/Helper';
import FocusOnDemandTextInput from './common/FocusOnDemandTextInput';
import Icon8 from './common/Icon8';
import Icon from 'react-native-vector-icons/FontAwesome';
import { BlurView, VibrancyView } from 'react-native-blur';
import ModalLocationForm from './ModalLocationForm';
import CoordinateEditor from './CoordinateEditor';
import { TextButton } from './common/Buttons';

const helper = new Helper();

class LocationEditor extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      modalVisible: false
    }
  }

  renderLocation(){
    let posText = `${Sexagesimal.format(this.props.value.lat, 'lat')}  -  ${Sexagesimal.format(this.props.value.lon, 'lon')}`;
    return (
      <View style={{ flexDirection: 'row', flex: 1, alignItems: 'stretch'}}>
        <TouchableOpacity
          onPress={() => this.setState({modalVisible: true}) }
          style={{flexDirection: 'row', flex: 1 }}
        >
          <Icon name={ "pencil" }
                size={ 20 }
                color={ "black" }
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
    const latHemisphere = this.props.value.lat > 0 ? 'North' : 'South';
    const lonHemisphere = this.props.value.lon > 0 ? 'East' : 'West';
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
  inputsWrapper: {
    flex: 1,
    flexDirection: 'column',
  },
  inputGroup: {
    flex: 0.5,
    flexDirection: 'row',
  },
  formWrapper: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 20,
  },
  formControl: {
    flex: 1,
    paddingTop: 20,
    height: 40,
    alignSelf: 'stretch',
  },
  button: {
    marginTop: 30,
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default LocationEditor;
