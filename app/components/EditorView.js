'use strict';
import {
  View,
} from 'react-native';
import React from 'react';
import {renderEditors} from './AttributeEditor';

function EditorView(props) {
  if(!props.obj){
    return <View />;
  }
  return (
    <View style={[props.styles.col, props.styles.fill, props.styles.outerWrapper, {alignSelf: 'flex-start'}]}>
      <View style={[props.styles.topWrapper]}>
        {props.top}
      </View>
      <View style={props.styles.innerWrapper}>
        {renderEditors(props)}
      </View>
      <View style={[props.styles.bottomWrapper]}>
        {props.bottom}
      </View>
    </View>
  );
};

export default EditorView;
