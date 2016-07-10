'use strict';
import {
  StyleSheet,
  View,
  Text,
  AlertIOS,
  TouchableOpacity,
  TextInput,
  PickerIOS,
  PickerItemIOS
} from 'react-native';

import React from 'react';
import moment from 'moment';
import TripActions from '../actions/TripActions';
import TripModel from '../models/TripModel';
import Helper from '../utils/Helper';
import colors from '../styles/colors';
import {textStyles, inputStyles} from '../styles/styles';
import {LongButton} from './Buttons';
import {AttributeEditor} from './AttributeEditor';
import PortPicker from './PortPicker';
import UserActions from '../actions/UserActions';

const userActions = new UserActions();
const helper = new Helper();
const tripActions = new TripActions();


const PlaceAndTime = ({portType, timeType, port, time, onChangePort, onChangeTime, disabled}) => {
  time = time || new moment();
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
  let dateStyle = [textStyles.font, {position: 'absolute', top: 12, left: 5, fontSize: 16, color: colors.black}];
  let dateText = (
    <Text style={dateStyle}>
      { (!time || isNaN(time.unix()) ) ? "Select date" : time.fromNow() }
    </Text>
  );

  return (
    <View style={[styles.halfway, styles.placeAndTime]}>
      <View style={[]}>
        {dateText}
        {AttributeEditor(dateAttr, time, onChangeTime, dateProps)}
      </View>
      <View style={[{width: 160, left: 13}]}>
        <PortPicker
          name={portType + "__picker"}
          portType={portType}
          value={port || ""}
          placeholder={"Select a port"}
          textStyle={{color: disabled ? colors.darkGray : colors.black}}
          style={{borderBottomWidth: 1, borderColor: colors.midGray }}
          onChange={(value) => onChangePort(portType, value)}
          inputId={"TripEditor__" + portType}
          disabled={false}
        />
      </View>
    </View>
  );
}

class TripEditor extends React.Component {

    constructor(props){
      super(props);
      let regions = Object.keys(this.props.ports);
      this.state = {
        showAddPort: false,
        regions: regions,
        selectedRegion: regions[0],
        newPortName: ""
      }
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

    renderAddPort(){
      let items = this.state.regions.map((region, index) => {
        return (
          <PickerItemIOS
            key={this.state.regions[index]}
            value={region}
            label={region}
          />
        )
      });
      return (
        <View>
          <View><Text>Select a Region</Text></View>
          <PickerIOS
            selectedValue={this.state.selectedRegion}
            onValueChange={(region) => {
              this.setState({selectedRegion: region});
            }}
          >
            {items}
          </PickerIOS>
          <TextInput
            selectTextOnFocus={true}
            placeholderText={"Port Name"}
            value={this.state.newPortName}
            style={inputStyles.textInput}
            onChangeText={(text) => {
              this.setState({
                newPortName: text
              })
            }}
          />

          <LongButton
            text={"Save Port"}
            bgColor={colors.blue}
            onPress={() => {
              AlertIOS()
              AlertIOS.alert(
                "Add to port: " + this.state.newPortName + " to " + this.state.selectedRegion,
                "Is this correct? Click OK to save this port.",
                [
                  {text: 'Cancel', onPress: () => { }, style: 'cancel'},
                  {text: 'OK', onPress: () => {
                    this.props.dispatch(userActions.addPort(this.state.selectedRegion, this.state.newPortName));
                  }}
                ]
              );
            }}
          />
        </View>);
    }

    render() {
      let LANDSCAPE = (this.props.orientation.indexOf("LANDSCAPE") !== -1);
      return (
        <View style={[styles.wrapper]}>
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
                text={"Return To Port"}
                bgColor={this.props.tripCanEnd ? colors.blue : colors.midGray}
                onPress={this.endTrip.bind(this)}
                disabled={!this.props.tripCanEnd}
                _style={{borderLeftWidth: LANDSCAPE ? 1 : 0 }}
              />
            </View>
          </View>
          <View style={[styles.row, styles.bottomRow]}>
            <View style={[styles.halfway]}>
              <PlaceAndTime
                portType={"leavingPort"}
                timeType={"sailingTime"}
                port={this.props.trip.leavingPort}
                time={this.props.trip.sailingTime}
                onChangePort={this.onChangePort.bind(this)}
                onChangeTime={this.onChangeTime.bind(this)}
                disabled={this.props.trip.started}
              />
            </View>
            <View style={[styles.halfway]}>
              <PlaceAndTime
                portType={"estimatedReturnPort"}
                timeType={"ETA"}
                port={this.props.trip.estimatedReturnPort}
                time={this.props.trip.ETA}
                onChangePort={this.onChangePort.bind(this)}
                onChangeTime={this.onChangeTime.bind(this)}
                disabled={false}
              />
            </View>
          </View>
          <View style={[styles.bottomRow, {flex: 1, alignItems: 'center', padding: 10}]}>
            <LongButton
              text={"Add New Port"}
              bgColor={colors.blue}
              onPress={() => {
                this.setState({
                  showAddPort: true
                });
              }}
            />
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
    height: 50,
    paddingTop: 20
  },
  borderBottom: {
    borderBottomWidth: 0.4,
    borderColor: colors.midGray
  },
  bottomRow: {
    height: 100,
    paddingTop: 15,
    alignItems: 'flex-start',
  },
  wrapper: {
    height: 220,
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
