'use strict';
import{
  View,
  Text,
  TouchableHighlight,
  ListView,
  RecyclerViewBackedScrollView
} from 'react-native';
import React from 'react';
import FishingEventActions from '../actions/FishingEventActions';
const fishingEventActions = new FishingEventActions();
import Icon from 'react-native-vector-icons/FontAwesome';
import Helper from '../utils/Helper';
import {findCombinedErrors, findErrors} from '../utils/ModelErrors';
import FishingEventModel from '../models/FishingEventModel';
import TCERFishingEventModel from '../models/TCERFishingEventModel';
import colors from '../styles/colors.js';
const helper = new Helper();
import MasterListView from './MasterListView';
import styles from '../styles/listView';

const fishingEventDesc = {
  "started": {
    icon: "ship",
    color: colors.blue,
  },
  "startedActive": {
    icon: "ship",
    color: colors.white,
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
    constructor(props){
      super(props)
    }

    getFishingEventStatus(fishingEvent){
      if(!fishingEvent.datetimeAtEnd && this.props.selectedFishingEvent.id == fishingEvent.id){
        return "startedActive";
      }
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

    renderDescription(fishingEvent, sectionID, rowID) {
      let details = [
        {text: fishingEvent.id, style: styles.blackText},
        {text:fishingEvent.datetimeAtStart.format("HH:mm"),style: styles.darkText},
        {text:fishingEvent.targetSpecies || "", style: styles.darkText}
      ];

      return details.map((detail, i) => {
        return (
        <View style={styles.listRowItemNarrow} key={"eventDetail" + i}>
          <Text style={[detail.style]}>
            {detail.text}
          </Text>
        </View>);
      });
    }

    isSelected(fishingEvent){
      return (fishingEvent.id == this.props.selectedFishingEvent.id)
    }

    render () {
      return (
        <MasterListView
          renderDescription={this.renderDescription.bind(this)}
          isSelected={this.isSelected.bind(this)}
          onPress={this.props.onPress}
          dataSource={this.props.fishingEvents}
          getIcon={this.getIcon.bind(this)}
        />
      );
    }
};

export default FishingEventList;
