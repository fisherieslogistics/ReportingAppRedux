'use strict';
import {
  View,
  ListView,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';

import React from 'react';
import MasterDetailView from './layout/MasterDetailView';
import TripActions from '../actions/TripActions';

import { darkColors as colors, listViewStyles, iconStyles, textStyles} from '../styles/styles';
import Icon8 from '../components/common/Icon8';

import {connect} from 'react-redux';
import Helper from '../utils/Helper';
import { MasterToolbar, DetailToolbar } from './layout/Toolbar';
import StartTripEditor from './StartTripEditor';
import TotalsList from './TotalsList';
import MasterListView from './common/MasterListView';
import moment from 'moment';


//let user add a new port if the port is not there
//let the user know why they cant start or end trip

const helper = new Helper();
const tripActions = new TripActions();
const masterListChoices = [
  'Trip',
  'Totals',
];
const iconNames = {
  'Totals': 'fishing',
  'Trip': 'fishing-boat-filled',
}
const myListViewStyles = StyleSheet.create(listViewStyles);

class Trip extends React.Component {
  constructor (props){
    super(props);
    this.state = {
      dsTotals: new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id}),
      dsPage: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2 }),
      dsTrips: new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2 }),
      pastTrips: {},
      selectedDetail: 'Trip',
      totals: [],
    };
    if(!props.trip.startDate){
      this.updateTrip("startDate", new moment());
    }
    this.startTrip = this.startTrip.bind(this);
    this.endTrip = this.endTrip.bind(this);
    this.renderMasterListView = this.renderMasterListView.bind(this);
    this.getMasterDescription = this.getMasterDescription.bind(this);
    this.isDetailSelected = this.isDetailSelected.bind(this);
    this.masterListOnPress = this.masterListOnPress.bind(this);
    this.renderMasterIcon = this.renderMasterIcon.bind(this);
    this.renderTotalsListView = this.renderTotalsListView.bind(this);
    this.renderDetailView = this.renderDetailView.bind(this);
    this.renderTripsList = this.renderTripsList.bind(this);
    this.tripsListOnPress = this.tripsListOnPress.bind(this);
    this.isTripSelected = this.isTripSelected.bind(this);
    this.getTripDescription = this.getTripDescription.bind(this);
  }

  updateTrip(attribute, value){
    this.props.dispatch(tripActions.updateTrip(attribute, value, this.props.trip.started));
  }

  tripsListOnPress(trip){
    const change = {};
    const id = trip.objectId;
    change[id] = this.state.pastTrips[id] ? false : trip;
    const trips = Object.assign({}, this.state.pastTrips, change);
    let products = [];
    Object.keys(trips).forEach((k) => {
      const pt = trips[k];
      if(pt){
        pt.fishingEvents.forEach(fe => {
          products = products.concat(fe.products);
        });
      }
    });
    const totals = helper.getTotals(products);
    this.setState({
      totals: [{ code: 'Species Code', weight: 'Total KG' }, ...totals],
      pastTrips: trips,
    });
  }

  renderTotalsListView(){
    const wrapStyles = {
      flex: 1,
      flexDirection: 'row',
      marginTop: 30,
    }
    const data = this.state.dsTotals.cloneWithRows(this.state.totals);
    return (
      <View style={ wrapStyles }>
        <TotalsList
          data={ data }
          selectedTotal={ this.props.selectedTotal}
          onPress={ this.totalSelected }
          isSelected={ this.isSelected }
        />
      </View>
    );
  }

  getMasterDescription(choice) {
    const textColor = this.isDetailSelected(choice) ? colors.white : colors.black;
    const myStyles = [
      textStyles.font,
      { color: textColor, fontSize: 18 },
    ];
    const viewStyles = { marginLeft: 2, alignItems: 'flex-start', paddingTop: 5};
    return (
      <View
        style={ [myListViewStyles.listRowItem, viewStyles] }
        key={`${choice}___Trip_Page` }>
        <Text style={ myStyles }>
          { choice }
        </Text>
      </View>
    );
  }

  renderMasterIcon(detailName){
    const isSelected = this.isDetailSelected(detailName);
    let backgroundStyle = { backgroundColor: colors.blue, color: colors.white };
    if(isSelected){
      backgroundStyle = { backgroundColor: colors.white, color: colors.blue };
    }
    return (
      <Icon8
        name={iconNames[detailName]}
        size={30}
        color="white"
        style={[iconStyles, backgroundStyle]}
      />
    );
  }

  masterListOnPress(choice) {
    this.setState({
      selectedDetail: choice,
    });
  }

  isDetailSelected(choice) {
    return choice === this.state.selectedDetail
  }

  renderMasterListView() {
    return (
      <MasterListView
        getDescription={ this.getMasterDescription }
        isSelected={ this.isDetailSelected }
        onPress={ this.masterListOnPress }
        dataSource={ this.state.dsPage.cloneWithRows(masterListChoices) }
        getIcon={ this.renderMasterIcon }
      />
    );
  }

  startTrip(){
    this.props.dispatch(tripActions.startTrip(this.props.vesselId));
    this.props.startTripCallback();
  }

  endTrip(){
    this.props.dispatch(tripActions.endTrip(
      this.props.trip,
      this.props.fishingEvents,
      this.props.vesselId,
      "",
    ));
  }

  renderMessage(){
    const messages = [];
    let color = colors.green;

    if(this.props.tripCanStart){
      messages.push("Ready to go press Start Trip");
    } else if (this.props.tripCanEnd) {
      messages.push("Press End Trip when heading in");
    } else if (this.props.trip.started){

      color = colors.orange;

      messages.push("Trip Incomplete");
      if(this.props.incompleteShots) {
        messages.push(`${this.props.incompleteShots} Shots to complete & sign`);
      } else if(!this.props.allSigned) {
        messages.push("Please sign all Forms");
      }
    } else {
      color = colors.orange;
      messages.push("Select ports and ETA before starting trip");
    }

    const style = {
      flex: 1,
      flexDirection: 'column',
      alignSelf: 'stretch',
      alignItems: 'center',
      padding: 4,
    };
    const textStyle = {
      color,
      marginTop: 5,
      fontSize: 20,
    };
    const msgs = messages.map(m => (
      <Text style={textStyle} key={m}>
        {m}
      </Text>
    ));
    return (
      <View style={[style]}>
        { msgs }
      </View>
    )
  }

  getTripDescription(trip, sectionId, rowId) {
    const isSelected = this.isTripSelected(trip);
    const textColor = isSelected ? colors.white : colors.black;
    const myStyles = [
      textStyles.font,
      { color: textColor, fontSize: 14 },
    ];
    const viewStyles = { alignItems: 'flex-start', paddingTop: 0};
    const parts = [
      `${trip.startPort}`,
      `Sail ${trip.startDate.format('DD/MM/YY')}`,
      `${trip.endPort}`,
      `Unload ${trip.endDate.format('DD/MM/YY')}`,
    ];
    return parts.map((p, i) => (
        <View
          style={ [myListViewStyles.listRowItem, viewStyles] }
          key={ `${rowId}_Trip_${sectionId}_list_${i}` }>
          <Text style={ myStyles }>
            { p }
          </Text>
        </View>
      ));
  }

  isTripSelected(trip) {
    return !!this.state.pastTrips[trip.objectId];
  }

  renderTripsList(){
    const trips = [...this.props.history.pastTrips];
    const currentTrip = helper.getHistoryTrip(
      Object.assign(this.props.trip, { fishingEvents: this.props.fishingEvents }));
    const allTrips = [currentTrip, ...trips.reverse()].filter(pt => !!pt.fishingEvents);
    return (
      <View style={{flex: 1}}>
        <MasterListView
          getDescription={ this.getTripDescription }
          isSelected={ this.isTripSelected }
          onPress={ this.tripsListOnPress }
          dataSource={ this.state.dsPage.cloneWithRows(allTrips) }
          getIcon={ null }
        />
      </View>
    );
  }

  renderLowerList(){
    switch (this.state.selectedDetail) {
      case 'Trip':
        return this.renderMessage();
      case 'Totals':
        return this.renderTripsList();
      default:
        break;
    }
  }

  renderMasterView(){
    const outerStyle = {padding: 0, margin: 0, flexDirection: 'column', flex: 1, alignItems: 'flex-start' };
    const innerStyle = { padding: 0, margin: 0, flexDirection: 'row', flex: 0.2 };
    const midStyle = { flex: 0.8, alignItems: 'flex-start' };

    const masterListView = this.renderMasterListView();
    const lowerList = this.renderLowerList();
    return (
      <View style={[outerStyle]}>
        <View style={[innerStyle]}>
          { masterListView }
        </View>
        <View style={[innerStyle, midStyle]}>
          { lowerList }
        </View>
      </View>
    );
  }

  getMasterToolbar() {
    let onPress = () => {};
    let backgroundColor = colors.black;
    let text = "Start Trip";
    let textColor = 'rgba(255, 255, 255, 0.2)';

    if(this.props.tripCanStart) {
      onPress = this.startTrip
      backgroundColor = colors.green;
      textColor = colors.white;
    }
    if(this.props.tripCanEnd) {
      onPress = this.endTrip
      backgroundColor = colors.red;
      textColor = colors.white;
      text = "End Trip";
    }

    const buttonStyle = { flex: 1, flexDirection: 'column', alignItems: 'center', backgroundColor, alignSelf: 'stretch'};
    const innerViewStyle = {alignItems: 'center'}
    const textStyle = { fontSize: 30, fontWeight: '500', color: textColor, textAlign: 'center', marginTop: 20 };
    const eventButton = (
      <TouchableOpacity onPress={onPress} style={[buttonStyle]}>
         <View style={ innerViewStyle }>
          <Text style={ textStyle }>
            { text }
          </Text>
        </View>
      </TouchableOpacity>
    );
    return(
      <MasterToolbar
        center={eventButton}
      />
    );
  }

  renderDetailView(){
    switch (this.state.selectedDetail) {
      case 'Trip':
        return (
          <StartTripEditor
            trip={this.props.trip}
            dispatch={this.props.dispatch}
          />
        );
      case 'Totals':
        return this.renderTotalsListView()
      default:
    }
  }

  render(){
    const toolbarStyle = {flex: 1,  alignSelf: 'stretch', backgroundColor: colors.black };
    const detailToolbar = (<DetailToolbar style={toolbarStyle} />);
    const masterToolbar = this.getMasterToolbar();
    return (
      <MasterDetailView
        master={ this.renderMasterView() }
        detail={ this.renderDetailView() }
        detailToolbar={detailToolbar}
        masterToolbar={masterToolbar}
      />
    );
  }
}

const select = (State) => {
  const state = State.default;
  const allSigned = !state.fishingEvents.events.find(f => !f.signature);
  const incompleteShots = state.fishingEvents.events.filter(f => !(f.eventValid && f.productsValid)).length;
  return {
    fishingEvents: state.fishingEvents.events,
    height: state.view.height,
    user: state.me.user,
    trip: state.trip,
    ports: state.me.ports,
    tripStarted: state.trip.started,
    tripCanStart: helper.tripCanStart(state.trip),
    tripCanEnd: state.trip.started &&  allSigned && (incompleteShots === 0),
    allSigned,
    incompleteShots,
    orientation: state.view.orientation,
    vesselId: state.me.vessel.id,
    history: state.history,
  };
}

export default connect(select)(Trip);
