import React from "react";
import { StatusBar, View } from "react-native";
import { Container, Header, Input, Title, Left, Icon, Right, Button, Body, Content, Text, Card, CardItem, Item } from "native-base";
import { Constants } from 'expo'
import { signInWithGoogleAsync } from './service'
import StatusBumper from '../../components/StatusBumper'
export default class HomeScreen extends React.Component {
  static navigationOptions = {
    headerStyle: { paddingTop: 50 }
  }
  render () {
    console.log(Constants.statusBarHeight)
    return (
      <Container >
        {<StatusBumper />}
        <Header paddingTop={Constants.statusBarHeight} androidStatusBarColor="black">
          <Left />
          <Body>
            <Title>Hello</Title>
          </Body>
          <Right />
        </Header>
          {/* <Item style={{paddingHorizontal:10}}>
            <Icon active name="md-person" />
            <Input placeholder="Username" />
          </Item>
          <Item style={{paddingHorizontal:10}}>
            <Icon active name="key" />
            <Input secureTextEntry placeholder="Password" />
          </Item> */}
          <Button onPress={signInWithGoogleAsync}>
            <Text>Click me</Text>
          </Button>
      </Container>
    );
  }
}