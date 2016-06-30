'use strict';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  Modal,
  ScrollView,
  Switch,
  AlertIOS,
  TextInput,
} from 'react-native';
import React from 'react';
import FishPicker from '../components/FishPicker';
import DatePicker from 'react-native-datepicker';
import inputStyle from '../styles/inputStyle';

class EditOnBlur extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      value: this.getRenderedValue(props.value),
      inputId: props.inputId
    }
  }

  componentWillReceiveProps(props){
    if(props.inputId !== this.state.inputId){
      this.setState({
        value: this.getRenderedValue(props.value),
        inputId: props.inputId
      });
    }
  }

  onChangeText(text){
    this.setState({
      value: text
    })
  }

  onFocus(){
    console.log(this)
  }

  onBlur(){
    this.props.callback(this.props.attribute.id, this.state.value);
    this.setState({
      value: this.getRenderedValue(this.state.value)
    });
  }

  getKeypad(){
    switch (this.props.attribute.type) {
      case "number":
        return 'number-pad'
      case "float":
        return 'numeric'
      default:
        return 'default'
    }
  }

  getRenderedValue(value){
    switch (this.props.attribute.type) {
      case "number":
        return isNaN(parseInt(value)) ? "0" : parseInt(value).toString() + (this.props.attribute.unit || "");
      case "float":
        return isNaN(parseFloat(value)) ? "0.00" : parseFloat(value).toFixed(2).toString() + (this.props.attribute.unit || "");
      default:
        return (value !== null && value !== undefined) ? value.toString() : "";
    }
  }

  render(){
    return (
      <TextInput
        selectTextOnFocus={true}
        keyboardType={this.getKeypad.bind(this)()}
        placeholderText={this.props.attribute.label}
        value={this.state.value}
        style={inputStyle.textInput}
        onFocus={this.onFocus.bind(this)}
        onBlur={this.onBlur.bind(this)}
        onChangeText={this.onChangeText.bind(this)}
        {...this.props.extraProps} />
    );
  }
}

class Editor {
  editor(attribute, value, callback, extraProps = {}, inputId){
    switch (attribute.type) {
      case "datetime":
          return (
            <DatePicker
              date={value}
              mode="datetime"
              format="YYYY-MM-DD HH:mm"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateInput: inputStyle.dateInput,
                dateIcon: inputStyle.dateIcon
              }}
              onDateChange={(datetime) => {
              callback(attribute.id, new moment(datetime));
            }}
          />);
        break;
      case "product":
        return (<FishPicker
                  onChange={(value) => {
                    callback(attribute.id, value);
                  }}
                  value={value}
                  name={attribute.id}
                  inputId={inputId}
                  {...extraProps}
                />);
      case "location":
        break;
      case "bool":
        return (<Switch
                  onValueChange={(bool) => callback(attribute.id, bool)}
                  value={value || false} />);
      case "number":
      case "float":
      default:
        return (
          <EditOnBlur
            attribute={attribute}
            value={value}
            callback={callback}
            extraProps={extraProps}
            inputId={inputId}
            {...extraProps}
          />
        );
    }
  }
}

export default Editor;
