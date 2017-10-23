import React, {
  Component
} from "react";
import HomeScreen from "./HomeScreen/HomeScreen";
import JournalFeed from './JournalFeed/JournalFeed'
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
  Home: {
    screen: HomeScreen,
  },
}, {
  contentComponent: props => < SideBar { ...props }
  />
});
export default HomeScreenRouter;