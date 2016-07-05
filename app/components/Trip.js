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
import {addToKeyStore, addToQueue} from '../actions/SyncActions';

const helper = new Helper();
const tripActions = new TripActions();

class Profile extends React.Component{
  constructor (props){
    super(props);
    this.state = {
      ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id}),
    };
  }
  updateTrip(attribute, value){
    this.props.dispatch(tripActions.updateTrip(attribute, value));
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
        "Unloading " + this.props.trip.ETA.fromNow() + " at " + this.props.trip.portTo,
        "Leave a message for the truck ? ie where to meet ? How much ice you need ? ",
        [
          {text: 'Cancel', onPress: (text) => { }, style: 'cancel'},
          {text: 'OK', onPress: (text) => {
            let trip = Object.assign({}, this.props.trip);
            let fEvents = [...this.props.fishingEvents.events];
            this.props.dispatch(addToQueue("pastTrips", trip));
            fEvents.forEach(f => this.props.dispatch(addToQueue("pastFishingEvents", f));
            this.props.dispatch(tripActions.endTrip(text, this.props.fishingEvents.events))},
          }
        ]
      );
    }
  }

  startTrip(){
    this.props.dispatch(tripActions.startTrip());
    this.props.dispatch(addToKeyStore("trip", this.props.trip.guid));
  }

  renderDetail(){

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
        />
        <View style={{flexDirection: 'row',
                      flex: 1,
                      height: 50,
                      alignItems: 'flex-end',
                      paddingLeft: 10,
                      paddingBottom: 5}}>

          <Text style={[textStyles.font, textStyles.midLabel2]}>Totals</Text>
        </View>
        <TotalsList
          onPress={() => {}}
          data={this.state.ds.cloneWithRows(this.props.totals)}
          getIcon={() => null}
        />
      </View>
    );
  }

  render(){
    let toolbarStyle = {height: 20, flex: 0, backgroundColor: colors.backgrounds.dark};
    return (
      <MasterDetailView
        master={this.renderMasterView()}
        detailView={
          <View style={[]}>
            <View style={[]}>
              {this.renderDetail()}
            </View>
          </View>}
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
  console.log(state.trip.started && (state.fishingEvents.events.find(f => !f.productsValid) === undefined));
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
    tripCanEnd: state.trip.started && (state.fishingEvents.events.find(f => !f.productsValid) === undefined)
  };
}

export default connect(select)(Profile);
