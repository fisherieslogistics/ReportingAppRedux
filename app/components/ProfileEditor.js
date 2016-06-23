'use strict';
import {
  StyleSheet,
  View,
  Text,
  AlertIOS,
  TouchableOpacity,
  DatePickerIOS,
  ListView,
  RecyclerViewBackedScrollView,
  TouchableHighlight
} from 'react-native';

import React from 'react';
import moment from 'moment';
import {connect} from 'react-redux';
import Helper from '../utils/Helper';
import Toolbar from './Toolbar';
import UserActions from '../actions/UserActions';
import UserModel from '../models/UserModel';
import Editor from '../utils/Editor';

const userActions = new UserActions();
const helper = new Helper();
const editor = new Editor();

class ProfileEditor extends React.Component {
    constructor(props){
      super(props);
    }

    onChangeText(key, value){
      this.props.dispatch(userActions.editUser(key, value));
    }

    renderInput(attr){
      let input = editor.editor(attr, this.props.user[attr.id], this.onChangeText.bind(this), styles);
      return (
        <View key={attr.id}>
          <Text>{attr.label}</Text>
          {input}
        </View>
      );
    }

    render() {
      let inputs = UserModel.map(attr => this.renderInput.bind(this)(attr));
      return (
        <View style={styles.wrapper}>
          <View style={styles.content}>
            {inputs}
          </View>
        </View>
      );
    }
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center'
  },
  content: {
    flex: 0.5,
    alignSelf: 'center'
  },
  padding: {
    
  },
  row:{
    flex: 1,
    flexDirection: 'row'
  },
  col: {
    flexDirection: 'column'
  },
  textInput: {
    borderColor: 'gray',
    borderWidth: 1,
    height: 30,
    width: 300,
    paddingLeft: 10,
  },
  invalid: {
    backgroundColor: '#FFB3BA'
  },
});

const select = (State, dispatch) => {
  let state = State.default;
  return {
    user: state.me.user
  };
}

module.exports = connect(select)(ProfileEditor);
