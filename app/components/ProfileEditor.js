
import React, { Component } from 'react';
import UserModel from '../models/UserModel';
import ModelEditor from './common/ModelEditor';
import VesselModel from '../models/VesselModel';

const ProfileModel = UserModel.concat(VesselModel);

class ProfileEditor extends Component {

    constructor(props) {
      super(props);
       this.getEditorProps = this.getEditorProps.bind(this);
    }

    onChange() {

    }

    getEditorProps(attribute){
      const profile = Object.assign({}, this.props.user, this.props.vessel);
      return {
        attribute,
        value: profile[attribute.id],
        onChange: this.onChange,
        extraProps: { isFocused: false, editable: false },
        inputId: attribute.id + "__profile__",
      };
    }

    render() {
      const profile = Object.assign({}, this.props.user, this.props.vessel);
      return (
        <ModelEditor
          getEditorProps={this.getEditorProps}
          model={ ProfileModel }
          modelValues={ profile }
          index={1}
          onChange={ this.onChange }
        />
    );
  }
}

export default ProfileEditor;
