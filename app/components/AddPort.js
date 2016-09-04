'use strict';
import {
  StyleSheet,
  View,
  Text,
  AlertIOS,
  TextInput,
  PickerIOS,
} from 'react-native';

import React from 'react';
import colors from '../styles/colors';
import {textStyles, inputStyles} from '../styles/styles';
import {LongButton} from './common/Buttons';
import UserActions from '../actions/UserActions';
const userActions = new UserActions();
const PickerItemIOS = PickerIOS.Item;

class AddPort extends React.Component {

    constructor(props){
      super(props);
      let regions = Object.keys(this.props.ports);
      this.state = {
        selectedRegion: regions[0],
        newPortName: "",
        regions,
      }
    }

    render(){
      let pickerItems = [];
      let items = this.state.regions.map((region, index) => {
        return (
          <PickerItemIOS
            key={"region_" + region}
            value={region}
            label={region}
          />
        )
      });
      return (
        <View style={[{backgroundColor: "white", marginTop: 50,
                      flex: 1, alignSelf: 'stretch'}]}>
          <View>
            <View><Text style={[textStyles.font, {color: colors.blue }]}>Region</Text></View>
          </View>
          <View style={[]}>
            <PickerIOS
              style={[{backgroundColor: "#ffffff"}]}
              selectedValue={this.state.selectedRegion}
              onValueChange={(region) => {
                this.setState({selectedRegion: region});
              }}
            >
              {items}
            </PickerIOS>
            <Text style={[textStyles.font, {color: colors.blue }]}>Port</Text>
            <TextInput
              selectTextOnFocus={true}
              placeholder={"Port Name"}
              autoCorrect={false}
              autoCapitalize={'none'}
              value={this.state.newPortName}
              style={inputStyles.textInput, {backgroundColor: 'white', height: 50, alignSelf: 'stretch'}}
              onChangeText={(text) => {
                this.setState({
                  newPortName: text
                })
              }}
            />
          <LongButton
            text={"Save Port"}
            bgColor={colors.blue}
            _style={{alignSelf: 'center', marginTop: 20}}
            onPress={() => {
              AlertIOS.alert(
                "Add: " + this.state.newPortName + " to " + this.state.selectedRegion,
                "Is this correct? Click OK to save this port.",
                [
                  {text: 'Cancel', onPress: () => {
                    this.setState({
                      newPortName: "",
                    });
                  }, style: 'cancel'},
                  {text: 'OK', onPress: () => {
                    let portName = this.state.newPortName || "";
                    if(portName.length){
                      this.props.dispatch(userActions.addPort(this.state.selectedRegion,
                                          portName));
                    }
                    this.setState({
                      newPortName: "",
                    });
                  }}
                ]
              );
            }}
          />
        </View>
      </View>);
    }
};

const styles = StyleSheet.create({
  row:{
    flexDirection: 'row'
  },
  col: {
    flexDirection: 'column'
  },
});

module.exports = AddPort;
