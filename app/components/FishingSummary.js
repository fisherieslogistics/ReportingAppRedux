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

class FishingSummary extends React.Component {
    renderFishing(){
      if(!this.props.fishingEvents.length){
        return this.renderText(["Not Fishing"]);
      }
      let firstEvent = this.props.fishingEvents[0];
      let lastEvent = this.props.fishingEvents[this.props.fishingEvents.length -1];
      let inProgress = lastEvent.datetimeAtEnd ? false : true;
      let targetSpecies = helper.mostCommon(this.props.fishingEvents, 'targetSpecies');
      return this.renderText([
        `Targeting ${targetSpecies || "?"}`,
        `Started fishing ${helper.timeAgo(firstEvent.datetimeAtStart)}`,
        `Total of ${this.props.fishingEvents.length} Shots`,
        inProgress ? `Shot the gear ${helper.timeAgo(lastEvent.datetimeAtStart)}` :
                     `Gear was hauled ${helper.timeAgo(lastEvent.datetimeAtEnd)}`,
      ]);
    }
    renderTotals(){
      let totals = helper.getTotals(helper.concatArrays(this.props.fishingEvents.map(f => f.products)));
      return this.renderText(totals.map(t => ` ${t.code} - ${t.weight} kg`));
    }
    renderText(lines){
      return (
        <View>
          {lines.map((text, i) => {
            return (<View key={"tripSum"+i} style={styles.textRow}>
                      <Text style={[textStyles.font, styles.text]}>{text}</Text>
                    </View>);
           })}
        </View>
      )
    }
    renderSummary(){
      return (
        <View>
          <View style={styles.subTitleWrapper}>
            <Text style={[textStyles.font, styles.subTitle]}>Fishing</Text>
          </View>
          {this.renderFishing()}
          <View style={styles.subTitleWrapper}>
            <Text style={[textStyles.font, styles.subTitle]}>Totals</Text>
          </View>
          <ScrollView>
          { this.props.trip.started ? this.renderTotals() : null}
          </ScrollView>
        </View>);
    }
    render() {
      return (
        <View style={[styles.tableViewWide]}>
          <View style={styles.tableWrapper}>
            {this.renderSummary.bind(this)()}
          </View>
        </View>
        );
    }
};

const select = (State, dispatch) => {
    let state = State.default;
    return {
      trip: state.trip,
      fishingEvents: state.fishingEvents.events,
      user: state.me.user,
      vesselName: state.me.vessel.name
    };
}

const styles = StyleSheet.create({
  titleWrapper: {
    paddingLeft: 20,
    marginTop: 20,
  },
  subTitleWrapper: {
    paddingLeft: 20,
    marginTop: 5,
    paddingBottom: 5,
  },
  subTitle:{
    fontSize: 19,
    fontWeight: '600'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  tableWrapper: {
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    flexDirection:'row',
  },
  tableViewWide: {
    marginTop: 20,
    flexDirection: 'column'
  },
  textWrapper: {
    paddingBottom: 5,
    paddingTop: 9,
    marginTop: 10
  },
  textRow: {
    paddingLeft: 20,
    height: 30,
  },
  text:{
    fontSize: 16,
    fontWeight: "400"
  }
});

module.exports = connect(select)(FishingSummary);
