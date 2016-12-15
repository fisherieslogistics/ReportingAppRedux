'use strict';
import {
  View,
  ListView,
  Text,
  AlertIOS,
} from 'react-native';

import React from 'react';
import {connect} from 'react-redux';

import MasterDetailView from './layout/MasterDetailView';
import TripActions from '../actions/TripActions';
import Helper from '../utils/Helper';
import StartTripEditor from './StartTripEditor';
import TotalsList from './TotalsList';
import MasterListView from './common/MasterListView';
import AuthActions from '../actions/AuthActions';
import ProfileEditor from './ProfileEditor';
import { colors, listViewStyles, textStyles} from '../styles/styles';
import { MasterToolbar } from './layout/Toolbar';
import { BigButton } from './common/Buttons';

const helper = new Helper();
const tripActions = new TripActions();
const authActions = new AuthActions();
const masterChoices = [
  'Trip',
  'Totals',
  'Profile',
];
const iconNames = {
  Totals: 'fishing',
  Trip: 'fishing-boat-filled',
  Profile: 'user',
}
const style = {
  flex: 1,
  flexDirection: 'column',
  alignSelf: 'stretch',
  alignItems: 'center',
  padding: 4,
};
const textStyle = {
  marginTop: 2,
  fontSize: 20,
};
const wrapStyles = {
  flex: 1,
  flexDirection: 'row',
  marginTop: 30,
}

class Trip extends MasterDetailView {
  constructor (props){
    super(props);
    this.dsTotals = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id});
    this.dsTrips = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      pastTrips: {},
      selectedDetail: 'Trip',
      totals: [],
      icons: iconNames,
    };
    this.masterChoices = masterChoices;
  }

  onMasterButtonPress() {

  }

  renderMasterToolbar() {
    const backgroundColor = colors.backgrounds.blue;
    const text = "Chat";
    const textColor = colors.white;

    const button = (
      <BigButton
        text={text}
        backgroundColor={backgroundColor}
        textColor={textColor}
        onPress={this.onMasterButtonPress }
      />
    );
    return(
      <MasterToolbar
        center={ button }
      />
    );
  }

  renderDetailView() {
    return (
      <View />
    )
  }

}

const select = (State) => {
  const state = State.default;
  return {
    user: state.me.user,
  };
}

export default connect(select)(Trip);
