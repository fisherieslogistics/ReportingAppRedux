'use strict';
import {
  StyleSheet,
  View,
  Text,
  AlertIOS,
  TouchableOpacity,
  DatePickerIOS,
  ListView,
  RecyclerViewBackedScrollView,
  TouchableHighlight
} from 'react-native';
import React from 'react';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import {connect} from 'react-redux';
import TripActions from '../actions/TripActions';
import Icon from 'react-native-vector-icons/FontAwesome';
import Helper from '../utils/Helper';
import TripSummary from './TripSummary';
import FishingSummary from './FishingSummary';
import Toolbar from './Toolbar';
import {incompleteFishingEvents} from '../utils/ModelErrors';
const helper = new Helper();
import FishingEventModel from '../models/FishingEventModel';
import TCERFishingEventModel from '../models/TCERFishingEventModel';
const fishingEventModel = [...FishingEventModel.concat(TCERFishingEventModel)];
const tripActions = new TripActions();

class TripEditor extends React.Component {
    constructor(props){
      super(props);
      if(!props.trip.sailingTime){
        setTimeout(() => {
          this.updateTrip('sailingTime', new moment());
          this.updateTrip('ETA', new moment().add(1, 'day'));
        });
      }
    }
    updateTrip(attribute, value){
      this.props.dispatch(tripActions.updateTrip(attribute, value));
    }
    getPortIcon(port, portType){
      if(portType == "portFrom"){
        return (port == this.props.trip[portType]) ? "check-circle" : "ship";
      }
      return (port == this.props.trip[portType]) ? "check-circle" : "truck";
    }
    getPortIconColor(port, portType){
      return (port == this.props.trip[portType]) ? '#6699ff' : "#ccc";
    }
    renderPortList(portType){
      return (<ListView
                enableEmptySections={true}
                style={{marginTop: 10}}
                dataSource={this.props.ds.cloneWithRows(this.props.ports)}
                renderRow={(port, sectionID, rowID) => this.renderRow(port, sectionID, rowID, portType)}
                renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
                renderSeparator={this.renderSeperator}
              />);
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
    renderRow (port, sectionID, rowID, portType) {
      if(port == "unknown"){
        return;
      }
      let listRowStyle = [styles.listRow];
      if (port == this.props.trip[portType]){
        listRowStyle.push(styles.selectedListRow);
      }
      return (<TouchableHighlight
                onPress={this.updateTrip.bind(this, portType, port)}
                style={styles.rowWrapper}
                underlayColor={"#2d74fa"}
                activeOpacity={0.3}>
                <View style={listRowStyle}>
                  <Text style={[styles.listRowItem, styles.listRowItemNarrow]}>
                    <Icon name={this.getPortIcon(port, portType)}
                          size={16}
                          color={this.getPortIconColor(port, portType)} />
                  </Text>
                  <Text style={[styles.listRowItem]}>
                    {port}
                  </Text>
                </View>
              </TouchableHighlight>);
    }
    renderDatepicker(attribute, value){
      return (<DatePicker
                style={{width: 200, marginTop: 20}}
                date={value}
                mode="datetime"
                format="YYYY-MM-DD HH:mm"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                onDateChange={(datetime) => {
                  this.updateTrip(attribute, new moment(datetime));
                }}
              />);
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
    renderEndTripButton(){
      return (
        <TouchableOpacity
          style={[styles.buttonWrapper]}
          >
          <View>
            <Icon.Button
              name={"anchor"}
              onPress={this.endTrip.bind(this)}
              style={[styles.toolbarButton, styles.endTripButton, {backgroundColor: "#2d74fa"}]}>
              <Text>Heading Home</Text>
            </Icon.Button>
          </View>
        </TouchableOpacity>);
    }
    renderLogoutButton(){
      return (
        <TouchableOpacity
          style={[styles.buttonWrapper]}
          >
          <View>
            <Icon.Button
              name={"stop-circle-o"}
              onPress={this.endTrip.bind(this)}
              style={[styles.toolbarButton, styles.endTripButton, {backgroundColor: "red"}]}>
              <Text>Logout</Text>
            </Icon.Button>
          </View>
        </TouchableOpacity>);
    }
    renderToolBar(){
      let primaryProps = {
        onPress: this.props.trip.started ? this.endTrip.bind(this) : this.startTrip.bind(this),
        iconName: 'anchor',
        color: this.props.trip.started ? this.getEndTripColor() : this.getStartTripColor(),
        text: this.props.trip.started ? "End Trip" : "Start Trip"
      };
      return (<Toolbar
                primaryButton={primaryProps}
                infoPanel={(<TripSummary />)}
              />);
    }
    render() {
      return (
        <View>
          <View style={[styles.row, styles.toolBarWrapper]}>
            {this.renderToolBar.bind(this)()}
          </View>
          <View style={styles.row}>
            <View style={[styles.col, styles.smallHalf]}>
              <View style={styles.titleWrapper}>
                <Text style={styles.title}>Sailing Time</Text>
              </View>
              {this.renderDatepicker("sailingTime", this.props.trip.sailingTime)}
              <View style={styles.portListWrapper}>
                <View style={styles.titleWrapper}>
                  <Text style={styles.title} >Sailing From</Text>
                </View>
                {this.renderPortList("portFrom")}
              </View>
            </View>
            <View style={[styles.col, styles.smallHalf]}>
              <View style={styles.titleWrapper}>
                <Text style={styles.title}>Unload Time est</Text>
              </View>
              {this.renderDatepicker("ETA", this.props.trip.ETA)}
              <View style={styles.portListWrapper}>
                <View style={styles.titleWrapper}>
                  <Text style={styles.title} >Unloading To</Text>
                </View>
                {this.renderPortList("portTo")}
              </View>
            </View>
            <View style={[styles.col, styles.smallHalf]}>
              <FishingSummary />
            </View>
          </View>
        </View>
        );
    }
};

const styles = StyleSheet.create({
  row:{
    flex: 1,
    flexDirection: 'row'
  },
  col: {
    flexDirection: 'column'
  },
  smallHalf: {
    flex: 0.33,
    padding: 20,
  },
  summaryWrapper:{

  },
  heading:{
    fontSize: 19,
    fontWeight: 'bold'
  },
  buttonWrapper: {
    marginRight: 15,
  },
  portListWrapper: {
    paddingTop: 10
  },
  listRowItemNarrow: {
    width: 35,
    flexDirection: 'column'
  },
  listRowItem:{
    flexDirection: 'column'
  },
  listRow: {
    flexDirection: 'row',
    paddingLeft: 20,
    paddingTop: 7,
    paddingBottom: 7,
    borderColor: '#ccc',
    borderRightWidth: 1,
    borderLeftWidth: 1
  },
  selectedListRow: {
    backgroundColor: '#eee',
  },
  titleWrapper: {
    paddingLeft: 4,
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  toolBarWrapper:{
    height: 60,
    padding: 5
  }
});

const select = (State, dispatch) => {
    let state = State.default;
    let incomplete = incompleteFishingEvents(state.fishingEvents.events, fishingEventModel).length;
    return {
      fishingEventsIncomplete: incomplete,
      trip: state.trip,
      ports: state.me.ports
    };
}

module.exports = connect(select)(TripEditor);
