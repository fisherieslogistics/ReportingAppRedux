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
    let dateStyle = [textStyles.font];


  return (
    <View style={[styles.halfway, styles.placeAndTime]}>
      <View style={{left: -22,}}>
        <View>
           <Text style={{color: colors.blue}}>
            {timeType === 'sailingTime'? 'Start Time' : 'Estimated Return Time'}
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
            {timeType === 'sailingTime'? 'Start Port' : 'End Port'}
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

    renderMessage(){
      let message = this.props.trip.started ?
                      "Trip started" : (this.props.tripCanStart ?
                        "Ready to start trip" :  "Select ports and times before starting trip");
      return (
        <View style={{padding: 10}}>
        <Text style={{ color: colors.blue}}>Trip Status:</Text>
        <Text style={{ fontSize: 20, paddingTop: 4}}>{message}</Text>
          </View>
      );
    }

    renderAddPort(){
      let pickerItems = [];
      let items = this.state.regions.map((region, index) => {
        return (
          <PickerItemIOS
            key={"region_" + region}
            value={region}
            label={region}
          />
        )
      });
      return (
        <View style={[{backgroundColor: "white", marginTop: 50,
                      flex: 1, alignSelf: 'stretch'}]}>
          <View>
            <View><Text style={[textStyles.font, {color: colors.blue }]}>Region</Text></View>
          </View>
          <View style={[]}>
            <PickerIOS
              style={[{backgroundColor: "#ffffff"}]}
              selectedValue={this.state.selectedRegion}
              onValueChange={(region) => {
                this.setState({selectedRegion: region});
              }}
            >
              {items}
            </PickerIOS>
            <Text style={[textStyles.font, {color: colors.blue }]}>Port</Text>
            <TextInput
              selectTextOnFocus={true}
              placeholder={"Port Name"}
              autoCorrect={false}
              autoCapitalize={'none'}
              value={this.state.newPortName}
              style={inputStyles.textInput, {backgroundColor: 'white', height: 50, alignSelf: 'stretch'}}
              onChangeText={(text) => {
                this.setState({
                  newPortName: text
                })
              }}
            />
          <LongButton
            text={"Save Port"}
            bgColor={colors.blue}
            _style={{alignSelf: 'center', marginTop: 20}}
            onPress={() => {
              AlertIOS.alert(
                "Add: " + this.state.newPortName + " to " + this.state.selectedRegion,
                "Is this correct? Click OK to save this port.",
                [
                  {text: 'Cancel', onPress: () => {
                    this.setState({
                      newPortName: "",
                      showAddPort: false
                    });
                  }, style: 'cancel'},
                  {text: 'OK', onPress: () => {
                    let portName = this.state.newPortName ? this.state.newPortName : "";
                    let choices = this.state.portChoices;
                    if(portName.length){
                      choices.push({value: portName, description: this.state.selectedRegion});
                      this.props.dispatch(userActions.addPort(this.state.selectedRegion,
                                          this.state.portName));
                    }
                    this.setState({
                      newPortName: "",
                      showAddPort: false,
                      portChoices: choices
                    });
                  }}
                ]
              );
            }}
          />
        </View>
      </View>);
    }

    render() {
      let LANDSCAPE = (this.props.orientation.indexOf("LANDSCAPE") !== -1);
      return (
        <View style={[styles.wrapper]}>
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
                choices={this.state.portChoices}
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
                text={"Return To Port"}
                bgColor={this.props.tripCanEnd ? colors.blue : colors.midGray}
                onPress={this.endTrip.bind(this)}
                disabled={!this.props.tripCanEnd}
              />
              <Text style={{textAlign: 'center'}}>
                {this.props.trip.started && (!this.props.tripCanEnd) ? "Complete all shots and sign all forms before ending trip" : ""}
              </Text>
            </View>
          </View>
          <View style={[styles.bottomRow, {alignItems: 'center', padding: 10, marginTop: 20}]}>
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
          {this.state.showAddPort ? this.renderAddPort() : this.renderMessage()}
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
