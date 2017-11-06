import React, {
  Component
} from "react";
import { View } from 'react-native'
import HomeScreen from "./HomeScreen";
import JournalFeed from './JournalFeed'
import SideBar from "../components/SideBar.js";
import GratitudePrompt from '../screens/GratitudePrompt'
import Swiper from 'react-native-swiper'
import {
  StackNavigator
} from "react-navigation";
export const INDICES = {
  prompt: 0,
  feed: 1
}
class HomeSwiper extends Component {
  constructor (props) {
    super(props)
    this.state = {
      entry: {}
    }
  }
  updateSwiper = (index) => {
    this.refs.swiper.scrollBy(index, true)
    // console.log(this.refs)
    this.setState({index})
    console.warn(index)
  }
  selectEntry = (entry) => {
    this.setState({entry})
  }
  render () {
    return (
      <Swiper
        ref="swiper"
        showsButtons={false}
        horizontal={true}
        loop={false}
        showsPagination={false}
        index={this.state.index}
      >
        <View style={{ flex: 1 }}>
          <GratitudePrompt
            changeIndex={this.updateSwiper}
            entry={this.state.entry}
          />
        </View>
        <View style={{ flex: 1 }}>
          <JournalFeed
            changeIndex={this.updateSwiper}
            entry={this.state.entry}
            onChangeEntry={this.selectEntry}
          />
        </View>
      </Swiper>
    )
  }
}
const HomeScreenRouter = StackNavigator({
  Prompt: {
    screen: HomeSwiper
  },
  // Journal: {
  //   screen: JournalFeed
  // },
  // Home: {
  //   screen: HomeScreen,
  // },
}, {
    headerMode: 'none',
    contentComponent: props => < SideBar { ...props } />
    // contentComponent: () => <View/>
  });
export default HomeScreenRouter;