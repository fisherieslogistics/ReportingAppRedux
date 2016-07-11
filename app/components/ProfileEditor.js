'use strict';
import {
  StyleSheet,
} from 'react-native';
import React from 'react';

import UserModel from '../models/UserModel';
import EditorView from './EditorView';
import UserActions from '../actions/UserActions';

import {eventEditorStyles} from '../styles/styles';



class ProfileEditor extends React.Component {

    onChange(key, value){
      var change = {};
      change[key] = value
      this.props.dispatch(userActions.editUser(change));
    }

    getEditor(attribute){
      return {
        attribute,
        value: this.props.user[attribute.id],
        onChange: this.onChange.bind(this),
        extraProps: {editable: false},
        inputId: attribute.id + "__profile__"
      };
    }

    render() {
      return (
        <EditorView
          styles={styles}
          getCallback={() => this.onChange.bind(this)}
          getEditor={this.getEditor.bind(this)}
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
