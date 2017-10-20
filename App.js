import React, { Component } from "react";
import Expo from "expo";
import HomeScreen from "./src/screens/HomeScreen";
import firebase from 'firebase'
export default class AwesomeApp extends Component {
  constructor() {
    super();
    this.state = {
      isReady: false
    };
  }
  async componentWillMount() {
    await Expo.Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("native-base/Fonts/Ionicons.ttf")
    });
    firebase.initializeApp({
      apiKey: 'AIzaSyDhGIu6NAAoiKP7dDlQWW_lYzSyjkiEzUw',
      authDomain: 'gratitude-journal-4e837.firebaseapp.com',
      databaseURL: 'https://gratitude-journal-4e837.firebaseio.com',
      projectID: 'gratitude-journal-4e837',
      storageBucket: 'gratitude-journal-4e837.appspot.com',
      messagingSenderId: '1042511937609'
    })
    this.setState({ isReady: true });
  }
  render() {
    if (!this.state.isReady) {
      return <Expo.AppLoading />;
    }
    return <HomeScreen />;
  }
}