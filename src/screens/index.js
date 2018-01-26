import React, {
  Component
} from "react";
import { View } from 'react-native'
import HomeScreen from "./HomeScreen";
import JournalFeed from './JournalFeed'
import SideBar from "../components/SideBar.js";
import GratitudePrompt from '../screens/GratitudePrompt'
import Swiper from 'react-native-swiper'
import { connect } from 'react-redux'
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
      index: 0,
      entry: {}
    }
    this.swiperRef = swiper => {
      this.swiper = swiper
    }
  }
  updateSwiper = (index, entry = {}) => {
    let currentIndex = this.state.index
    let resultSlide = undefined
    let countSlides = 2
    this.setState({
      entry,
      isUpdate: Object.keys(entry).length > 0
    })
    if (index > currentIndex && index !== countSlides) {
      resultSlide = index - currentIndex;
      this.swiper.scrollBy(resultSlide, true);
    }
    else if (index > currentIndex && index === countSlides) {
      resultSlide = currentIndex + 1;
      this.swiper.scrollBy(resultSlide, true);
    }
    else if (index < currentIndex && index !== 0) {
      resultSlide = (currentIndex - index) * (-1);
      this.swiper.scrollBy(resultSlide, true);
    }
    else if (index < currentIndex && index === 0) {
      resultSlide = currentIndex * (-1);
      this.swiper.scrollBy(resultSlide, true);
    }
  }
  selectEntry = (entry) => {
    this.setState({ 
      entry,
    })
  }
  render () {
    return (
      <Swiper
        ref={this.swiperRef}
        showsButtons={false}
        horizontal={true}
        loop={false}
        showsPagination={false}
        onIndexChanged={(index)=>this.setState({index})}
      >
        <View style={{ flex: 1 }}>
          <GratitudePrompt
            isUpdate={this.state.isUpdate}
            changeIndex={this.updateSwiper}
            entry={this.state.entry}
            onChangeEntry={this.selectEntry}
            navigation={this.props.navigation}
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
  Login: {
    screen: HomeScreen
  },
  Prompt: {
    screen: HomeSwiper
  },
}, {
    headerMode: 'none',
  });

mstp = ({Journals}) => ({
  providerConnected: Journals.providerConnected,
  loading: Journals.loading
})
export default HomeScreenRouter;