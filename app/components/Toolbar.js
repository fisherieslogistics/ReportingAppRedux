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
    renderButton({onPress, iconName, color, text}){
      return (
        <View style={{paddingLeft: 15, paddingRight: 15}}>
          <TouchableOpacity
            >
            <View>
              <Icon.Button
                name={iconName}
                onPress={onPress}
                style={[{backgroundColor: color, height: 50}]}>
                {text}
              </Icon.Button>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
    render() {
      let button1 = this.props.primaryButton ? this.renderButton(this.props.primaryButton) : null;
      let button2 = this.props.secondaryButton ? this.renderButton(this.props.secondaryButton) : null;
      return (
        <View style={[styles.toolbar]}>
          <View style={[styles.toolbarSection, styles.left]}>
            {button1}
          </View>
          <View style={[styles.toolbarSection, styles.center]}>
            {this.props.infoPanel}
          </View>
          <View style={[styles.toolbarSection, styles.right]}>
            {button2}
          </View>
        </View>
      );
    }
};

const styles = StyleSheet.create({
  toolbar:{
       marginTop: 15,
       flexWrap: 'wrap',
       flex: 1,
       paddingRight: 20
   },
   toolbarSection:{
       height: 60,
   },
   left: {
     alignSelf: 'flex-start',
     paddingRight: 20,
     width: width * 0.25,
   },
   right:{
     alignSelf: 'flex-end',
     paddingLeft: 20,
     width: width * 0.25,
   },
   center:{
     alignSelf: 'center',
     width: width * 0.5,
   }
});

module.exports = Toolbar;
