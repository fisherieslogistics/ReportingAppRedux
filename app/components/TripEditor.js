'use strict';
import {
  StyleSheet,
  View,
  Text,
  AlertIOS,
  TouchableOpacity,
} from 'react-native';

import React from 'react';
import moment from 'moment';
import TripActions from '../actions/TripActions';
import Helper from '../utils/Helper';
import colors from '../styles/colors';
import textStyles from '../styles/text';
const helper = new Helper();
const tripActions = new TripActions();

class TripEditor extends React.Component {

    renderPortList(portType){
    }

    renderDatepicker(attribute, value){

    }

    endTrip(){
      if(this.props.fishingEventsIncomplete == 0){
        this.props.dispatch(tripActions.endTrip());
      }else{
        AlertIOS.alert("end trip", "Please complete or cancel " +
                                   this.props.fishingEventsIncomplete +
                                   " shots first");
      }
    }
    startTrip(){
      if(this.props.trip.portTo && this.props.trip.portFrom){
        this.props.dispatch(tripActions.startTrip());
      }else{
        AlertIOS.alert("start trip", "Please select ports first");
      }
    }
    getStartTripColor(){
      if(this.props.trip.portTo && this.props.trip.portFrom){
        return "green";
      }else{
        return "gray";
      }
    }
    getEndTripColor(){
      if(this.props.fishingEventsIncomplete > 0){
        return "gray"
      }else{
        return "#2d74fa";
      }
    }
    renderTripButtons(){
      return (
        <View>
        <TouchableOpacity
          style={[styles.buttonWrapper]}
          >
          <View>
            <Text style={[textStyles.font]}>
              {"Start Trip"}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buttonWrapper]}
          >
          <View>
            <Text style={[textStyles.font]}>
              {"Return to port"}
            </Text>
          </View>
        </TouchableOpacity>
      </View>);
    }

    render() {
      return (
        <View style={[styles.row]}>
          <View style={[styles.editor]}>
            <TouchableOpacity>
              <View style={[styles.button, , styles.buttonInActive]}>
                <Text style={[textStyles.font]}>Start Trip</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <View style={[styles.button, styles.buttonActive]}>
                <Text style={[textStyles.font]}>Return to Port</Text>
              </View>
            </TouchableOpacity>
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
  wrapper: {

  },
  buttonInActive:{
    borderColor: colors.midGray,
    borderWidth: 1,
  },
  buttonActive:{
    backgroundColor: colors.blue,
  },
  button:{
    flexDirection: 'column',
    width: 100,
    height: 30,
    borderRadius: 4,
  }
});

module.exports = TripEditor;
