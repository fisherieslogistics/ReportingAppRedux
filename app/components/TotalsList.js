'use strict';
import{
  View,
  Text,
  ListView,
  Image
} from 'react-native';
import React from 'react';
import Helper from '../utils/Helper';
import colors from '../styles/colors.js';
const helper = new Helper();
import MasterListView from './common/MasterListView';
import styles from '../styles/listView';
import textStyles from '../styles/text';

class FishingEventList extends React.Component {

    isSelected(code){
      return false;
    }

    getDescription(total, sectionID, rowID) {
      let code = (total.code || "").toUpperCase();
      let textStyle = this.isSelected(total) ? textStyles.active : textStyles.dark;
      let details = [
        {text: code, style: [textStyles.black, styles.text, styles.detail, {marginLeft: 12}]},
        {text: total.weight, style: [textStyle, styles.detail, styles.text]}
      ];

      return details.map((detail, i) => {
        return (
        <View style={[textStyles.font, styles.listRowItemNarrow]} key={"eventDetail" + i}>
          <Text style={[textStyles.font, detail.style]}>
            {detail.text}
          </Text>
        </View>);
      });
    }

    render () {
      return (
        <MasterListView
          getDescription={this.getDescription.bind(this)}
          isSelected={this.isSelected.bind(this)}
          onPress={this.props.onPress}
          dataSource={this.props.data}
          getIcon={() => null}
        />
      );
    }
};

export default FishingEventList;
