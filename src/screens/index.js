import React, {
  Component
} from "react";
import { View } from 'react-native'
import HomeScreen from "./HomeScreen";
import JournalFeed from './JournalFeed'
import SideBar from "../components/SideBar.js";
import GratitudePrompt from '../screens/GratitudePrompt'

import {
  DrawerNavigator
} from "react-navigation";
const HomeScreenRouter = DrawerNavigator({
  Prompt: {
    screen: GratitudePrompt
  },
  Journal: {
    screen: JournalFeed
  },
  // Home: {
  //   screen: HomeScreen,
  // },
}, {
  headerMode: 'none',
  contentComponent: props => < SideBar { ...props }/>
  // contentComponent: () => <View/>
});
export default HomeScreenRouter;