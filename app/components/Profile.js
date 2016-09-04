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
  Switch,
  TouchableOpacity,
  TouchableWithoutFeedback,
  PickerIOS,
  PickerItemIOS
} from 'react-native';
import React from 'react';

import ProfileEditor from './ProfileEditor';
import VesselEditor from './VesselEditor';
import MasterDetailView from './layout/MasterDetailView';
import AuthActions from '../actions/AuthActions';
import MasterListView from './common/MasterListView';
import EditorView from './common/EditorView';
import GPSControlActions from '../actions/GPSControlActions';
import version from '../constants/version';

import Validator from '../utils/Validator';
const valid = Validator.valid;

import {LongButton} from './common/Buttons';
import {MasterToolbar, DetailToolbar} from './layout/Toolbar';
import {colors, listViewStyles, textStyles, iconStyles, eventEditorStyles} from '../styles/styles';
import {connect} from 'react-redux';

import Icon8 from './common/Icon8';

const authActions = new AuthActions();
const editorStyles = StyleSheet.create(eventEditorStyles);
const gpsControlActions = new GPSControlActions();


const GPSSettings = ({currentPosition, positionType, gpsUrl, gpsPort, gpsBaud, dispatch} ) => {
  return <View style={{paddingTop: 10, paddingLeft: 10}}><Text>No settings here currently.</Text></View>;
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

const DevScreen = (props) => {
    return(
      <View>
        <UrlPicker dispatch={props.dispatch} ApiEndpoint={props.ApiEndpoint} />
        <TouchableOpacity onPress={props.exitDevMode}>
          <Text>Exit Dev Mode</Text>
        </TouchableOpacity>
      </View>
    );
}

const urls = [
  {
    name: 'Production',
    value: 'http://api.fisherylogistics.com/',
  },
  {
    name: 'Staging',
    value: 'http://fisherieslogistics.com:5003/',
  },
  {
    name: 'Local',
    value: 'http://localhost:5003/',
  }
];

let urlItems = urls.map((url) => (
  <PickerItemIOS
    key={url.name}
    value={url.name}
    label={url.name}
  />));

function UrlPicker(props){
  return(
    <PickerIOS
      selectedValue={urls.find(url => url.value == props.ApiEndpoint).name}
      onValueChange={(u) => {
        console.log('devMode'+u);
        props.dispatch({type: 'devMode', payload: u});
      }}
    >
      {urlItems}
    </PickerIOS>
  )
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
      password: "",
      devTaps: 0,
      devMode: false
    };
  }

  componentDidMount() {
    const func = () => {
      if(this.state.devTaps >= 3){
        this.setState({devMode: true});
        AlertIOS.alert(
          "Congratulations",
          'You are an elite hacker',
          [
            {text: 'Awesome!', onPress: () => {
              return;
            }, style: 'cancel'},
          ]
        );

        // this.props.dispatch({
        //   type: 'devModeOn',
        // });
      }
        this.setState({devTaps: 0});
    };
    const timer = setInterval(func, 1200);
  }

  exitDevMode() {
      this.setState({devMode: false, selectedEditor: "account"});
      this.props.dispatch({
        type: 'devModeOff',
      });
  }

  onTap(){
    this.setState({devTaps: (this.state.devTaps+1)});
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

    let defaultItems = [
      {name: "account", icon: 'cloud', label: "Account", color: colors.green},
      {name: "user", icon: 'user', label: "Profile", color: this.props.loggedIn ? colors.blue : colors.midGray},
      {name: "vessel", icon: 'fishing-boat', label: "Vessel", color: this.props.vessels.length ?  colors.blue : colors.midGray},
      {name: "gps", icon: 'settings', label: "GPS Settings", color: colors.blue},
    ];

    let devItem = (this.state.devMode?[{name: "dev", icon: 'cloud', label: "Dev", color: colors.orange}]:[]);

    let items = [...defaultItems, ...devItem];

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
                  catchDetailsExpanded={this.props.catchDetailsExpanded}
                />);
      case "account":
        return (<Login
                  disabled={this.props.loggedIn && this.props.tripStarted}
                  loggedIn={this.props.loggedIn}
                  onLoginPress={this.onLoginPress.bind(this)}
                  sync={this.props.sync}
                />);
      case "dev":
        return (<DevScreen ApiEndpoint={this.props.ApiEndpoint} dispatch={this.props.dispatch} exitDevMode={this.exitDevMode.bind(this)}/>);
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
        centerTop={<Text style={[textStyles.font, textStyles.midLabel]}>{this.state.selectedLabel}</Text>}
        centerBottom={<TouchableWithoutFeedback onPress={this.onTap.bind(this)}>
                        <View><Text style={[textStyles.font]}>{"Version: " + version}</Text></View>
                      </TouchableWithoutFeedback>}
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
    catchDetailsExpanded: state.me.catchDetailsExpanded,
    ApiEndpoint: state.api.ApiEndpoint,
  };
}

export default connect(select)(Profile);
