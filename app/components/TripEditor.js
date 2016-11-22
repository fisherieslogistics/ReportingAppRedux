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

const viewActions = new ViewActions();
const userActions = new UserActions();
const helper = new Helper();
const tripActions = new TripActions();
const PickerItemIOS = PickerIOS.Item;


const PlaceAndTime = ({portType, timeType, port, time, onChangePort, onChangeTime, disabled, choices}) => {
  time = time || new moment(new Date().getTime());
  let placeTimeStyle = StyleSheet.create({
    wrapper:{
      backgroundColor: colors.pastelGreen,
      flex: 0.5,
      alignItems: 'flex-start',
      paddingLeft: 5
    },
  });
  let dateAttr = TripModel.find((a) => a.id == timeType);
  let dateProps = {
    customStyles: {
      dateIcon: {
        height: 0,
        opacity: 0
      },
      dateInput:{
        borderWidth: 0,
        opacity: 0,
        flexDirection: 'row',
        flex: 1,
      },
    },
    disabled: false
  };
    let dateStyle = [textStyles.font];


  return (
    <View style={[styles.halfway, styles.placeAndTime]}>
      <View style={{left: -22,}}>
        <View>
           <Text style={{color: colors.blue}}>
            {timeType === 'startDate'? 'Start Time' : 'Estimated Return Time'}
          </Text>
            <Text style={[textStyles.font, {fontSize: 16}]}>{!time || isNaN(time.unix()) ? "  " : time.format("DD MMM HH:mm") }</Text>
            <Text style={[dateStyle, {color: colors.darkGray, fontSize: 12, top: 2}]}>{ (!time || isNaN(time.unix()) ) ? "Select date" : time.fromNow() }</Text>
        </View>
       <View style={{ position: 'absolute', top: 14, borderBottomWidth: 1, borderColor: colors.gray}}>
        {AttributeEditor({
          attribute: dateAttr,
          value: time,
          onChange: onChangeTime,
          extraProps: dateProps
        }, () => { console.warn('This should store that we are editing a field')})}
        </View>
      </View>
      <View style={[{width: 120, left: 13, marginTop: 20, marginBottom: 10, borderBottomWidth: 1, borderColor: colors.gray }]}>
             <Text style={{color: colors.blue}}>
            {timeType === 'startDate'? 'Start Port' : 'End Port'}
          </Text>
        <PortPicker
          name={portType + "__picker"}
          choices={choices}
          portType={portType}
          value={port || ""}
          placeholder={"Select a port"}
          textStyle={{color: colors.black}}
          style={{borderBottomWidth: 1, borderColor: colors.midGray }}
          onChange={(value) => onChangePort(portType, value)}
          inputId={"TripEditor__" + portType}
          disabled={false}
        />
      </View>
    </View>);
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
      this.props.dispatch(tripActions.updateTrip(id, value, this.props.trip.started));
    }

    onChangeTime(id, value){
      this.props.dispatch(tripActions.updateTrip(id, value, this.props.trip.started));
    }

    render() {
      let LANDSCAPE = (this.props.orientation.indexOf("LANDSCAPE") !== -1);
      return (
        <View style={[styles.wrapper]}>
          <View style={[styles.row, styles.bottomRow]}>
            <View style={[styles.halfway]}>
              <PlaceAndTime
                portType={"startPort"}
                timeType={"startDate"}
                port={this.props.trip.startPort}
                time={this.props.trip.startDate}
                onChangePort={this.onChangePort.bind(this)}
                onChangeTime={this.onChangeTime.bind(this)}
                disabled={this.props.trip.started}
                choices={this.state.portChoices}
              />
            </View>
            <View style={[styles.halfway]}>
              <PlaceAndTime
                portType={"endPort"}
                timeType={"endDate"}
                port={this.props.trip.endPort}
                time={this.props.trip.endDate}
                onChangePort={this.onChangePort.bind(this)}
                onChangeTime={this.onChangeTime.bind(this)}
                disabled={false}
                choices={this.state.portChoices}
              />
            </View>
          </View>
          <View style={[styles.row, styles.topRow]}>
            <View style={[styles.halfway]}>
              <LongButton
                text={"Start Trip"}
                bgColor={colors.blue}
                onPress={this.startTrip.bind(this)}
                disabled={!this.props.tripCanStart}
              />
            </View>
            <View style={[styles.halfway]}>
              <LongButton
                text={"End Trip"}
                bgColor={this.props.tripCanEnd ? colors.blue : colors.midGray}
                onPress={this.endTrip.bind(this)}
                disabled={!this.props.tripCanEnd}
              />
            </View>
          </View>
          <View style={[styles.bottomRow, {alignItems: 'center', padding: 10, marginTop: 20}]}>
          </View>
        </View>
      );
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
