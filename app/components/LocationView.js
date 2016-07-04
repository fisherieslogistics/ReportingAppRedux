'use strict';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import React from 'react';
import DatePicker from 'react-native-datepicker';
import moment from 'moment';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import Helper from '../utils/Helper';
const helper = new Helper();

class LocationView extends React.Component {
    render() {
      let location=helper.formatLocation(this.props.location.location);
      let timeAgo = helper.timeAgo(this.props.location.lastUpdated);
      return (
        <View style={[textStyles.font, styles.wrapper]}>
          <View>
            <Text style={[textStyles.font, styles.sexagesimal]}>
              {`Lat - ${location.lat}`}
            </Text>
            <Text style={[textStyles.fontstyles.sexagesimal]}>
              {`Long - ${location.lon}`}
            </Text>
            <Text style={[textStyles.font]}>
              {`Updated - ${timeAgo}`}
            </Text>
          </View>
        </View>
      );
    }
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    alignItems: 'center'
  }
});

const select = (State, dispatch) => {
    let state = State.default;
    return {
      location: state.location
    };
}

module.exports = connect(select)(LocationView);
