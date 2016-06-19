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
import {connect} from 'react-redux';
import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import FishingEventActions from '../actions/FishingEventActions';
import FishingEventList from './FishingEventList';
import ProductDetailEditor from './ProductDetailEditor';
import FishingEventEditor from './FishingEventDetailEditor';
const detailTabs = ["details", "catches", "custom"];

const fishingEventActions = new FishingEventActions();

class Dashboard extends Component {
    constructor(props){
        super(props);
        this.state = {
          selectedTab: "catches",
          selectedDetail: 1,
          notifCount: 2,
          presses: 0,
          ds: new ListView.DataSource({rowHasChanged: (r1, r2) => r1.id !== r2.id}),
        };
    }
    renderContent(color: string, pageText: string, num?: number) {
      return (
        <View style={[styles.tabContent, {backgroundColor: color}]}>
          <Text style={styles.tabText}>{pageText}</Text>
          <Text style={styles.tabText}>{num} reRenders of the {pageText}</Text>
        </View>
      );
    }

    startFishingEvent(){
      this.props.dispatch(fishingEventActions.startFishingEvent());
    }

    getPrimaryActionColor(){
      return "#2d74fa";
    }

    getPrimaryActionText(){
      return "Haul";
    }

    getPrimaryActionIcon(){
      return false  ? "arrow-circle-up" : "arrow-circle-down";
    }

    getTripTab(){
      return {iconName: "anchor", selectedIconName: "ship", title: "Stop", selectedTab: "start", render: this.renderContent.bind(this)};
    }

    renderTabs(){
      const tabs = [
        {iconName: "calendar-check-o", title: "Catches", selectedTab: 'catches', render: this.renderCatches.bind(this)},
        {iconName: "wpforms", title: "Forms", selectedTab: 'form', render: this.renderContent.bind(this)},
        {iconName: "user", title: "Profile", selectedTab: 'profile', render: this.renderContent.bind(this)},
      ]
      tabs.unshift(this.getTripTab());
      return tabs.map((tab)=>{
        return (<Icon.TabBarItemIOS
                  key={tab.selectedTab}
                  iconName={tab.iconName}
                  selectedIconName={tab.selectedIconName || tab.iconName}
                  title={tab.title}
                  selected={this.state.selectedTab === tab.selectedTab}
                  onPress={() => {
                    this.setState({
                      selectedTab: tab.selectedTab
                    });
                  }}>
                  {tab.render()}
                </Icon.TabBarItemIOS>);
      });
    }

    renderDetailView(){
      switch (this.state.selectedDetail) {
        case 0:
          return (<FishingEventEditor />);
        break;
        case 1:
          let id = this.props.viewingFishingEventId;
          let products = id ? this.props.fishingEvents[id - 1].products : [];
          return (<ProductDetailEditor
                    products={products}
                  />);
        break;
        case 2:
          return (<View></View>);
        break;
      }
    }

    renderCatches() {
      return (
        <View style={[styles.container]}>
          <View style={[styles.toolbar]}>
            <View style={[styles.toolbarLeft]}>
              <TouchableOpacity
                style={[styles.buttonWrapper]}
                >
                <View>
                  <Icon.Button
                    name={this.getPrimaryActionIcon()}
                    onPress={this.startFishingEvent.bind(this)}
                    style={[styles.toolbarButton, styles.primaryActionButton, {backgroundColor: this.getPrimaryActionColor()}]}>
                    {this.getPrimaryActionText()}
                  </Icon.Button>
                </View>
              </TouchableOpacity>
              <View style={[styles.toolbarInfoPanel]}>
                <Text style={[styles.textBase, styles.toolbarPanelLabel, styles.Sexagesimal]}>
                  {'66° 30′ 360″ N'}
                </Text>
                <Text style={[styles.textBase, styles.toolbarPanelLabel, styles.Sexagesimal]}>
                  {'122° 1′ 30″ W'}
                </Text>
              </View>
            </View>
            <View style={[styles.toolbarRight]}>
              <View style={[styles.buttonWrapper]}>
                <Icon.Button
                  name="stop-circle-o"
                  backgroundColor="red"
                  style={[styles.toolbarButton, styles.secondaryActionButton]}>
                  Cancel
                </Icon.Button>
              </View>
            </View>
          </View>

          <View style={[styles.masterDetailView]}>
            <View style={[styles.masterView]}>
              <FishingEventList
                dispatch={this.props.dispatch}
                fishingEvents={this.state.ds.cloneWithRows([...this.props.fishingEvents].reverse())}
                fishingEventType={this.props.fishingEventType}
              />
            </View>
            <View style={[styles.detailView]}>
              <SegmentedControlIOS
                values={detailTabs}
                selectedIndex={this.state.selectedDetail}
                onChange={({nativeEvent}) => {
                  this.setState({selectedDetail: nativeEvent.selectedSegmentIndex});
                }} />
                <View style={styles.headingWrapper}>
                  <Text style={styles.heading}>{this.props.viewingFishingEventId ? "Editing Shot: " + this.props.viewingFishingEventId : ""}</Text>
                </View>
                {this.renderDetailView()}
            </View>
          </View>
        </View>
      );
    }

    render () {
      return (
        <TabBarIOS
          unselectedTintColor="#ccc"
          tintColor="white"
          barTintColor="#2d74fa">
          {this.renderTabs()}
        </TabBarIOS>
      );
    }
};

const styles = StyleSheet.create({
  textBase: {
    color: '#333333',
  },

  toolbar: {
    flexDirection: 'row',
    paddingTop: 30,
    paddingBottom: 20,
    paddingLeft: 20,
    paddingRight: 20,
  },

  headingWrapper: {
    marginTop: 15,
    flexDirection:'row',
    height: 25
  },
  heading:{
    fontSize: 19,
    fontWeight: 'bold'
  },

  toolbarLeft: {
    flexDirection: 'row',
    flex: 0.89
  },

  toolbarRight: {
    flex: 0.11,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },

  toolbarButton: {
    padding: 15
  },

  toolbarInfoPanel: {
    flexDirection: 'column',
    marginLeft: 15
  },

  buttonWrapper: {
    marginRight: 15,
  },

  masterDetailView: {
    flex: 1,
    paddingTop: 0,
    flexDirection: 'row',
  },

  masterView: {
    flex: 0.25,
    alignItems: 'flex-start',
  },

  detailView: {
    flex: 0.75,
    paddingTop: 20,
    paddingRight: 20,
    paddingLeft: 20,
  },

  listRowItemNarrow: {
    width: 35
  },

  selectedListRow: {
    backgroundColor: '#2d74fa',
  },

  selectedListRowItem: {
    color: '#eee',
    fontWeight: 'bold',
    width: 65
  },

  selectedListRowItemNarrow: {
    color: '#eee',
    fontWeight: 'bold',
    width: 35
  },
});


const select = (State, dispatch) => {
    let state = State.default;
    return {
      fishingEvents: state.fishingEvents.events,
      viewingFishingEventId: state.view.viewingFishingEventId,
      fishingEventType: state.me.user.fishingEventType
    };
}

export default connect(select)(Dashboard);
