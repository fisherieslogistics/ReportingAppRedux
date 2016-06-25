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
class Toolbar extends React.Component {
    renderButton(button){
      console.log(button)
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
            {this.renderButton(this.props.buttons.left)}
          </View>
          <View style={[styles.centerLeft]}>
            {this.renderButton(this.props.buttons.center)}
          </View>
          <View style={[styles.centerRight]}>
            <Text style={styles.text}>{this.props.text}</Text>
          </View>
          <View style={[styles.right]}>
            {this.renderButton(this.props.buttons.right)}
          </View>
        </View>
      );
    }
};

const styles = StyleSheet.create({
  toolbar:{
     backgroundColor: "#eceef0",
     flexDirection: 'row',
     flex: 1
   },
   left: {
     alignSelf: 'stretch',
     flex: 0.3,
     borderRightColor: "#E0E0E0",
     borderRightWidth: 2,
     alignItems: 'flex-start'
   },
   right:{
     alignSelf: 'stretch',
     flex: 0.3,
     alignItems: 'flex-end'
   },
   centerLeft:{
     alignSelf: 'stretch',
     flex: 0.2,
   },
   centerRight:{
     alignSelf: 'stretch',
     flex: 0.2,
     alignItems: 'center'
   },
   text: {
     alignSelf: 'center',
     marginTop: 25,
     fontSize: 18,
     fontWeight: "300"
   },
   button: {
     marginTop: 28,
     fontSize: 17,
     marginLeft: 16,
     marginRight: 16,
     fontWeight: "300"
   }
});

module.exports = Toolbar;
