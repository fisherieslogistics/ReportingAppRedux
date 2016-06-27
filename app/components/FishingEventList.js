'use strict';
import{
  StyleSheet,
  View,
  Text,
  TouchableHighlight,
  ListView,
  RecyclerViewBackedScrollView
} from 'react-native';
import React from 'react';
import {connect} from 'react-redux';
import FishingEventActions from '../actions/FishingEventActions';
const fishingEventActions = new FishingEventActions();
import Strings from '../constants/Strings.js';
import Icon from 'react-native-vector-icons/FontAwesome';
import Helper from '../utils/Helper';
import Validator from '../utils/Validator';
import {findCombinedErrors, findErrors} from '../utils/ModelErrors';
import FishingEventModel from '../models/FishingEventModel';
import TCERFishingEventModel from '../models/TCERFishingEventModel';
import colors from '../styles/colors.js';
const helper = new Helper();
const Lang = Strings.english;


const fishingEventDesc = {
  "started": {
    icon: "ship",
    color: colors.blue,
  },
  "ended":{
    icon: "exclamation-triangle",
    color: colors.orange,
  },
  "readyToSync": {
    icon: "check-circle-o",
    color: colors.green
  },
  "done":{
    icon: "cloud",
    color: colors.gray
  },
}

class FishingEventList extends React.Component {

    getFishingEventColor(fishingEvent){
      return fishingEventDesc[this.getFishingEventStatus(fishingEvent)].color;
    }

    getFishingEventDesc(fishingEvent){
      return fishingEventDesc[this.getFishingEventStatus(fishingEvent)].text;
    }

    getFishingEventStatus(fishingEvent){
      if(!fishingEvent.datetimeAtEnd){
        return "started";
      }
      if(fishingEvent.datetimeAtEnd && !fishingEvent.productsValid){
        return "ended";
      }
      if(helper.needsSync(fishingEvent)){
        return "readyToSync";
      }
      return "done"
    }

    getIcon(fishingEvent){
      let status = fishingEventDesc[this.getFishingEventStatus(fishingEvent)];
      return (<Icon name={status.icon} size={20} color={status.color} />);
    }

    renderRow (fishingEvent, sectionID, rowID) {
      return (
        <TouchableHighlight
          onPress={() => {
            this.setState({
              selectedSectionID: sectionID
            });
            this.props.onPress(fishingEvent);
          }}
          underlayColor={colors.blue}
          activeOpacity={0.3}
        >
          <View style={styles.listRow}>
            <Text style={[styles.listRowItemTiny]}>
            </Text>
            <Text style={[styles.listRowItemNarrow]}>
              {this.getIcon(fishingEvent)}
            </Text>
            <Text style={[styles.listRowItem, styles.listItemText]}>
              {Lang.fishingEvents.tcer.numberOfInTrip + "  " + fishingEvent.id}
            </Text>
            <Text style={[styles.listRowItem, styles.listItemText]}>
              {fishingEvent.datetimeAtStart.format("HH:mm")}
            </Text>
            <Text style={[styles.listRowItem]}>
              {fishingEvent.targetsSpecies}
            </Text>
          </View>
        </TouchableHighlight>);
    }
    renderSeperator(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
      return (
        <View
          key={`${sectionID}-${rowID}`}
          style={{
            height: 1,
            backgroundColor: colors.midGray,
          }}
        />
      );
    }

    render () {
      return (
          <ListView
            style={[styles.listView]}
            enableEmptySections={true}
            dataSource={this.props.fishingEvents}
            renderRow={this.renderRow.bind(this)}
            renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
            renderSeparator={this.renderSeperator}
          />
      );
    }
};

const styles = StyleSheet.create({
  listRow: {
    flexDirection: 'row',
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: colors.white
  },
  selectedListRow: {
    backgroundColor: colors.blue,
  },
  listRowItem: {
    flex: 0.5
  },
  listRowItemNarrow: {
    flex: 0.25,
  },
  listRowItemTiny:{
    flex: 0.1,
  },
  listItemText: {
    fontSize: 19,
    color: colors.midGray
  },
  listView:{
    marginTop: -20
  }
});

export default FishingEventList;
