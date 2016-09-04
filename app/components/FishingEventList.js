'use strict';
import{
  View,
  Text,
  ListView,
  Image
} from 'react-native';
import React from 'react';
import FishingEventActions from '../actions/FishingEventActions';
import Helper from '../utils/Helper';
import MasterListView from './common/MasterListView';
import Icon8 from './common/Icon8';

import {colors, listViewStyles, iconStyles, textStyles} from '../styles/styles';
import {IconButton} from './common/Buttons';

const fishingEventActions = new FishingEventActions();
const helper = new Helper();

class FishingEventList extends React.Component {
    constructor(props){
      super(props)
    }

    eventStatus(fishingEvent){
      if(!fishingEvent.datetimeAtEnd){
        return {icon: 'fishing',
                color: colors.blue}
      }
      if(fishingEvent.datetimeAtEnd && !fishingEvent.eventValid){
        return {icon: 'error',
                color: colors.orange}
      }
      if(!fishingEvent.commited){
        return {icon: 'ok',
                color: colors.green}
      }
      return {icon: 'cloud',
              color: colors.midGray};
    }

    getIcon(fishingEvent){
      let status = this.eventStatus(fishingEvent);
      return (<Icon8 name={status.icon} size={30} color="white"  style={[iconStyles, {backgroundColor: status.color}]}/>)
    }

    getDescription(fishingEvent, sectionID, rowID) {
      let tSpecies = (fishingEvent.targetSpecies || "").toUpperCase();
      const isSelected = this.isSelected(fishingEvent);
      let textStyle = isSelected ? textStyles.white : textStyles.black;
      let details = [
        {text: fishingEvent.id, style: [textStyle, listViewStyles.text, listViewStyles.detail, {marginLeft: 12}]},
        {text: fishingEvent.datetimeAtStart.format("HH:mm"),style: [textStyle, listViewStyles.detail, textStyles.listView]},
        {text: tSpecies, style: [textStyle, listViewStyles.detail, listViewStyles.text]}
      ];

      return details.map((detail, i) => {
        return (
        <View style={listViewStyles.listRowItemNarrow} key={"eventDetail" + i}>
          <Text style={[detail.style, textStyles.font, textStyles.listView]}>
            {detail.text}
          </Text>
        </View>);
      });
    }

    isSelected(fishingEvent){
      return this.props.selectedFishingEvent && (fishingEvent.id == this.props.selectedFishingEvent.id)
    }

    render () {
      return (
        <MasterListView
          getDescription={this.getDescription.bind(this)}
          isSelected={this.isSelected.bind(this)}
          onPress={this.props.onPress}
          dataSource={this.props.fishingEvents}
          getIcon={this.getIcon.bind(this)}
        />
      );
    }
};

export default FishingEventList;
