'use strict';
import {
  View,
} from 'react-native';
import React from 'react';
import { Editors } from './AttributeEditor';

function EditorView(props) {
 
  if(!props.obj || !props.values){
    return <View />;
  }
  return (
    <View style={[props.styles.col, props.styles.fill, props.styles.outerWrapper, {alignSelf: 'stretch'}]}>
      <View style={[props.styles.topWrapper]}>
        {props.top}
      </View>
      <View style={props.styles.innerWrapper}>
        <Editors {...props} />
      </View>
      <View style={[props.styles.bottomWrapper]}>
        {props.bottom}
      </View>
    </View>
  );
};


class EditingState extends React.Component {
    constructor() {
      super();
      this.state = { editing: '' };
    }

    render() {
      const editingCallback = (attributeId, editing) => {
        if(editing) {
          this.setState({ editing: attributeId });
        } else if(this.state.editing == attributeId) {
          this.setState({ editing: '' });
        }
      }
      return <EditorView {...this.props} editing={this.state.editing} editingCallback={editingCallback} />
    }
}

export default EditingState;
