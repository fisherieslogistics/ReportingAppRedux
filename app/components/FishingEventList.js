'use strict';
import{
  View,
  Text,
} from 'react-native';
import React from 'react';
import MasterListView from './common/MasterListView';
import Icon8 from './common/Icon8';

import { darkColors as colors, listViewStyles, iconStyles, textStyles} from '../styles/styles';

class FishingEventList extends React.Component {
    constructor(props){
      super(props);
      this.getDescription = this.getDescription.bind(this);
      this.isSelected = this.isSelected.bind(this);
      this.getIcon = this.getIcon.bind(this);
    }

    eventStatus(fishingEvent){
      if(!fishingEvent.datetimeAtEnd){
        return {icon: 'fishing',
                color: colors.blue}
      }
      if(fishingEvent.datetimeAtEnd && !(fishingEvent.eventValid && fishingEvent.productsValid)){
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
      const status = this.eventStatus(fishingEvent);
      return (
        <Icon8
          name={status.icon}
          size={30}
          color="white"
          style={[iconStyles, {backgroundColor: status.color}]}
        />
      );
    }

    getDescription(fishingEvent) {
      const tSpecies = (fishingEvent.targetSpecies || "").toUpperCase();
      const isSelected = this.isSelected(fishingEvent);
      const textStyle = isSelected ? textStyles.white : textStyles.black;
      const details = [
        {text: fishingEvent.id, style: [textStyle, listViewStyles.text, listViewStyles.detail, {marginLeft: 12}]},
        {text: fishingEvent.datetimeAtStart.format("HH:mm"),style: [textStyle, listViewStyles.detail, textStyles.listView]},
        {text: tSpecies, style: [textStyle, listViewStyles.detail, listViewStyles.text]}
      ];

      return details.map((detail, i) => (
        <View style={listViewStyles.listRowItemNarrow} key={"eventDetail" + i}>
          <Text style={[detail.style, textStyles.font, textStyles.listView]}>
            {detail.text}
          </Text>
        </View>));
    }

    isSelected(fishingEvent){
      return this.props.selectedFishingEvent && (fishingEvent.id === this.props.selectedFishingEvent.id)
    }

    render () {
      return (
        <MasterListView
          getDescription={this.getDescription}
          isSelected={this.isSelected}
          onPress={this.props.onPress}
          dataSource={this.props.fishingEvents}
          getIcon={this.getIcon}
        />
      );
    }
}

export default FishingEventList;
