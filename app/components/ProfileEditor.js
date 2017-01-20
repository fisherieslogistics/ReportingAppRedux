
import React, { Component } from 'react';
import {
  View
} from 'react-native';
import UserModel from '../models/UserModel';
import ModelEditor from './common/ModelEditor';
import VesselModel from '../models/VesselModel';
import UserActions from '../actions/UserActions';

const userActions = new UserActions();

class ProfileEditor extends Component {

    constructor(props) {
      super(props);
      this.getEditorProps = this.getEditorProps.bind(this);
      this.getUserEditorProps = this.getUserEditorProps.bind(this);
      this.getVesselEditorProps = this.getVesselEditorProps.bind(this);
      this.onChangeUser = this.onChangeUser.bind(this);
      this.onChangeVessel = this.onChangeVessel.bind(this);
    }

    onChangeUser(inputId, value) {
      this.props.dispatch(userActions.updateUser(inputId, value));
    }

    onChangeVessel(inputId, value) {
      this.props.dispatch(userActions.updateVessel(inputId, value));
    }

    getUserEditorProps(attribute){
     return this.getEditorProps(attribute, this.props.user);
    }

    getEditorProps(attribute, values) {
      return {
        values: values[attribute.id],
        attribute,
        extraProps: {},
        inputId: attribute.id + "__profile__",
      };
    }

    getVesselEditorProps(attribute){
      return this.getEditorProps(attribute, this.props.vessel);
    }

    render() {
      const styleGap = {
        marginTop: 20,
      }
      return (
        <View>
          <View style={styleGap}>
            <ModelEditor
              getEditorProps={ this.getUserEditorProps }
              model={ UserModel }
              modelValues={ this.props.user }
              index={1}
              onChange={ this.onChangeUser }
            />
          </View>
          <View style={styleGap}>
            <ModelEditor
              getEditorProps={ this.getEditorProps }
              model={ VesselModel }
              modelValues={ this.props.vessel }
              index={1}
              onChange={ this.onChangeVessel }
            />
        </View>
      </View>
    );
  }
}

export default ProfileEditor;
