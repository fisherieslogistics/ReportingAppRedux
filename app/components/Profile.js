 'use strict';
import {
  View,
  ListView,
  Text,
  AlertIOS,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  PickerIOS
} from 'react-native';
import React from 'react';
const PickerItemIOS = PickerIOS.Item;
import { MasterDetail } from './layout/MasterDetailView';
import AuthActions from '../actions/AuthActions';
import MasterListView from './common/MasterListView';
import moment from 'moment';

import {LongButton} from './common/Buttons';
import {MasterToolbar, DetailToolbar} from './layout/Toolbar';
import {colors, listViewStyles, textStyles, iconStyles } from '../styles/styles';
import {connect} from 'react-redux';
import { EndpointLookup } from '../reducers/APIReducer';
import Icon8 from './common/Icon8';

const authActions = new AuthActions();

class Profile extends React.Component{
  constructor (props){
    super(props);
    this.state = {
      ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id}),
      selectedEditor: "account",
      selectedLabel: "Account",
      modalVisible: false,
      transparent: false,
      email: null,
      password: null,
      devTaps: 0,
      devMode: false,
      lastTappedAt: new moment(),
    };
    this.selectEditor = this.selectEditor.bind(this);
    this.onLoginPress = this.onLoginPress.bind(this);
    this.exitDevMode = this.exitDevMode.bind(this);
    this.login = this.login.bind(this);
    this.onTap = this.onTap.bind(this);
  }

  exitDevMode() {
    this.setState({devMode: false, selectedEditor: "account"});
    this.props.dispatch({
      type: 'devModeOff',
    });
  }

  onTap(){
    const duration =  moment.duration(this.state.lastTappedAt.diff(new moment()));
    const taps = this.state.devTaps;
    if(taps > 2 && duration.asSeconds() < 4){
      this.setState({
        devMode: true,
        lastTappedAt: new moment(),
      });
      AlertIOS.alert(
        "Congratulations",
        'You are an elite hacker',
        [
          {text: 'Awesome!', onPress: () => {
            return;
          }, style: 'cancel'},
        ]
      );

    } else {
      this.setState({
        devTaps: (this.state.devTaps + 1),
        lastTappedAt: new moment(),
      });
    }
  }

  onLoginPress(){
    if(this.props.loggedIn){
      this.logout();
    }else{
      this.setState({
        modalVisible: true
      });
    }
  }

  login(){
    const email = this.state.email === null ? this.props.user.email : this.state.email;
    this.props.dispatch(this.props.apiActions.login(
      email, this.state.password));
    this.setState({
      modalVisible: false,
      email: null,
      password: null,
    });
  }

  logout(){
    AlertIOS.alert(
      "Logout",
      'Logout from FLL?',
      [
        {text: 'Cancel', onPress: () => {
          return;
        }, style: 'cancel'},
        {
          text: 'Logout', onPress: () => {
            this.props.dispatch(authActions.logout());
          }
        }
      ]
    );
  }

  selectEditor(editor){
    this.setState({
      selectedEditor: editor.name,
      selectedLabel: editor.label
    });
  }

  renderListView(){

    let defaultItems = [
      {name: "account", icon: 'cloud', label: "Account", color: colors.green},
      {name: "user", icon: 'user', label: "Profile", color: this.props.loggedIn ? colors.blue : colors.midGray},
      {name: "addPort", icon: 'settings', label: "Add Port", color: colors.blue},
    ];

    if(! this.props.loggedIn){
      defaultItems = [defaultItems[0]];
    }

    if(!this.props.tripStarted) {
      defaultItems.push({name: "vessel", icon: 'fishing-boat', label: "Vessel", color: this.props.vessels.length ?  colors.blue : colors.midGray});
    }

    const devItem = (this.state.devMode?[{name: "dev", icon: 'cloud', label: "Dev", color: colors.orange}]:[]);

    const items = [...defaultItems, ...devItem];

    const isSelected = (items) => (items.name == this.state.selectedEditor)

    const getIcon = (editor, active) => (<Icon8 name={editor.icon} size={30} color="white"  style={[iconStyles, {backgroundColor: editor.color}]}/>)

    const getDescription = (editor, sectionID, rowID) => (
          <View style={listViewStyles.listRowItem}>
            <Text style={[textStyles.font, textStyles.black, listViewStyles.detail, textStyles.listView]}>
              {editor.label}
            </Text>
          </View>
        )

    return (
      <MasterListView
        getDescription={getDescription}
        isSelected={isSelected}
        onPress={this.selectEditor}
        dataSource={this.state.ds.cloneWithRows(items)}
        getIcon={getIcon}
      />
    );

  }

  renderDetail(){
    switch (this.state.selectedEditor) {
      case "user":
        return (<ProfileEditor
                  dispatch={this.props.dispatch}
                  user={this.props.user}
                />);
      case "vessel":
        return (<VesselEditor
                  dispatch={this.props.dispatch}
                  vessels={this.props.vessels}
                  vessel={this.props.vessel}
                  tripStarted={this.props.tripStarted}
                  formType={this.props.formType}
                  catchDetailsExpanded={this.props.catchDetailsExpanded}
                />);
      case "account":
        return (<Login
                  disabled={this.props.loggedIn && this.props.tripStarted}
                  loggedIn={this.props.loggedIn}
                  onLoginPress={this.onLoginPress}
                  sync={this.props.sync}
                />);
      case "dev":
        return (<DevScreen ApiEndpoint={this.props.ApiEndpoint} dispatch={this.props.dispatch} exitDevMode={this.exitDevMode}/>);
      //case "gps":
        //return (<GPSSettings {...this.props} />);
      case "addPort":
        return (<AddPort ports={ this.props.ports } dispatch={ this.props.dispatch } />);
      default:
    }
  }

  getModal(){
    const textInputStyle = {width: 360,
                          marginTop: 10,
                          height: 30
                        }
    const textInputWrapper = {
      borderBottomColor: colors.lightBlue,
      borderBottomWidth: 0.5,
    };

    return (
      <Modal
       animationType={'fade'}
       transparent={this.state.transparent}
       visible={this.state.modalVisible}
       onRequestClose={() => {this.setState({modalVisible: false});}}
       >
         <View style={[modalStyle.container, {backgroundColor: '#f5fcff'}]}>
           <View style={[modalStyle.innerContainer]}>
             <View style={{flexDirection: 'column', flex: 1, justifyContent: 'center', paddingBottom: 200}}>
               <View style={[textInputWrapper]}>
                 <TextInput style={textInputStyle}
                            placeholder={"email"}
                            autoCapitalize={"none"}
                            autoCorrect={false}
                            onChangeText={(text) => { this.setState({ email: text })}}
                             />
               </View>
               <View style={[textInputWrapper]}>
                 <TextInput style={textInputStyle}
                            placeholder={"password"}
                            autoCapitalize={"none"}
                            autoCorrect={false}
                            onChangeText={(text) => { this.setState({password: text})}} />
               </View>
               <View style={{paddingLeft: 90, marginTop: 20}}>
                 <LongButton
                   text={"login"}
                   bgColor={colors.red}
                   onPress={this.login}
                   disabled={false}
                 />
               </View>

            </View>
           </View>
         </View>
       </Modal>
     )
  }

  render(){
    const button = (
      <TouchableWithoutFeedback onPress={this.onTap.bind(this)}>
        <View>
          <Text style={[textStyles.font, textStyles.midLabel]}>
            {this.state.selectedLabel}
          </Text>
          </View>
      </TouchableWithoutFeedback>
    );
    const detailToolbar = (
      <DetailToolbar
        center={button}
      />
    );
    const masterToolbar = (
      <MasterToolbar
        center={<View style={{marginTop: 36}}><Text style={[textStyles.font, textStyles.midLabel]}>Settings</Text></View>}
      />
    )
    return (
        <MasterDetail 
          modal={this.getModal()}
          master={this.renderListView()}
          detail={
            (<LongButton
                text={ "login"}
                bgColor={colors.red}
                onPress={this.onLoginPress}
                disabled={ false }
            />)
          }
          detailToolbar={detailToolbar}
          masterToolbar={masterToolbar}
        />
    );
  }
}

const modalStyle = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  innerContainer: {
    borderRadius: 10,
    alignItems: 'center',
  },
})

const select = (State, dispatch) => {
  const state = State.default;
  return {
    user: state.me.user,
    message: state.auth.message,
    loggedIn: state.auth.loggedIn,
    vessels: state.me.vessels,
    vessel: state.me.vessel,
    tripStarted: state.trip.started,
    sync: state.sync,
    positionType: state.me.positionType,
    gpsUrl: state.me.gpsUrl,
    gpsPort: state.me.gpsPort,
    gpsBaud: state.me.gpsBaud,
    currentPosition: state.uiEvents.uipositionProvider.getPosition(),
    catchDetailsExpanded: state.me.catchDetailsExpanded,
    ApiEndpoint: state.api.ApiEndpoint,
    ports: state.me.ports,
  };
}

export default connect(select)(Profile);
