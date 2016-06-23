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

class Editor {

  editor(attribute, value, callback, styles){
    let validStyle = {}
    if(attribute.valid && attribute.valid.func(value) !== true){
        validStyle = styles.invalid;
    }
    switch (attribute.type) {
      case "datetime":
          if(!value){
            return (<Text>{"   "}</Text>)
          }
          return (<DatePicker
            style={[{width: 200}]}
            date={value}
            mode="datetime"
            format="YYYY-MM-DD HH:mm"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            onDateChange={(datetime) => {
              callback(attribute.id, new moment(datetime));
            }}
          />);
        break;
      case "product":
        return (<FishPicker
                  style={validStyle}
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
                 onFocus={() => callback(attribute.id, "")}
                 defaultValue=""
                 style={[styles.textInput, validStyle]}
                 value={value}
                 onChangeText={text => callback(attribute.id, text)} />);
    }
  }
}

export default Editor;
