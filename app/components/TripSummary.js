'use strict';
import {
  View,
  Text,
  ScrollView,
  StyleSheet
} from 'react-native';
import React from 'react';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import {connect} from 'react-redux';
import Helper from '../utils/Helper';
const helper = new Helper();

class TripSummary extends React.Component {
    tripText(){
      let sailingTime = helper.timeAgo(this.props.trip.sailingTime);
      let unloadTime = helper.timeAgo(this.props.trip.ETA);
      return this.renderText([
        `Sailed from ${this.props.trip.portFrom} ${sailingTime}`,
        `Scheduled to unload to ${unloadTime} at ${this.props.trip.portTo}`
      ]);
    }

    welcomeText(){
      let optionsReady = (this.props.trip.portTo && this.props.trip.portFrom) ? true : false;
      return this.renderText([
        optionsReady ? `` : `Please select sailing and unload options`
      ]);
    }
    renderText(lines){
      return (
        <View style={styles.wrapper}>
          {lines.map((text, i) => {
            return (<View key={"tripSum"+i} style={styles.row}>
                      <Text style={styles.text}>{text}</Text>
                    </View>);
           })}
        </View>
      )
    }
    render() {
      return this.props.trip.started ? this.tripText() : this.welcomeText();
    }
};

const select = (State, dispatch) => {
    let state = State.default;
    return {
      trip: state.trip,
      user: state.me.user,
      vesselName: state.me.vessel.name
    };
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    flexWrap: 'nowrap'
  },
  row:{
    flexDirection: 'row'
  },
  text:{
    fontSize: 16,
    fontWeight: "500"
  }
});

module.exports = connect(select)(TripSummary);
