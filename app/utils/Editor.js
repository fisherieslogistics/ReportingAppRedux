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
  Dimensions,
  TextInput,
} from 'react-native';
import React from 'react';
import FishPicker from '../components/FishPicker';
import DatePicker from 'react-native-datepicker';
import inputStyle from '../styles/inputStyle';

class Editor {

  editor(attribute, value, callback, _style){
    switch (attribute.type) {
      case "datetime":
          if(!value){
            return null;
          }
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
                />);
      case "location":
        break;
      case "bool":
        return (<Switch
                  onValueChange={(bool) => callback(attribute.id, bool)}
                  value={value || false} />);
      default:
        return (<TextInput
                 clearTextOnFocus={true}
                 placeholderText={attribute.label}
                 onFocus={() => callback(attribute.id, "")}
                 defaultValue=""
                 value={value}
                 style={inputStyle.textInput}
                 onChangeText={text => callback(attribute.id, text)} />);
    }
  }
}

export default Editor;
