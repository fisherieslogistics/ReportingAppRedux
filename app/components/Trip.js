'use strict';
import {
  View,
  ListView,
  Text,
  AlertIOS,
  Image
} from 'react-native';

import React, { Component } from 'react';
import MasterDetailView from './layout/MasterDetailView';
import TripActions from '../actions/TripActions';
import colors from '../styles/colors';
import {connect} from 'react-redux';
import Helper from '../utils/Helper';
import {MasterToolbar, DetailToolbar} from './layout/Toolbar';
import TripEditor from './TripEditor';
import TotalsList from './TotalsList';
import textStyles from '../styles/text';
import PlaceholderMessage from './common/PlaceholderMessage';
import moment from 'moment';

//let user add a new port if the port is not there
//let the user know why they cant start or end trip

const helper = new Helper();
const tripActions = new TripActions();

class Trip extends React.Component{
  constructor (props){
    super(props);
    this.state = {
      ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id}),
    };
  }

  componentDidMount(){
    if(!this.props.trip.startDate){
      this.updateTrip("startDate", new moment());
    }
    if(!this.props.trip.endDate){
      this.updateTrip("endDate", new moment().add(2, 'day'));
    }
  }

  updateTrip(attribute, value){
    this.props.dispatch(tripActions.updateTrip(attribute, value, false));
  }

  totalSelected(total, rowId){

  }

  isSelected(){

  }

  renderListView(){
    return (<TotalsList
              data={this.state.ds.cloneWithRows(this.props.totals)}
              selectedTotal={this.props.selectedTotal}
              onPress={this.totalSelected}
              isSelected={this.isSelected.bind(this)}
            />);
  }

  endTrip(){
    if(this.props.tripCanEnd){

      AlertIOS.alert(
        "Unloading " + this.props.trip.endDate.fromNow() + " at " + this.props.trip.endPort,
        "Confirm ?",
        [
          {text: 'Cancel', onPress: () => { }, style: 'cancel'},
          {text: 'OK', onPress: () => {
            this.props.dispatch(tripActions.endTrip(this.props.trip,
                                                    this.props.fishingEvents,
                                                    this.props.vesselId,
                                                    ""));
          }}
        ]
      );
    }
  }

  startTrip(){
    this.props.dispatch(tripActions.startTrip(this.props.vesselId));
    this.props.startTripCallback();
  }

  renderMessage(){
    let message = "";
    if(this.props.trip.started){
      message = this.props.tripCanEnd ? "Trip started - OK To End Trip" : "Complete all shots and sign all forms before ending trip";
    }else {
      message = this.props.tripCanStart ? "Ready to start trip" :  "Select ports and times before starting trip";
    }
    return (
      <PlaceholderMessage text={message} height={this.props.height } />
    );
  }

  renderDetailView(){
    return (
      <View style={[{padding: 0, flexDirection: 'column', flex: 1 }]}>
        <View style={[{flexDirection: 'row', flex: 1}]}>
          { this.renderMessage() }
        </View>
      </View>
    );
  }

  renderMasterView(){
    return (
      <View style={{top: 0, left: 0}}>
        <TripEditor
          trip={this.props.trip}
          dispatch={this.props.dispatch}
          tripCanStart={this.props.tripCanStart}
          tripCanEnd={this.props.tripCanEnd}
          endTrip={this.endTrip.bind(this)}
          ports={this.props.ports}
          startTrip={this.startTrip.bind(this)}
          orientation={this.props.orientation}
        />
        <View style={{flexDirection: 'row',
                      flex: 1,
                      height: 50,
                      alignItems: 'flex-end',
                      paddingLeft: 10,
                      paddingBottom: 5}}>
        </View>
      </View>
    );
  }

  render(){
    let toolbarStyle = {height: 20, flex: 0, backgroundColor: colors.backgrounds.dark};
    const detailToolbar = (<DetailToolbar style={toolbarStyle} />);
    const masterToolbar = (<MasterToolbar style={toolbarStyle} />);
    return (
      <MasterDetailView
        master={ this.renderMasterView() }
        sizes={{m: 0.6, d: 0.4}}
        detail={ this.renderDetailView() }
        detailToolbar={detailToolbar}
        masterToolbar={masterToolbar}
      />
    );
  }
};

const select = (State, dispatch) => {
  let state = State.default;
  let allProducts = state.fishingEvents.events.map(fe => fe.products);
  let totals = helper.getTotals([].concat.apply(allProducts));
  return {
    fishingEvents: state.fishingEvents.events,
    height: state.view.height,
    user: state.me.user,
    trip: state.trip,
    totals: Object.keys(totals).map((t) => {
      return {code: t, weight: totals[t]};
    }),
    ports: state.me.ports,
    tripStarted: state.trip.started,
    tripCanStart: helper.tripCanStart(state.trip),
    tripCanEnd: state.trip.started && (state.fishingEvents.events.find(f => !f.signature) === undefined),
    orientation: state.view.orientation,
    vesselId: state.me.vessel.id
  };
}

export default connect(select)(Trip);
