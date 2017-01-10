'use strict';
import {
  View,
  Text,
  ListView,
} from 'react-native';
import React from 'react';
import MasterListView from '../../components/common/MasterListView';
import { MasterToolbar, DetailToolbar } from './Toolbar';

import {shadowStyles, colors, iconStyles, masterDetailStyles, listViewStyles } from '../../styles/styles';
import { BigButton } from '../../components/common/Buttons';
import Icon8 from '../../components/common/Icon8';


const listTextStyle = {
  fontSize: 18,
};

const viewStyles = {
  marginLeft: 2,
  alignItems: 'flex-start',
  paddingTop: 5
};

const styles = {
  outerStyle: {
    padding: 0,
    margin: 0,
    flexDirection: 'column',
    flex: 1,
    alignItems: 'flex-start',
  },
  innerStyle: {
    padding: 0,
    margin: 0,
    flexDirection: 'row',
    height: 150,
  },
  midStyle: {
    alignItems: 'flex-start',
    marginTop: 25,
   },
}

const bgtop = { borderTopWidth: 1, borderTopColor: colors.midGray};
const bgleft = { borderLeftWidth: 1, borderLeftColor: colors.midGray};

const MasterDetail = ({ master, detail, masterToolbar, detailToolbar }) => (
  <View style={[masterDetailStyles.wrapper]}>
    <View style={[masterDetailStyles.row]}>
      <View style={[masterDetailStyles.master, shadowStyles.shadowRight]}>
        <View>
          { masterToolbar }
        </View>
        <View style={[masterDetailStyles.col,bgtop]}>
          { master }
        </View>
      </View>
      <View style={[masterDetailStyles.detail]}>
        <View style={[shadowStyles.shadowDown, bgleft]}>
          { detailToolbar }
        </View>
        <View style={[masterDetailStyles.col, masterDetailStyles.detail]}>
          { detail }
        </View>
      </View>
    </View>
  </View>
);

class MasterDetailView extends React.Component {

  constructor(props){
    super(props);
    this.onMasterButtonPress = this.onMasterButtonPress.bind(this);
    this.renderMasterListView = this.renderMasterListView.bind(this);
    this.getMasterDescription = this.getMasterDescription.bind(this);
    this.isDetailSelected = this.isDetailSelected.bind(this);
    this.masterListOnPress = this.masterListOnPress.bind(this);
    this.renderMasterIcon = this.renderMasterIcon.bind(this);
    this.renderDetailView = this.renderDetailView.bind(this);
    this.renderMasterToolbar = this.renderMasterToolbar.bind(this);
    this.renderDetailToolbar = this.renderDetailToolbar.bind(this);
    this.dsDetail = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      selectedDetail: 'a',
      icons: {
        a: 'user',
        b: 'fishing',
        c: 'fishing-boat-filled',
      },
      masterChoices: ['a', 'b', 'c']
    }
  }

  isDetailSelected(choice) {
    return choice === this.state.selectedDetail
  }

  getMasterDescription(choice) {
    const textColor = {
      color: this.isDetailSelected(choice) ? colors.white : colors.black,
    };

    return (
      <View
        style={ [listViewStyles.listRowItem, viewStyles] }
        key={`${choice}___Contact_Page` }>
        <Text style={ [listTextStyle, textColor] }>
          { choice }
        </Text>
      </View>
    );
  }

  renderMasterIcon(choice){
    const isSelected = this.isDetailSelected(choice);
    const iconName = this.state.icons[choice];
    let backgroundStyle = { backgroundColor: colors.blue, color: colors.white };
    if(isSelected){
      backgroundStyle = { backgroundColor: colors.white, color: colors.blue };
    }
    return (
      <Icon8
        name={iconName}
        size={30}
        color={"white"}
        style={[ iconStyles, backgroundStyle ]}
      />
    );
  }

  masterListOnPress(choice) {
    this.setState({
      selectedDetail: choice,
    });
  }

  renderDetailView(){
    return (<View />);
  }

  renderMasterListView() {
    return (
      <MasterListView
        getDescription={ this.getMasterDescription }
        isSelected={ this.isDetailSelected }
        onPress={ this.masterListOnPress }
        dataSource={ this.dsDetail.cloneWithRows(this.state.masterChoices) }
        getIcon={ this.renderMasterIcon }
      />
    );
  }

  renderMasterView(){
    const masterListView = this.renderMasterListView();
    return (
      <View style={[styles.outerStyle]}>
        <View style={[styles.innerStyle]}>
          { masterListView }
        </View>
      </View>
    );
  }

  onMasterButtonPress() {

  }

  renderMasterToolbar(text, backgroundColor, textColor) {
    const eventButton = (
      <BigButton
        text={text}
        backgroundColor={backgroundColor}
        textColor={textColor}
        onPress={this.onMasterButtonPress }
      />
    );
    return(
      <MasterToolbar
        center={eventButton}
      />
    );
  }

  renderDetailToolbar(){
    return (<DetailToolbar />);
  }

  getMasterDetailProps(){
    return {
      detail: this.renderDetailView(),
      master: this.renderMasterView(),
      detailToolbar: this.renderDetailToolbar(),
      masterToolbar: this.renderMasterToolbar(),
    }
  }

  render() {
    const { detail, master, masterToolbar, detailToolbar } = this.getMasterDetailProps();
    return (
      <MasterDetail
        detail={detail}
        master={master}
        detailToolbar={detailToolbar}
        masterToolbar={masterToolbar}
      />
    )
  }
}

export { MasterDetail };
export default MasterDetailView
