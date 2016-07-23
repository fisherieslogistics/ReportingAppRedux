'use strict';
import {
  View,
  ListView,
  Text,
  AlertIOS,
  Image
} from 'react-native';

import React, { Component } from 'react';
import MasterDetailView from './MasterDetailView';
import TripActions from '../actions/TripActions';
import colors from '../styles/colors';
import {connect} from 'react-redux';
import Helper from '../utils/Helper';
import {MasterToolbar, DetailToolbar} from './Toolbar';
import TripEditor from './TripEditor';
import TotalsList from './TotalsList';
import textStyles from '../styles/text';
import BlankMessage from './BlankMessage';
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
    if(!this.props.trip.sailingTime){
      this.updateTrip("sailingTime", new moment());
    }
    if(!this.props.trip.ETA){
      this.updateTrip("ETA", new moment().add(2, 'day'));
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

      AlertIOS.prompt(
        "Unloading " + this.props.trip.ETA.fromNow() + " at " + this.props.trip.estimatedReturnPort,
        "Leave a message for the truck ? ie where to meet ? How much ice you need ? ",
        [
          {text: 'Cancel', onPress: (text) => { }, style: 'cancel'},
          {text: 'OK', onPress: (text) => {
            this.props.dispatch(tripActions.endTrip(this.props.trip,
                                                    this.props.fishingEvents,
                                                    this.props.vesselId,
                                                    text));
          }}
        ]
      );
    }
  }

  startTrip(){
    this.props.dispatch(tripActions.startTrip(this.props.vesselId));
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
    return (
      <MasterDetailView
        master={this.renderMasterView()}
        sizes={{m: 0.6, d: 0.4}}
        detailView={null}
        detailToolbar={<DetailToolbar style={toolbarStyle} />}
        masterToolbar={<MasterToolbar style={toolbarStyle} />}
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
