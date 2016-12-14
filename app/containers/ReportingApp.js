'use strict';
import {
  View,
  TabBarIOS,
} from 'react-native';
import React, { Component } from 'react';
import Fishing from '../components/Fishing';
import FormView from '../components/FormView';
import {connect} from 'react-redux';
import AutoSuggestBar from '../components/common/AutoSuggestBar';
import Orientation from 'react-native-orientation';
import ViewActions from '../actions/ViewActions';
import FormActions from '../actions/FormActions';
import Trip from '../components/Trip';
import SyncWorker from '../api/SyncWorker';
import Icon8 from '../components/common/Icon8';
import Login from '../components/Login';
import {createForms} from '../utils/FormUtils';
import GPSControlActions from '../actions/GPSControlActions';
import ApiActions from '../actions/ApiActions';

const apiActions = new ApiActions();
const gpsControlActions = new GPSControlActions();
const viewActions = new ViewActions();
const formActions = new FormActions();
const MAX_AUTOSUGGEST_RESULTS = 12;

const styles = {
  wrapper: {
    left: 0,
    top: 0
  },
  toEdges:{
    position: 'absolute',
    left: 0,
    bottom: 0,
  },
  fill:{
    alignItems: 'flex-start',
    alignSelf: 'stretch',
    flex: 1
  },
  detailView: {
    padding: 0,
  },
  col: {
    flexDirection: 'column',
    flex: 1
  },
  row: {
    flexDirection: 'row',
    flex: 1,
  },
  hitSlop: {
    top: 20, left: 20, bottom: 20, right: 20
  },
  tab: {
    flex: 0.1
  },
  tabBar: {
    flex: 1,
  }
};

class ReportingApp extends Component {

  constructor(props){
    super(props);
    this.state = {
      selectedTab: 'trip',
      email: '',
      password: '',
    };
    apiActions.setUpClient(props.dispatch, props.ApiEndpoint, props.AuthEndpoint);
    this.SyncWorker = new SyncWorker(props.dispatch,
                                     props.store.getState,
                                     apiActions);

    this.props.dispatch(gpsControlActions.nativeGPSOn());
    this.orientationDidChange = this.orientationDidChange.bind(this);
    this.renderTrip = this.renderTrip.bind(this);
    this.renderFishing = this.renderFishing.bind(this);
    this.renderForms = this.renderForms.bind(this);
    this.renderTabs = this.renderTabs.bind(this);
    this.startTripCallback = this.startTripCallback.bind(this);
    this.setupForms = this.setupForms.bind(this);
    this.setSelectedTab = this.setSelectedTab.bind(this);
    this.tabs = {
      trip: {render: this.renderTrip, icon: 'fishing-boat', onPress: () => this.setSelectedTab('trip')},
      fishing: {render: this.renderFishing, icon: 'fishing', onPress: () => this.setSelectedTab('fishing') },
      forms: {render: this.renderForms, icon: 'form', onPress: () => {
        this.setupForms();
        setTimeout(() => this.setSelectedTab('forms'), 150);
      }},
    };
  }

  setupForms(){
    const forms = createForms(this.props.fishingEvents, this.props.formType);
    this.props.dispatch(formActions.setViewingForm(forms[forms.length-1]));
  }

  orientationDidChange(orientation) {
    this.props.dispatch(viewActions.orientation(orientation));
  }

  componentDidMount(){
    Orientation.addOrientationListener(this.orientationDidChange);
    this.props.dispatch(viewActions.orientation(Orientation.getInitialOrientation()));
  }

  componentWillUnmount() {
    Orientation.removeOrientationListener(this.orientationDidChange);
  }

  setSelectedTab(tab){
    this.setState({
      selectedTab: tab
    });
  }

  renderTabs(){

    return Object.keys(this.tabs).map((tab)=> (
        <Icon8.TabBarItemIOS
          key={ tab }
          title={ tab.capitalize() }
          selected={ this.state.selectedTab === tab }
          iconName={ this.tabs[tab].icon }
          selectedIconName={`${this.tabs[tab].icon}-filled`}
          hitSlop={ styles.hitSlop }
          style={ styles.tab }
          onPress={this.tabs[tab].onPress}
        >
        { this.tabs[tab].render() }
      </Icon8.TabBarItemIOS>));
  }

  startTripCallback(){
    this.setState({
      selectedTab: "fishing",
    });
  }

  renderTrip(){
    return (
      <View style={[styles.col, styles.fill]}>
        <Trip
          startTripCallback = { this.startTripCallback }
        />
      </View>
    )
  }

  renderForms(){
    const forms = createForms(this.props.fishingEvents, this.props.formType);
    return (
      <View style={[styles.col, styles.fill]}>
        <FormView forms={forms} />
      </View>
    )
  }

  renderFishing(){
    return (
      <View style={[styles.col, styles.fill]}>
        <Fishing
          position={this.props.position}
          formType={this.props.formType}
        />
      </View>
    )
  }

  render(){
    if(!this.props.loggedIn) {
      return (<Login dispatch={this.props.dispatch} />);
    }
    return (
      <View style={[styles.wrapper, {width: this.props.width, height: this.props.height}]}>
        <TabBarIOS
          unselectedTintColor="#bbbbbb"
          tintColor="#007aff"
          barTintColor="#000"
          style={styles.tabBar}
        >
          {this.renderTabs()}
        </TabBarIOS>
        <AutoSuggestBar
          eventEmitter={ this.props.eventEmitter }
          visible={ this.props.autoSuggestBar.uivisible }
          favourites={ this.props.autoSuggestFavourites }
          choices={ this.props.autoSuggestBar.choices || [] }
          text={ this.props.autoSuggestBar.text || "" }
          name={ this.props.autoSuggestBar.name}
          maxResults={ MAX_AUTOSUGGEST_RESULTS }
          inputId={ this.props.autoSuggestBar.inputId }
          width={ this.props.width }
        />
      </View>
    );
  }
}

const select = (State) => {
  const state = State.default;
  return {
    trip: state.trip,
    auth: state.auth,
    autoSuggestFavourites: state.me.autoSuggestFavourites,
    autoSuggestBar: state.view.autoSuggestBar,
    eventEmitter: state.uiEvents.eventEmitter,
    orientation: state.view.orientation,
    height: state.view.height,
    width: state.view.width,
    tripStarted: state.trip.started,
    loggedIn: state.auth.loggedIn,
    fishingEvents: state.fishingEvents.events,
    viewingForm: state.view.viewingForm,
    formType: state.me.formType,
    positionType: state.me.positionType,
    gpsUrl: state.me.gpsUrl,
    gpsPort: state.me.gpsPort,
    gpsBaud: state.me.gpsBaud,
    ApiEndpoint: state.api.ApiEndpoint,
    AuthEndpoint: state.api.AuthEndpoint,
  };
}

export default connect(select)(ReportingApp)
