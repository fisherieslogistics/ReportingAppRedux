'use strict';
import{
  View,
  Text,
  ListView,
  Image
} from 'react-native';
import React from 'react';
import FishingEventActions from '../actions/FishingEventActions';
const fishingEventActions = new FishingEventActions();
import Helper from '../utils/Helper';
import {findCombinedErrors, findErrors} from '../utils/ModelErrors';
import FishingEventModel from '../models/FishingEventModel';
import TCERFishingEventModel from '../models/TCERFishingEventModel';
const helper = new Helper();
import MasterListView from './MasterListView';

import {colors, listViewStyles, iconStyles, textStyles} from '../styles/styles';
import {IconButton} from './Buttons';

import {fishingBlue,
        fishingWhite,
        errorOrange,
        errorWhite,
        checkedGreen,
        checkedWhite,
        cloud,
        cloudWhite} from '../icons/PngIcon';

class FishingEventList extends React.Component {
    constructor(props){
      super(props)
    }

    eventStatus(fishingEvent){
      if(!fishingEvent.datetimeAtEnd){
        return {icon: fishingWhite,
                color: colors.blue}
      }
      if(fishingEvent.datetimeAtEnd && !fishingEvent.productsValid){
        return {icon: errorWhite,
                color: colors.orange}
      }
      if(!fishingEvent.commited){
        return {icon: checkedWhite,
                color: colors.green}
      }
      return {icon: cloudWhite,
              color: colors.midGray};
    }

    getIcon(fishingEvent){
      let status = this.eventStatus(fishingEvent);
      return (<View style={[iconStyles, {backgroundColor: status.color}]}>
                <Image source={status.icon} style={{}} />
              </View>)
    }

    getDescription(fishingEvent, sectionID, rowID) {
      let tSpecies = (fishingEvent.targetSpecies || "").toUpperCase();
      let textStyle = this.isSelected(fishingEvent) ? textStyles.white : textStyles.light;
      let details = [
        {text: fishingEvent.id, style: [textStyles.black, listViewStyles.text, listViewStyles.detail, {marginLeft: 12}]},
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
