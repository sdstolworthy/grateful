import React from "react";
import { StatusBar, View } from "react-native";
import { Container, Header, Input, Title, Left, Icon, Right, Button, Body, Content, Text, Card, CardItem, Item } from "native-base";
import { Constants } from 'expo'
import { signInWithGoogleAsync } from '../../services/auth-service'
import StatusBumper from '../../components/StatusBumper'
import { connect } from 'react-redux'
class HomeScreen extends React.Component {
  static navigationOptions = {
    headerStyle: { paddingTop: 50 },
    title: 'Home'
  }
  login = () => {
    signInWithGoogleAsync().then(()=>{
      this.props.navigation.navigate('Journal', {})
    })
  }
  render () {
    return (
      <Container >
        <Header paddingTop={Constants.statusBarHeight} androidStatusBarColor="black">
          <Left />
          <Body>
            <Title>Hello</Title>
          </Body>
          <Right />
        </Header>
          <Button onPress={this.login}>
            <Text>Click me</Text>
          </Button>
      </Container>
    );
  }
}

export default connect(()=>({}),{})(HomeScreen)