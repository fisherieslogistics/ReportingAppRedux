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
const helper = new Helper();
const Lang = Strings.english;

const fishingEventDesc = {
  "started": {
    icon: "ship",
    color: "#1b85b8",
    text: "in water"
  },
  "ended":{
    icon: "pause",
    color: "#FF9900",
    text: "onboard"
  },
  "readyToSync": {
    icon: "send-o",
    color: "#559e83",
    text: "uploading"
  },
  "done":{
    icon: "cloud",
    color: "#eaeaea",
    text: "uploaded"
  },
  "invalid": {
    icon: "exclamation-triangle",
    color: "#FF7878",
    text: "invalid"
  }
}

const fishingEventModel = FishingEventModel.concat(TCERFishingEventModel);

class FishingEventList extends React.Component {
    constructor(props){
      super(props);
      this.state={
        inputErrors: {}
      }
    }

    showfishingEventEditor(fishingEventId){
        this.props.dispatch(fishingEventActions.showfishingEventEditor(fishingEventId));
    }

    hidefishingEventEditor(){
        this.props.dispatch(fishingEventActions.hidefishingEventEditor());
    }

    setViewingFishingEvent(id){
      this.props.dispatch(fishingEventActions.setViewingFishingEvent(id));
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

    getErrors(fishingEvent){
      let errors = [];
      if(this.props.inputErrors){
        errors = errors.concat(findErrors(fishingEventModel, fishingEvent));
      }
      return errors;
    }

    onCatchClose(){
      this.props.dispatch(catchActions.closeCatchDetail());
    }
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
      return (<Icon name={status.icon} size={16} color={status.color} />);
    }

    renderRow (fishingEvent, sectionID, rowID) {
      let listRowStyle = [styles.listRow];
      if (fishingEvent.id == this.props.selectedId){
        listRowStyle.push(styles.selectedListRow);
      }
      return (
        <TouchableHighlight
          onPress={this.setViewingFishingEvent.bind(this, fishingEvent.id)}
          underlayColor={"#2d74fa"}
          activeOpacity={0.3}
        >
          <View style={listRowStyle}>
            <Text style={[styles.listRowItemNarrow]}>
              {this.getIcon(fishingEvent)}
            </Text>
            <Text style={[styles.listRowItem]}>
              {Lang.fishingEvents.tcer.numberOfInTrip + "  " + fishingEvent.id}
            </Text>
            <Text style={[styles.listRowItem]}>
              {fishingEvent.datetimeAtStart.format("HH:mm")}
            </Text>
            <Text style={[styles.listRowItem, {color: this.getFishingEventColor(fishingEvent)}]}>
              {this.getFishingEventDesc(fishingEvent)}
            </Text>
            <Text style={[styles.listRowItemCommitted, styles.listRowItemNarrow]}>
              {fishingEvent.targetsSpecies || Lang.fishingEvents.noTarget}
            </Text>
          </View>
        </TouchableHighlight>);
    }
    renderSeperator(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
      return (
        <View
          key={`${sectionID}-${rowID}`}
          style={{
            height: adjacentRowHighlighted ? 4 : 1,
            backgroundColor: adjacentRowHighlighted ? '#3B5998' : '#CCCCCC',
          }}
        />
      );
    }

    render () {
      return (
        <View style={{height: 600, paddingTop: 25, paddingLeft: 20}}>
          <ListView
            enableEmptySections={true}
            dataSource={this.props.fishingEvents}
            renderRow={this.renderRow.bind(this)}
            renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
            renderSeparator={this.renderSeperator}
          />
        </View>
      );
    }
};

const styles = StyleSheet.create({
  listRow: {
    flexDirection: 'row',
    paddingLeft: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderRightColor: '#ccc',
    borderRightWidth: 1,
  },

  invalid: {
    backgroundColor: '#FFB3BA'
  },

  selectedListRow: {
    backgroundColor: '#eee',
  },

  listRowItem: {
    paddingRight: 6,
    width: 70
  },
  listRowItemNarrow: {
    width: 20,
    paddingRight: 0
  }
});



export default FishingEventList;
