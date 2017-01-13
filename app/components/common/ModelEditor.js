'use strict';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import React from 'react';
import { modelEditorStyles, colors } from '../../styles/styles';
import AttributeEditor from './AttributeEditor';
import ModelUtils from '../../utils/ModelUtils';
import ErrorBubble from './ErrorBubble';

const styles = StyleSheet.create(modelEditorStyles);

class ModelEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focusedAttributeId: ''
    };
    this.renderInputs = this.renderInputs.bind(this);
    this.setFocusedInputId = this.setFocusedInputId.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.renderInputWrapper = this.renderInputWrapper.bind(this);
    this.renderInput = this.renderInput.bind(this);
    this.handlePress = this.handlePress.bind(this);
    this.renderAttribute = this.renderAttribute.bind(this);
    this.renderInputs = this.renderInputs.bind(this);
    this.isFocused = this.isFocused.bind(this);
  }

  renderError(attribute, isFocused){
    if(attribute.valid.func(this.props.modelValues[attribute.id])){
      return null;
    }
    return (
      <ErrorBubble
        isFocused={ isFocused }
        attribute={ attribute }
      />
    );
  }

  renderLabel(attribute, active) {
    const tStyle = [styles.labelText];
    if(active) {
      tStyle.push({ color: colors.white, fontWeight: '600' });
    }
    return (
      <View style={[ styles.row, styles.labelRow ]}>
        <Text style={ tStyle }>
          { attribute.label }
        </Text>
      </View>
    );
  }

  setFocusedInputId(inputId) {
    this.setState({
      focusedAttributeId: inputId,
    });
  }

  handleBlur(){
    this.setFocusedInputId('');
  }

  handleFocus(inputId){
    this.setFocusedInputId(inputId);
  }

  handlePress(inputId) {
    this.setFocusedInputId(inputId);
  }

  isFocused(inputId) {
    return (this.state.focusedAttributeId === inputId);
  }

  getInputId(attribute) {
    return `${attribute.id}_input_${this.props.index}`;
  }

  getWrapperStyle(displayType) {
    if(displayType === 'combined' || displayType === 'child'){
     return styles.singleInput;
    }
    return styles.combinedInput;
  }

  renderInput(attribute, numInputs = 1) {
    const editorProps = this.props.getEditorProps(attribute, this.props.modelValues, this.props.index);
    const inputId = this.getInputId(attribute);
    const isFocused = this.isFocused(inputId);
    const handlePress = () => this.handlePress(inputId);
    const value = this.props.modelValues[attribute.id];
    let errorView = this.renderError(attribute, isFocused);
    let labelView = this.props.noLabelRow ? null : this.renderLabel(attribute, isFocused);
    const wrapperStyle = [
      { flex: 1 / numInputs },
      styles.col,
      this.getWrapperStyle(attribute.display.type),
    ];
    if(this.props.noLabelRow){
      labelView = null;
      errorView = null;
      const err = (!attribute.valid.func(value) || editorProps.error)
      if(err){
        wrapperStyle.push({
          borderBottomColor: colors.orange,
          borderBottomWidth: 1,
        });
      }
      if(isFocused){
        wrapperStyle.push({
          borderBottomColor: colors.white,
          borderTopColor: colors.white,
          borderTopWidth: 2,
          borderBottomWidth: 2,
        });
      }
    }
    return (
      <TouchableOpacity
        key={ inputId }
        onPress={ handlePress }
        style= { wrapperStyle }
      >
        { errorView }
        { labelView }
        <AttributeEditor
          attribute={ attribute }
          handleBlur={ this.handleBlur }
          handleFocus={ this.handleFocus }
          inputId={ inputId }
          isFocused={ isFocused }
          index={ this.props.index }
          value={ value }
          onChange={ this.props.onChange }
          { ...editorProps }
        />
      </TouchableOpacity>
    );
  }
  //Single Editor
  renderInputWrapper(attribute, inputs){
    const inputRowId = `${attribute.id}_${attribute.type}_input_view_${this.props.index}`;
    return (
      <View
        style={ this.props.wrapperStyle }
        key={ inputRowId }
      >
        <View style={[styles.row, styles.inputRow]}>
            { inputs }
        </View>
      </View>
    );
  }

  renderAttribute(attribute) {

    switch (attribute.display.type) {

      case "single": {
        const input = this.renderInput(attribute);
        return this.renderInputWrapper(attribute, [input]);
      }
      case "combined": {
        const siblings = attribute.display.siblings.map(
          id => this.props.model.find(attr => attr.id === id));

        const numInputs = siblings.length + 1;
        const inputs = [attribute, ...siblings].map(
          (attr) => attr ? this.renderInput(attr, numInputs) : null);

        return this.renderInputWrapper(attribute, inputs);
      }
    }
  }

  renderInputs(){
    const attributes = ModelUtils.getRenderableAttributes(this.props.model);
    const inputs = attributes.map(this.renderAttribute);
    return <View>{ inputs }</View>;
  }

  render() {
    if(!this.props.modelValues){
      return (<View />);
    }
    const inputs = this.renderInputs();
    const wrapperStyle = [
      styles.col,
      styles.fill,
      styles.wrapper,
    ];
    return (
      <View style={ wrapperStyle }>
        <View style={ styles.innerWrapper }>
          { inputs }
        </View>
      </View>
    );
  }
}

export default ModelEditor;
