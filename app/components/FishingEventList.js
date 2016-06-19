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

const Lang = Strings.english;

class FishingEventList extends React.Component {
    constructor(props){
      super(props);
      this.state={
      }
    }

    showfishingEventEditor(fishingEventId){
        this.props.dispatch(fishingEventActions.showfishingEventEditor(fishingEventId));
    }

    hidefishingEventEditor(){
        this.props.dispatch(fishingEventActions.hidefishingEventEditor());
    }

    showCatchEditor(fishingEvent){
      this.setState({
        showCatchEditor: true,
        editingFishingEvent: fishingEvent
      });
    }

    hideCatchEditor(){
      this.setState({
        showCatchEditor: false
      });
    }

    onCatchClose(){
        this.props.dispatch(catchActions.closeCatchDetail());
    }
    getFishingEventColor(fishingEvent){
      if(fishingEvent.committed){
        return "#404040";
      }else if(fishingEvent.catchValid){
        return "#009933";
      }else if(fishingEvent.finished){
        return "#e68a00";
      }
      return '#6699ff';
    }
    getFishingEventDesc(fishingEvent){
      if(fishingEvent.committed){
        return Lang.fishingEvents.tcer.committed;
      }
      if(fishingEvent.catchValid){
        return Lang.fishingEvents.tcer.completed;
      }else if (fishingEvent.datetimeAtEnd) {
        return Lang.fishingEvents.tcer.ended;
      }else{
        return Lang.fishingEvents.tcer.started;
      }
    }

    renderRow (fishingEvent, sectionID, rowID) {
      if(!fishingEvent.datetimeAtStart){
        debugger;
      }
      return (<View style={[styles.listRow]}>
        <Text style={[styles.listRowItemCommitted, styles.listRowItemNarrow]}>
          <Icon name="cloud" size={16} color="gray" />
        </Text>
        <Text style={[styles.listRowItem, styles.listRowItemCommitted]}>
          {Lang.fishingEvents.tcer.numberOfInTrip + "  " + fishingEvent.id}
        </Text>
        <Text style={[styles.listRowItem, styles.listRowItemCommitted]}>
          {fishingEvent.datetimeAtStart.format("HH:mm")}
        </Text>
        <Text style={[styles.listRowItem, styles.listRowItemCommitted, {color: this.getFishingEventColor(fishingEvent)}]}>
          {this.getFishingEventDesc(fishingEvent)}
        </Text>
        <Text style={[styles.listRowItemCommitted, styles.listRowItemNarrow]}>{fishingEvent.targetsSpecies || Lang.fishingEvents.noTarget}</Text>
      </View>);
    }

    render () {
      return (
        <View style={{height: 600}}>
          <ListView
            enableEmptySections={true}
            dataSource={this.props.fishingEvents}
            renderRow={this.renderRow.bind(this)}
            renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
            renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} />}
          />
        </View>
      );
    }
};

const styles = {
  listRow: {
    flexDirection: 'row',
    paddingLeft: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderRightColor: '#ccc',
    borderRightWidth: 1,
  },

  listRowItem: {
    paddingRight: 6,
    width: 70
  },

  listRowItemCommitted: {
    color: 'gray'
  },
}



export default FishingEventList;
