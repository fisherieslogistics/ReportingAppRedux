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

class Dashboard extends Component {
    constructor(props){
        super(props);
        this.state = {
          selectedTab: 'catches',
          notifCount: 2,
          presses: 0,
        };
    }
    _renderContent(color: string, pageText: string, num?: number) {
      return (
        <View style={[styles.tabContent, {backgroundColor: color}]}>
          <Text style={styles.tabText}>{pageText}</Text>
          <Text style={styles.tabText}>{num} re-renders of the {pageText}</Text>
        </View>
      );
    }

    _renderCatches() {
      return (
        <View style={[styles.container]}>
          <View style={[styles.toolbar]}>
            <View style={[styles.toolbarLeft]}>
              <View style={[styles.buttonWrapper]}>
                <Icon.Button
                  name="arrow-circle-up"
                  backgroundColor="#2d74fa"
                  style={[styles.toolbarButton, styles.primaryActionButton]}>
                  Haul
                </Icon.Button>
              </View>
              <View style={[styles.buttonWrapper]}>
                <Icon.Button
                  name="cloud-upload"
                  backgroundColor="#2d74fa"
                  style={[styles.toolbarButton, styles.secondaryActionButton]}>
                  Commit ( 3)
                </Icon.Button>
              </View>
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
              <ScrollView style={[styles.listView]}>
                <View style={[styles.listRow, styles.selectedListRow]}>
                  <Text style={[styles.selectedListRowItemNarrow]}>
                    <Icon name="circle-thin" size={16} color="white" />
                  </Text>
                  <Text style={[styles.selectedListRowItem]}>Shot 20</Text>
                  <Text style={[styles.selectedListRowItem]}>15:12</Text>
                  <Text style={[styles.selectedListRowItemNarrow]}>OCT</Text>
                </View>

                <View style={[styles.listRow, styles.listRowSelected]}>
                  <Text style={[styles.listRowItemNarrow]}>
                    <Icon name="exclamation-triangle" size={16} color="orange" />
                  </Text>
                  <Text style={[styles.listRowItem]}>Shot 19</Text>
                  <Text style={[styles.listRowItem]}>12:14</Text>
                  <Text style={[styles.listRowItemNarrow]}>OCT</Text>
                </View>

                <View style={[styles.listRow]}>
                  <Text style={[styles.listRowItemNarrow]}>
                    <Icon name="exclamation-triangle" size={16} color="orange" />
                  </Text>
                  <Text style={[styles.listRowItem]}>Shot 18</Text>
                  <Text style={[styles.listRowItem]}>10:13</Text>
                  <Text style={[styles.listRowItemNarrow]}>SNA</Text>
                </View>

                <View style={[styles.listRow]}>
                  <Text style={[styles.listRowItemNarrow]}>
                    <Icon name="check-circle" size={16} color="green" />
                  </Text>
                  <Text style={[styles.listRowItem]}>Shot 17</Text>
                  <Text style={[styles.listRowItem]}>09:13</Text>
                  <Text style={[styles.listRowItemNarrow]}>ELE</Text>
                </View>

                <View style={[styles.listRow]}>
                  <Text style={[styles.listRowItemNarrow]}>
                    <Icon name="check-circle" size={16} color="green" />
                  </Text>
                  <Text style={[styles.listRowItem]}>Shot 16</Text>
                  <Text style={[styles.listRowItem]}>08:07</Text>
                  <Text style={[styles.listRowItemNarrow]}>OCT</Text>
                </View>

                <View style={[styles.listRow]}>
                  <Text style={[styles.listRowItemNarrow]}>
                    <Icon name="check-circle" size={16} color="green" />
                  </Text>
                  <Text style={[styles.listRowItem]}>Shot 15</Text>
                  <Text style={[styles.listRowItem]}>06:53</Text>
                  <Text style={[styles.listRowItemNarrow]}>OCT</Text>
                </View>

                <View style={[styles.listRow]}>
                  <Text style={[styles.listRowItemCommitted, styles.listRowItemNarrow]}>
                    <Icon name="cloud" size={16} color="gray" />
                  </Text>
                  <Text style={[styles.listRowItem, styles.listRowItemCommitted]}>Shot 14</Text>
                  <Text style={[styles.listRowItem, styles.listRowItemCommitted]}>15:12</Text>
                  <Text style={[styles.listRowItemCommitted, styles.listRowItemNarrow]}>OCT</Text>
                </View>

                <View style={[styles.listRow, styles.listRowSelected]}>
                  <Text style={[styles.listRowItemCommitted, styles.listRowItemNarrow]}>
                    <Icon name="cloud" size={16} color="gray" />
                  </Text>
                  <Text style={[styles.listRowItem, styles.listRowItemCommitted]}>Shot 13</Text>
                  <Text style={[styles.listRowItem, styles.listRowItemCommitted]}>12:14</Text>
                  <Text style={[styles.listRowItemCommitted, styles.listRowItemNarrow]}>OCT</Text>
                </View>

                <View style={[styles.listRow]}>
                  <Text style={[styles.listRowItemCommitted, styles.listRowItemNarrow]}>
                    <Icon name="cloud" size={16} color="gray" />
                  </Text>
                  <Text style={[styles.listRowItem, styles.listRowItemCommitted]}>Shot 12</Text>
                  <Text style={[styles.listRowItem, styles.listRowItemCommitted]}>10:13</Text>
                  <Text style={[styles.listRowItemCommitted, styles.listRowItemNarrow]}>SNA</Text>
                </View>

                <View style={[styles.listRow]}>
                  <Text style={[styles.listRowItemCommitted, styles.listRowItemNarrow]}>
                    <Icon name="cloud" size={16} color="gray" />
                  </Text>
                  <Text style={[styles.listRowItem, styles.listRowItemCommitted]}>Shot 11</Text>
                  <Text style={[styles.listRowItem, styles.listRowItemCommitted]}>09:13</Text>
                  <Text style={[styles.listRowItemCommitted, styles.listRowItemNarrow]}>ELE</Text>
                </View>

                <View style={[styles.listRow]}>
                  <Text style={[styles.listRowItemCommitted, styles.listRowItemNarrow]}>
                    <Icon name="cloud" size={16} color="gray" />
                  </Text>
                  <Text style={[styles.listRowItem, styles.listRowItemCommitted]}>Shot 10</Text>
                  <Text style={[styles.listRowItem, styles.listRowItemCommitted]}>08:07</Text>
                  <Text style={[styles.listRowItemCommitted, styles.listRowItemNarrow]}>OCT</Text>
                </View>

                <View style={[styles.listRow]}>
                  <Text style={[styles.listRowItemCommitted, styles.listRowItemNarrow]}>
                    <Icon name="cloud" size={16} color="gray" />
                  </Text>
                  <Text style={[styles.listRowItem, styles.listRowItemCommitted]}>Shot 9</Text>
                  <Text style={[styles.listRowItem, styles.listRowItemCommitted]}>06:53</Text>
                  <Text style={[styles.listRowItemCommitted, styles.listRowItemNarrow]}>OCT</Text>
                </View>

                <View style={[styles.listRow]}>
                  <Text style={[styles.listRowItemCommitted, styles.listRowItemNarrow]}>
                    <Icon name="cloud" size={16} color="gray" />
                  </Text>
                  <Text style={[styles.listRowItem, styles.listRowItemCommitted]}>Shot 8</Text>
                  <Text style={[styles.listRowItem, styles.listRowItemCommitted]}>15:12</Text>
                  <Text style={[styles.listRowItemCommitted, styles.listRowItemNarrow]}>OCT</Text>
                </View>

                <View style={[styles.listRow, styles.listRowSelected]}>
                  <Text style={[styles.listRowItemCommitted, styles.listRowItemNarrow]}>
                    <Icon name="cloud" size={16} color="gray" />
                  </Text>
                  <Text style={[styles.listRowItem, styles.listRowItemCommitted]}>Shot 7</Text>
                  <Text style={[styles.listRowItem, styles.listRowItemCommitted]}>12:14</Text>
                  <Text style={[styles.listRowItemCommitted, styles.listRowItemNarrow]}>OCT</Text>
                </View>

                <View style={[styles.listRow]}>
                  <Text style={[styles.listRowItemCommitted, styles.listRowItemNarrow]}>
                    <Icon name="cloud" size={16} color="gray" />
                  </Text>
                  <Text style={[styles.listRowItem, styles.listRowItemCommitted]}>Shot 6</Text>
                  <Text style={[styles.listRowItem, styles.listRowItemCommitted]}>06:53</Text>
                  <Text style={[styles.listRowItemCommitted, styles.listRowItemNarrow]}>OCT</Text>
                </View>

                <View style={[styles.listRow]}>
                  <Text style={[styles.listRowItemCommitted, styles.listRowItemNarrow]}>
                    <Icon name="cloud" size={16} color="gray" />
                  </Text>
                  <Text style={[styles.listRowItem, styles.listRowItemCommitted]}>Shot 5</Text>
                  <Text style={[styles.listRowItem, styles.listRowItemCommitted]}>08:07</Text>
                  <Text style={[styles.listRowItemCommitted, styles.listRowItemNarrow]}>OCT</Text>
                </View>

                <View style={[styles.listRow]}>
                  <Text style={[styles.listRowItemCommitted, styles.listRowItemNarrow]}>
                    <Icon name="cloud" size={16} color="gray" />
                  </Text>
                  <Text style={[styles.listRowItem, styles.listRowItemCommitted]}>Shot 4</Text>
                  <Text style={[styles.listRowItem, styles.listRowItemCommitted]}>06:53</Text>
                  <Text style={[styles.listRowItemCommitted, styles.listRowItemNarrow]}>OCT</Text>
                </View>

                <View style={[styles.listRow]}>
                  <Text style={[styles.listRowItemCommitted, styles.listRowItemNarrow]}>
                    <Icon name="cloud" size={16} color="gray" />
                  </Text>
                  <Text style={[styles.listRowItem, styles.listRowItemCommitted]}>Shot 3</Text>
                  <Text style={[styles.listRowItem, styles.listRowItemCommitted]}>15:12</Text>
                  <Text style={[styles.listRowItemCommitted, styles.listRowItemNarrow]}>OCT</Text>
                </View>

                <View style={[styles.listRow, styles.listRowSelected]}>
                  <Text style={[styles.listRowItemCommitted, styles.listRowItemNarrow]}>
                    <Icon name="cloud" size={16} color="gray" />
                  </Text>
                  <Text style={[styles.listRowItem, styles.listRowItemCommitted]}>Shot 2</Text>
                  <Text style={[styles.listRowItem, styles.listRowItemCommitted]}>12:14</Text>
                  <Text style={[styles.listRowItemCommitted, styles.listRowItemNarrow]}>OCT</Text>
                </View>

                <View style={[styles.listRow]}>
                  <Text style={[styles.listRowItemCommitted, styles.listRowItemNarrow]}>
                    <Icon name="cloud" size={16} color="gray" />
                  </Text>
                  <Text style={[styles.listRowItem, styles.listRowItemCommitted]}>Shot 1</Text>
                  <Text style={[styles.listRowItem, styles.listRowItemCommitted]}>06:53</Text>
                  <Text style={[styles.listRowItemCommitted, styles.listRowItemNarrow]}>OCT</Text>
                </View>
              </ScrollView>
            </View>

            <View style={[styles.detailView]}>
              <SegmentedControlIOS values={['Details', 'Catches', 'Notes']} selectedIndex={1} />
              <ScrollView style={[styles.tableView]}>
                <View style={[styles.tableRow]}>
                  <View style={[styles.tableCell]}>
                    <Text>Species</Text>
                  </View>
                  <View style={[styles.tableCell]}>
                    <Text>Weight</Text>
                  </View>
                  <View style={[styles.tableCell]}>
                    <Text>S</Text>
                  </View>
                  <View style={[styles.tableCell]}>
                    <Text>M</Text>
                  </View>
                  <View style={[styles.tableCell]}>
                    <Text>L</Text>
                  </View>
                  <View style={[styles.tableCell]}>
                    <Text>XL</Text>
                  </View>
                  <View style={[styles.tableCell]}>
                    <Text>Discard</Text>
                  </View>
                </View>

                <View style={[styles.tableRow]}>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="" style={[styles.textInput]} />
                  </View>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="0" style={[styles.textInput]} />
                  </View>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="0" style={[styles.textInput]} />
                  </View>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="0" style={[styles.textInput]} />
                  </View>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="0" style={[styles.textInput]} />
                  </View>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="0" style={[styles.textInput]} />
                  </View>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="0" style={[styles.textInput]} />
                  </View>
                </View>

                <View style={[styles.tableRow]}>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="" style={[styles.textInput]} />
                  </View>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="0" style={[styles.textInput]} />
                  </View>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="0" style={[styles.textInput]} />
                  </View>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="0" style={[styles.textInput]} />
                  </View>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="0" style={[styles.textInput]} />
                  </View>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="0" style={[styles.textInput]} />
                  </View>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="0" style={[styles.textInput]} />
                  </View>
                </View>

                <View style={[styles.tableRow]}>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="" style={[styles.textInput]} />
                  </View>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="0" style={[styles.textInput]} />
                  </View>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="0" style={[styles.textInput]} />
                  </View>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="0" style={[styles.textInput]} />
                  </View>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="0" style={[styles.textInput]} />
                  </View>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="0" style={[styles.textInput]} />
                  </View>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="0" style={[styles.textInput]} />
                  </View>
                </View>

                <View style={[styles.tableRow]}>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="" style={[styles.textInput]} />
                  </View>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="0" style={[styles.textInput]} />
                  </View>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="0" style={[styles.textInput]} />
                  </View>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="0" style={[styles.textInput]} />
                  </View>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="0" style={[styles.textInput]} />
                  </View>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="0" style={[styles.textInput]} />
                  </View>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="0" style={[styles.textInput]} />
                  </View>
                </View>

                <View style={[styles.tableRow]}>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="" style={[styles.textInput]} />
                  </View>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="0" style={[styles.textInput]} />
                  </View>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="0" style={[styles.textInput]} />
                  </View>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="0" style={[styles.textInput]} />
                  </View>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="0" style={[styles.textInput]} />
                  </View>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="0" style={[styles.textInput]} />
                  </View>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="0" style={[styles.textInput]} />
                  </View>
                </View>


                <View style={[styles.tableRow]}>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="" style={[styles.textInput]} />
                  </View>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="0" style={[styles.textInput]} />
                  </View>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="0" style={[styles.textInput]} />
                  </View>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="0" style={[styles.textInput]} />
                  </View>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="0" style={[styles.textInput]} />
                  </View>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="0" style={[styles.textInput]} />
                  </View>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="0" style={[styles.textInput]} />
                  </View>
                </View>

                <View style={[styles.tableRow]}>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="" style={[styles.textInput]} />
                  </View>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="0" style={[styles.textInput]} />
                  </View>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="0" style={[styles.textInput]} />
                  </View>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="0" style={[styles.textInput]} />
                  </View>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="0" style={[styles.textInput]} />
                  </View>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="0" style={[styles.textInput]} />
                  </View>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="0" style={[styles.textInput]} />
                  </View>
                </View>

                <View style={[styles.tableRow]}>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="" style={[styles.textInput]} />
                  </View>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="0" style={[styles.textInput]} />
                  </View>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="0" style={[styles.textInput]} />
                  </View>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="0" style={[styles.textInput]} />
                  </View>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="0" style={[styles.textInput]} />
                  </View>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="0" style={[styles.textInput]} />
                  </View>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="0" style={[styles.textInput]} />
                  </View>
                </View>

                <View style={[styles.tableRow]}>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="" style={[styles.textInput]} />
                  </View>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="0" style={[styles.textInput]} />
                  </View>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="0" style={[styles.textInput]} />
                  </View>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="0" style={[styles.textInput]} />
                  </View>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="0" style={[styles.textInput]} />
                  </View>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="0" style={[styles.textInput]} />
                  </View>
                  <View style={[styles.tableCell]}>
                    <TextInput clearTextOnFocus={true} defaultValue="0" style={[styles.textInput]} />
                  </View>
                </View>

              </ScrollView>
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

          <Icon.TabBarItemIOS
            iconName="anchor"
            selectedIconName="ship"
            title="Stop"
            selected={this.state.selectedTab === 'start'}
            onPress={() => {
              this.setState({
                selectedTab: 'start'
              });
            }}>
            {this._renderContent('#414A8C', 'start')}
          </Icon.TabBarItemIOS>

          <Icon.TabBarItemIOS
            iconName="calendar-check-o"
            title="Catches"
            selected={this.state.selectedTab === 'catches'}
            onPress={() => {
              this.setState({
                selectedTab: 'catches'
              });
            }}>
            {this._renderCatches()}
          </Icon.TabBarItemIOS>

          <Icon.TabBarItemIOS
            iconName="wpforms"
            title="Forms"
            badge={this.state.notifCount > 0 ? this.state.notifCount : undefined}
            selected={this.state.selectedTab === 'forms'}
            onPress={() => {
              this.setState({
                selectedTab: 'form',
                notifCount: this.state.notifCount + 1
              });
            }}>
            {this._renderContent('#783E33', 'Forms', this.state.notifCount)}
          </Icon.TabBarItemIOS>

          <Icon.TabBarItemIOS
            iconName="user"
            title="Profile"
            selected={this.state.selectedTab === 'profile'}
            onPress={() => {
              this.setState({
                selectedTab: 'profile',
                presses: this.state.presses + 1
              });
            }}>
            {this._renderContent('#414A8C', 'Profile', this.state.presses)}
          </Icon.TabBarItemIOS>
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

  toolbarLeft: {
    flexDirection: 'row',
    flex: 0.89
  },

  toolbarRight: {
    flex: 0.11,
    flexDirection: 'row',
    alignItems: 'flex-end',
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

  listRow: {
    flexDirection: 'row',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderRightColor: '#ccc',
    borderRightWidth: 1,
  },

  listRowItem: {
    paddingRight: 10,
    width: 65
  },

  listRowItemCommitted: {
    color: 'gray'
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

  tableView: {
    marginTop: 20,
  },

  tableRow: {
    flexDirection: 'row',
    paddingBottom: 20,
  },

  tableCell: {
    width: 105,
  },

  textInput: {
    borderColor: 'gray',
    borderWidth: 1,
    height: 30,
    width: 80,
    paddingLeft: 10,
  }
});


const select = (_state, dispatch) => {
    let state = _state.default;
    return {
    };
}

export default connect(select)(Dashboard);
