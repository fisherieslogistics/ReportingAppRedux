'use strict';
import {
  StyleSheet,
  View,
  Text,
  AlertIOS,
  TouchableOpacity,
  TextInput,
  PickerIOS,
} from 'react-native';

import React from 'react';
import moment from 'moment';
import TripActions from '../actions/TripActions';
import TripModel from '../models/TripModel';
import Helper from '../utils/Helper';
import colors from '../styles/colors';
import {textStyles, inputStyles} from '../styles/styles';
import {LongButton} from './common/Buttons';
import {AttributeEditor} from './common/AttributeEditor';
import PortPicker from './PortPicker';
import UserActions from '../actions/UserActions';
import PlaceholderMessage from './common/PlaceholderMessage';
import ViewActions from '../actions/ViewActions';
import StartTripEditor from './StartTripEditor';

const viewActions = new ViewActions();
const userActions = new UserActions();
const helper = new Helper();
const tripActions = new TripActions();
const PickerItemIOS = PickerIOS.Item;

const PlaceAndTime = ({portType, timeType, port, time, onChangePort, onChangeTime, disabled, choices}) => {

}

class TripEditor extends React.Component {

    constructor(props){
      super(props);
      let regions = Object.keys(this.props.ports);

      this.state = {
        showAddPort: false,
        regions: regions,
        selectedRegion: regions[0],
        newPortName: "",
        portChoices: this.getPortChoices(props),
      }
      this.onChangePort = this.onChangePort.bind(this);
      this.onChangeTime = this.onChangeTime.bind(this);
      this.startTrip = this.startTrip.bind(this);
      this.endTrip = this.endTrip.bind(this);
    }

    getPortChoices(props){
      const choices = [];
      Object.keys(props.ports).map((k) => {
        return props.ports[k].forEach((p) => {
          choices.push({value:p, description: k, render: () => {
            return {value: k, description: p};
          }});
        });
      });
      return choices;
    }

    renderStartTrip() {
      return (
        <StartTripEditor
          trip={this.props.trip}
          onChangePort={this.onChangePort}
          onChangeTime={this.onChangeTime}
          ports={this.state.portChoices}
        />
      );
    }

    renderEndTrip() {
      <EndTripEditor
        trip={this.props.trip.startPort}
        time={this.props.trip.startDate}
        onChangePort={this.onChangePort}
        onChangeTime={this.onChangeTime}
        choices={this.state.portChoices}
      />
    }

    endTrip(){
      if(this.props.tripCanEnd){
        this.props.endTrip();
      }
    }

    startTrip(){
      if(this.props.tripCanStart){
        this.props.startTrip();
      }
    }

    onChangePort(id, value){
      this.props.dispatch(tripActions.updateTrip(id, value));
    }

    onChangeTime(id, value){
      this.props.dispatch(tripActions.updateTrip(id, value));
    }

    renderTripEditor(){
      return this.renderStartTrip();
      if(this.props.tripCanEnd){
        return this.renderEndTrip();
      }
      return this.renderStartTrip();
    }

    renderStartTripButton() {
      /*</View>
      <View style={[styles.bottomRow, { padding: 10}]}>
        <LongButton
          text={ this.props.tripCanStart ? "Start Trip" : "End Trip" }
          bgColor={ colors.blue }
          onPress={ this.props.tripCanStart ? this.startTrip : this.endTrip }
          disabled={ !(this.props.tripCanStart || this.props.tripCanEnd) }
        />
      </View>
      </View>*/
    }

    render() {
      return this.renderTripEditor()
    }
};

const styles = StyleSheet.create({
  row:{
    flexDirection: 'row'
  },
  col: {
    flexDirection: 'column'
  },
  topRow: {
    alignSelf: 'stretch',
    paddingTop: 20,
    height: 300,
  },
  borderBottom: {
    borderBottomWidth: 0.4,
    borderColor: colors.midGray
  },
  bottomRow: {
    paddingTop: 15,
    alignItems: 'flex-start',
  },
  wrapper: {
    flex: 1,
    paddingLeft: 5,
    paddingRight: 5,
    alignSelf: 'stretch',
    backgroundColor: 'white',
    borderBottomWidth: 0.3,
    borderColor: colors.darkGray
  },
  placeAndTime:{
    width: 160,
  },
  halfway:{
    flex: 0.5,
    alignItems: 'center'
  }
});

module.exports = TripEditor;
