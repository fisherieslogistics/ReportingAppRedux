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
  ListView
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

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
            {this.props.left ? this.renderButton(this.props.left) : null}
          </View>
          <View style={styles.center}>
            <View style={[styles.centerTop]}>
              {this.props.centerTop}
            </View>
            <View style={[styles.centerBottom]}>
              {this.props.centerBottom}
            </View>
          </View>
          <View style={[styles.right]}>
            {this.props.right ? this.renderButton(this.props.right) : null}
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
     flex: 0.2,
     alignItems: 'flex-start'
   },
   right:{
     alignSelf: 'stretch',
     flex: 0.2,
     alignItems: 'flex-end'
   },
   center:{
     paddingTop: 15,
     flex: 0.6,
     alignItems: 'center',
   },
   centerTop:{
     flex: 0.4,
   },
   centerBottom:{
     flex: 0.6,
     alignItems: 'center'
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
