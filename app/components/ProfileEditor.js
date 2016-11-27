'use strict';
import {
  StyleSheet,
} from 'react-native';
import React from 'react';

import UserModel from '../models/UserModel';
import EditorView from './common/EditorView';
import UserActions from '../actions/UserActions';
const userActions = new UserActions();

import {eventEditorStyles} from '../styles/styles';



class ProfileEditor extends React.Component {

    constructor(props) {
      super(props);
       this.onChange = this.onChange.bind(this);
       this.getEditor = this.getEditor.bind(this);
    }

    onChange(key, value){
      /*var change = {};
      change[key] = value
      this.props.dispatch(userActions.editUser(change));*/
    }

    getEditor(attribute){
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
        <EditorView
          styles={styles}
          getCallback={() => this.onChange}
          getEditor={this.getEditor}
          editorType={"profile"}
          name={"profileEdit"}
          model={UserModel}
          obj={this.props.user}
          values={this.props.user}
        />
    );
  }
};

const styles = StyleSheet.create(eventEditorStyles);

module.exports = ProfileEditor;
