'use strict';
'use strict';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TouchableHighlight,
  SegmentedControlIOS,
  TabBarIOS,
  TextInput,
  ListView,
  Dimensions
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
var {height, width} = Dimensions.get('window');
class DetailToolbar extends React.Component {
    renderButton(button){
      return (
          <TouchableOpacity onPress={button.onPress}>
            <Text style={[styles.button, {color: button.color}]}>{button.text}</Text>
          </TouchableOpacity>
      );
    }
    render() {
      return (
        <View style={[styles.toolbar]}>
          <View style={[styles.left]}>
            {this.renderButton(this.props.left)}
          </View>
          <View style={[styles.right]}>
            {this.renderButton(this.props.right)}
          </View>
        </View>
      );
    }
};

const styles = StyleSheet.create({
   toolbar:{
     backgroundColor: "#F9F9F9",
     flexDirection: 'row',
     flex: 0.1
   },
   left: {
     alignSelf: 'stretch',
     flex: 0.5,
     alignItems: 'flex-start'
   },
   right:{
     alignSelf: 'stretch',
     flex: 0.5,
     alignItems: 'flex-end'
   },
   button: {
     marginTop: 28,
     fontSize: 20,
     marginLeft: 16,
     marginRight: 16,
     fontWeight: "500"
   }
});

module.exports = DetailToolbar;
