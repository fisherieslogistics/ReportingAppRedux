'use strict';
import {
  StyleSheet,
} from 'react-native';
import React from 'react';

import UserModel from '../models/UserModel';
import ModelEditor from './common/ModelEditor';
import UserActions from '../actions/UserActions';
const userActions = new UserActions();

import {modelEditorStyles} from '../styles/styles';



class ProfileEditor extends React.Component {

    constructor(props) {
      super(props);
       this.onChange = this.onChange.bind(this);
       this.getEditorProps = this.getEditorProps.bind(this);
    }

    onChange(key, value){
      /*var change = {};
      change[key] = value
      this.props.dispatch(userActions.editUser(change));*/
    }

    getEditorProps(attribute){
      return {
        attribute,
        value: this.props.user[attribute.id],
        onChange: this.onChange,
        extraProps: {editable: false, focus: false},
        inputId: attribute.id + "__profile__"
      };
    }

    render() {
      return (
        <ModelEditor
          styles={styles}
          getCallback={() => this.onChange}
          getEditorProps={this.getEditorProps}
          editorType={"profile"}
          name={"profileEdit"}
          model={UserModel}
          modelValues={this.props.user}
          values={this.props.user}
        />
    );
  }
};

const styles = StyleSheet.create(modelEditorStyles);

module.exports = ProfileEditor;
