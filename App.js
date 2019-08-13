console.disableYellowBox = true;
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppLoading, Asset } from 'expo';
import store from './store';
import Navigation from './navigation';
import { Block } from './components';
import Product from './screens/Product';
import Browse from './screens/Browse';
import {Provider} from 'react-redux'

const images = [
  require('./assets/icons/back.png'),
  require('./assets/images/car.png'),
  require('./assets/images/profile.png'),
  require('./assets/images/avatar.png'),
  require('./assets/images/welcome_image_1.png'),
  require('./assets/images/welcome_image_3.jpg'),
  require('./assets/images/welcome_image_5.jpg')
];

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  }

  handleResourcesAsync = async () => {

    const cacheImages = images.map(image => {
      return Asset.fromModule(image).downloadAsync();
    });

    return Promise.all(cacheImages);
  }

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this.handleResourcesAsync}
          onError={error => console.warn(error)}
          onFinish={() => this.setState({ isLoadingComplete: true })}
        />
      )
    }

    return (
      <Block white>
      <Provider store={store} >
        <Navigation />
      </Provider>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
});
