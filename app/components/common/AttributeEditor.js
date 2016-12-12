'use strict';
import {
  Switch,
} from 'react-native';
import React, { Component } from 'react';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import { inputStyles } from '../../styles/styles';
import LocationEditor from '../LocationEditor';
import AutoSuggestPicker from './AutoSuggestPicker';
import EditOnBlurInput from './EditOnBlurInput';

//const AttributeEditor = (attribute, value, onChange, extraProps = {}, inputId, onEnterPress }, editingCallback, focusedAttributeId, index) => {
const dateStyles = {
  dateText: Object.assign(inputStyles.dateText, { left: 45 }),
  dateInput: inputStyles.dateInput,
  dateIcon: inputStyles.dateIcon,
}

class AttributeEditor extends Component {

  constructor(props) {
    super(props);
    this.onDateChange = this.onDateChange.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return (nextProps.value !== this.props.value) ||
           (nextProps.isFocused !== this.props.isFocused);
  }

  onDateChange(datetime) {
    return this.props.onChange(this.props.attribute.id, new moment(datetime));
  }

  onChange(value) {
    return this.props.onChange(this.props.attribute.id, value);
  }

  render() {
    const {
      attribute,
      value,
      onChange,
      extraProps,
      editingCallback,
      onEnterPress,
      inputId,
      isFocused,
      handleBlur,
      handleFocus,
    } = this.props;

    switch (attribute.type) {
      case "datetime":
        const date = value ? value.toDate() : new Date();
        return (
          <DatePicker
            date={ date }
            mode="datetime"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={ dateStyles }
            onDateChange={ this.onDateChange }
            { ...extraProps }
          />
        );
      case "picker":
        return (
          <AutoSuggestPicker
            onChange={ this.onChange }
            value={ value}
            name={ attribute.id }
            inputId={ inputId }
            handleBlur={ handleBlur }
            handleFocus={ handleFocus }
            isFocused={ isFocused }
            onEnterPress={ onEnterPress }
            { ...extraProps }
          />
        );
      case "location":
        return (
          <LocationEditor
            attribute={ attribute }
            value={ value }
            onChange={ onChange }
            inputId={ inputId }
            editingCallback={editingCallback}
          />
        );
      case "bool":
        const boolVal = !!value
        return (
          <Switch
            onValueChange={ this.onChange }
            value={ boolVal }
            { ...extraProps }
          />
        );
      case "number":
      case "float":
      default:
        return (
          <EditOnBlurInput
            handleBlur={ handleBlur }
            handleFocus={ handleFocus }
            attribute={ attribute }
            value={ value }
            onChange={ this.onChange }
            extraProps={ extraProps }
            inputId={ inputId }
            isFocused={ isFocused }
            onEnterPress={ onEnterPress }
            { ...extraProps }
          />
        );
    }
  }
}

export default AttributeEditor;
