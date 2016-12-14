'use strict';
import{
  Modal,
  View,
  TextInput,
} from 'react-native';

import React from 'react';
import colors from '../styles/colors';
import { LongButton } from './common/Buttons';
import ApiActions from '../actions/ApiActions';
const apiActions = new ApiActions();

const styles = {
  textInputStyle: {
    width: 360,
    marginTop: 10,
    height: 30
  },
  textInputWrapper: {
    borderBottomColor: colors.lightBlue,
    borderBottomWidth: 0.5,
  },
  buttonWrapper: {
    paddingLeft: 90,
    marginTop: 20
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5fcff',
  },
  innerContainer: {
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'center',
    paddingBottom: 200,
  },
}

export default class Login extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.login = this.login.bind(this);
  }

  handlePasswordChange(password) {
    this.setState({password});
  }

  handleEmailChange(email) {
    this.setState({email});
  }

  login(){
    this.props.dispatch(apiActions.login(this.state.email, this.state.password));
  }

  render(){

  return (
    <Modal
     animationType={'fade'}
     visible
     >
       <View style={[styles.container]}>
         <View style={[styles.innerContainer]}>
           <View style={[styles.textInputWrapper]}>
             <TextInput style={styles.textInputStyle}
                        placeholder={"email"}
                        autoCapitalize={"none"}
                        autoCorrect={false}
                        onChangeText={this.handleEmailChange}
                         />
           </View>
           <View style={[styles.textInputWrapper]}>
             <TextInput style={styles.textInputStyle}
                        placeholder={"password"}
                        autoCapitalize={"none"}
                        autoCorrect={false}
                        onChangeText={this.handlePasswordChange} />
           </View>
           <View style={styles.buttonWrapper}>
             <LongButton
               text={"login"}
               bgColor={colors.pink}
               onPress={this.login}
               disabled={false}
             />
           </View>
         </View>
       </View>
     </Modal>
   )
 }
}
