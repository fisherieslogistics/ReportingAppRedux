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
      this.state = {
        focusedAttributeId: ''
      };
    }

    setFocus(attributeId){
      this.setState({ focusedAttributeId: attributeId });
    }

    render() {
      const editingCallback = (attributeId, focusedAttributeId) => {
        if(focusedAttributeId) {
          this.setFocus(attributeId);
        } else if(this.state.focusedAttributeId == attributeId) {
          this.setState({ focusedAttributeId: '' });
        }
      }
      return <EditorView {...this.props}
                         focusedAttributeId={this.props.toFocusAttributeId || this.state.focusedAttributeId}
                         editingCallback={editingCallback}
                         onEnterPress={this.props.onEnterPress} />
    }
}

export default EditingState;
