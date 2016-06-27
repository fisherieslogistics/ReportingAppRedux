'use strict';
import {
  View,
  TabBarIOS,
  StyleSheet,
  Dimensions,
} from 'react-native';
import React, { Component } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import Fishing from '../components/Fishing';
import {connect} from 'react-redux';
import AutoSuggestBar from '../components/AutoSuggestBar';

class ReportingApp extends Component {

  constructor(props){
    super(props);
    this.state = {
      selectedTab: "fishing"
    }
  }

  renderTabs(){
    const tabs = [
      {iconName: "anchor", title: "trip", selectedTab: "ship", render: this.renderTrip.bind(this)},
      {iconName: "ship", title: "fishing", selectedTab: "fishing", render: this.renderFishing.bind(this)},
      {iconName: "tasks", title: "forms", selectedTab: "forms", render: this.renderForms.bind(this)},
      {iconName: "user", title: "profile", selectedTab:"profile", render: this.renderFishing.bind(this)}
    ];
    return tabs.map((tab)=>{
      return (<Icon.TabBarItemIOS
                style={styles.toEdges}
                key={tab.selectedTab}
                iconName={tab.iconName}
                selectedIconName={tab.iconName}
                title={tab.title}
                iconSize={22}
                selected={this.state.selectedTab === tab.selectedTab}
                onPress={() => {
                  if(tab.onPress){
                    tab.onPress();
                  }
                  this.setState({
                    selectedTab: tab.selectedTab
                  });
                }}>
                {tab.render()}
              </Icon.TabBarItemIOS>);
    });
  }


  renderProfile(){
    return (
      <View style={[styles.col]}>
            <Fishing />
      </View>
    )
  }

  renderTrip(){
    return (
      <View style={[styles.col]}>
            <Fishing />
      </View>
    )
  }

  renderForms(){
    return (
      <View style={[styles.col]}>
            <Fishing />
      </View>
    )
  }

  renderFishing(){
    return (
      <Fishing />
    )
  }

  render(){
    var {height, width} = Dimensions.get('window');
    return (
      <View style={[styles.wrapper, {width: width, height: height}]>
        <TabBarIOS
          unselectedTintColor="#bbbbbb"
          tintColor="#007aff"
          barTintColor="#F9F9F9"
        >
          {this.renderTabs.bind(this)()}
        </TabBarIOS>
        <AutoSuggestBar />
      </View>
    );
  }
}

const select = (State, dispatch) => {
    let state = State.default;
    return {
      fishingEvents: state.fishingEvents.events
    };
}

const styles = StyleSheet.create({
  wrapper: {
    left: 0,
    top: 0
  },
  toEdges:{
    position: 'absolute',
    left: 0,
    bottom: 0,
  },
});

export default ReportingApp
