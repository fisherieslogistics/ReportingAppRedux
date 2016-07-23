 'use strict';
import {
  View,
  ListView,
  Text,
  AlertIOS,
  Image,
  StyleSheet,
  Modal,
  ScrollView,
  TextInput,
  Switch
} from 'react-native';
import React from 'react';

import ProfileEditor from './ProfileEditor';
import VesselEditor from './VesselEditor';
import MasterDetailView from './MasterDetailView';
import AuthActions from '../actions/AuthActions';
import MasterListView from './MasterListView';
import EditorView from './EditorView';
import GPSControlActions from '../actions/GPSControlActions';

import Validator from '../utils/Validator';
const valid = Validator.valid;

import {LongButton} from './Buttons';
import {MasterToolbar, DetailToolbar} from './Toolbar';
import {colors, listViewStyles, textStyles, iconStyles, eventEditorStyles} from '../styles/styles';
import {connect} from 'react-redux';

import Icon8 from './Icon8';

const authActions = new AuthActions();
const editorStyles = StyleSheet.create(eventEditorStyles);
const gpsControlActions = new GPSControlActions();


const GPSSettings = ({currentPosition, positionType, gpsUrl, gpsPort, gpsBaud, dispatch} ) => {
  let textInputStyle = {width: 360,
                          marginTop: 10,
                          height: 30,
                          backgroundColor: colors.white,
                          borderColor: colors.darkGray,
                          borderWidth: 1,
                        }
  let styles = eventEditorStyles;
  let lastUpdated = (<Text>No Position updated</Text>);
  if(currentPosition && currentPosition.timestamp)
  lastUpdated = (
     <View>
       <Text>{ currentPosition.timestamp.toString() }</Text>
       <Text>{ new Date(currentPosition.timestamp).toString() }</Text>
    </View>
  );

  let ipGPSSettings = (
   <View>
    <View>
        <Text>IP GPS URL</Text>
        <TextInput 
          value={gpsUrl}
          style={textInputStyle}
          autoCapitalize={"none"}
          autoCorrect={false}
          onChangeText={(url) => {
          dispatch(gpsControlActions.setGpsUrl(url))
        }} />
      </View>
      <View>
        <Text>IP GPS HTTP Port</Text>
        <TextInput 
          style={textInputStyle}
          autoCapitalize={"none"}
          autoCorrect={false}
          value={gpsPort}
          onChangeText={(text) => {
          dispatch(gpsControlActions.setGpsPort(text))
        }} />
      </View>
      <View>
        <Text>IP GPS Baud rate</Text>
        <TextInput 
          style={textInputStyle}
          autoCapitalize={"none"}
          autoCorrect={false}
          value={gpsBaud}
          onChangeText={(text) => {
          dispatch(gpsControlActions.setGpsBaud(text))
        }} />
      </View>
      <View>
        <LongButton
          text={"Apply changes"}
          bgColor={colors.pink}
          onPress={() => {
            dispatch(gpsControlActions.applyGpsSettings(gpsUrl, gpsPort, gpsBaud));
          }}
        />
      </View>
    </View>
  )

  return (
    <View style={[styles.col, styles.fill, styles.outerWrapper, {alignSelf: 'flex-start'}]}>
      <View style={styles.innerWrapper}>
        <Text>last updated</Text>
        {lastUpdated}
          <View style={{flexDirection: "row"}}>
          <Text>IP GPS - custom</Text>
          <Switch
            onValueChange={(bool) => {
              if(bool){
                dispatch(gpsControlActions.nativeGPSOn());
              }else{
                dispatch(gpsControlActions.ipGpsOn());
              }
            }}
            value={(positionType=='native')}
          />
          <Text>Native GPS - standard ios</Text>
        </View>
        {positionType == 'IP' ? ipGPSSettings : null }
      </View>
  </View>
  );
}


const Login = ({onLoginPress, loggedIn, disabled, sync}) => {
  const tripsToSync = sync.queues.pastTrips.length + (sync.trip ? 1 : 0);

  const eventsToSync = Object.keys(sync.fishingEvents).length;
  const SyncModel = [
    {id: 'tripsToSync', defaultValue: 0, label: "Trips to Sync", type: "labelOnly", valid: valid.alwaysValid,
      editorDisplay: {editor: "account", type: 'combined', siblings: ["eventsToSync"]}},
    {id: 'eventsToSync', defaultValue: 0, label: "Events to Sync",  type: "labelOnly", valid: valid.alwaysValid}
  ];
  let syncData = {tripsToSync: tripsToSync, eventsToSync: eventsToSync};
  const getEditor = (attribute) => {
    return { attribute, value: syncData[attribute.id] };
  }
  const topStyle = {
    backgroundColor: colors.darkBlue,
    flexDirection: 'row',
    padding: 10
  }
  const bottomStyle = {
    padding: 10,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  }
  let top = (
    <View style={topStyle}>
      <Text style={[textStyles.logo1, textStyles.font]}>Fishery </Text>
      <Text style={[textStyles.logo2, textStyles.font]}>Logistics</Text>
    </View>
  );
  let bottom = (
    <View style={bottomStyle}>
      <LongButton
        text={loggedIn ? "logout" : "login"}
        bgColor={colors.pink}
        onPress={onLoginPress}
        disabled={disabled}
      />
    {disabled &&(<Text style={{color: colors.orange, paddingLeft: 20, paddingTop: 5}}>Cannot logout during active trip.</Text>)}
    </View>
  );
  return (
    <EditorView
      top={top}
      bottom={bottom}
      styles={editorStyles}
      getCallback={() => {}}
      getEditor={getEditor}
      editorType={"account"}
      name={"account"}
      model={SyncModel}
      obj={syncData}
      values={syncData}
    />
  );
}


class Profile extends React.Component{
  constructor (props){
    super(props);
    this.state = {
      ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id}),
      selectedEditor: "account",
      selectedLabel: "Account",
      modalVisible: false,
      transparent: false,
      email: "",
      password: ""
    };
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
    this.setState({
      modalVisible: false
    })
    this.props.dispatch(this.props.apiActions.login(
      this.state.email, this.state.password));

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

    let items = [
      {name: "account", icon: 'cloud', label: "Account", color: colors.green},
      {name: "user", icon: 'user', label: "Profile", color: this.props.loggedIn ? colors.blue : colors.midGray},
      {name: "vessel", icon: 'fishing-boat', label: "Vessel", color: this.props.vessels.length ?  colors.blue : colors.midGray},
      {name: "gps", icon: 'settings', label: "GPS Settings", color: colors.blue},
    ];

    const isSelected = (items) => {
      return (items.name == this.state.selectedEditor);
    }

    const getIcon = (editor, active) => {
      return (<Icon8 name={editor.icon} size={30} color="white"  style={[iconStyles, {backgroundColor: editor.color}]}/>);
    }

    const getDescription = (editor, sectionID, rowID) => {
        return (
          <View style={listViewStyles.listRowItem}>
            <Text style={[textStyles.font, textStyles.black, listViewStyles.detail, textStyles.listView]}>
              {editor.label}
            </Text>
          </View>
        );
    }

    return (
      <MasterListView
        getDescription={getDescription}
        isSelected={isSelected}
        onPress={this.selectEditor.bind(this)}
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
                />);
      case "account":
        return (<Login
                  disabled={this.props.loggedIn && this.props.tripStarted}
                  loggedIn={this.props.loggedIn}
                  onLoginPress={this.onLoginPress.bind(this)}
                  sync={this.props.sync}
                />);
      case "gps":
        return (<GPSSettings {...this.props} />);
      default:
    }
  }

  getModal(){
    let textInputStyle = {width: 360,
                          marginTop: 10,
                          height: 30
                        }
    let textInputWrapper = {
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
                            onChangeText={(text) => { this.setState({email: text})}} />
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
                   bgColor={colors.pink}
                   onPress={this.login.bind(this)}
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
    let detailToolbar = (
      <DetailToolbar
        centerBottom={<Text style={[textStyles.font, textStyles.midLabel]}>{this.state.selectedLabel}</Text>}
      />
    );
    let masterToolbar = (
      <MasterToolbar
        center={<View style={{marginTop: 36}}><Text style={[textStyles.font, textStyles.midLabel]}>Settings</Text></View>}
      />
    )
    return (
        <MasterDetailView
          modal={this.getModal()}
          master={this.renderListView()}
          detail={
            <ScrollView>
              <View style={[this.props.styles.detailView, this.props.styles.col]}>
              <View style={[this.props.styles.row]}>
                {this.renderDetail()}
              </View>
            </View>
          </ScrollView>
          }
          detailToolbar={detailToolbar}
          masterToolbar={masterToolbar}
        />
    );
  }
};

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
  let state = State.default;
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
  };
}

export default connect(select)(Profile);
