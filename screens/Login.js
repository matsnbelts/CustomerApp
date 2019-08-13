import React, { Component } from 'react'
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, StyleSheet } from 'react-native'

import { Button, Block, Input, Text } from '../components';
import { theme } from '../constants';

const VALID_EMAIL = "";
const VALID_PASSWORD = "";

export default class Login extends Component {
  state = {
    email: '7022268034',
    password: '',
    errors: [],
    loading: false,
    otp_text: 'Get OTP',
    loading_otp: false
  }

  handleLogin() {
    const { navigation } = this.props;
    const { email, password } = this.state;
    const errors = [];

    Keyboard.dismiss();
    this.setState({ loading: true });

    // check with backend API or with some static data
    if (email.length !=10) {
      errors.push('email');
    }
    if (password !== VALID_PASSWORD) {
      errors.push('password');
    }
    setTimeout(
        () => { this.setState({ errors, loading: false });},
        2000
      )
    

    if (!errors.length) {
      navigation.navigate("Browse", {customer: this.state.email});
    }
  }

  handleotp() {
    const { navigation } = this.props;
    const { email, password } = this.state;
    const errors = [];

    Keyboard.dismiss();
    this.setState({ loading_otp: true });

    // check with backend API or with some static data
    if (email.length != 10) {
      errors.push('email');
    }
    setTimeout(
      () => { this.setState({ errors, loading_otp: false });},
      2000
    )

  }

  render() {
    const { navigation } = this.props;
    const { loading, errors, loading_otp } = this.state;
    const hasErrors = key => errors.includes(key) ? styles.hasErrors : null;

    return (
      <KeyboardAvoidingView style={styles.login} behavior="padding">
        <Block padding={[0, theme.sizes.base * 2]}>
          <Text h1 bold>Login</Text>
          <Block middle>
            <Input
              label="Phone Number"
              error={hasErrors('email')}
              style={[styles.input, hasErrors('email')]}
              defaultValue={this.state.email}
              onChangeText={text => this.setState({ email: text })}
            />
          <Button gradient onPress={() => this.handleotp()}>
          {loading_otp ?
          <ActivityIndicator size="small" color="white" /> : 
          <Text bold white center>{this.state.otp_text}</Text>
          }
          </Button>
            <Input
              secure
              label="One Time Password"
              error={hasErrors('password')}
              style={[styles.input, hasErrors('password')]}
              defaultValue={this.state.password}
              onChangeText={text => this.setState({ password: text })}
            />
            <Button gradient onPress={() => this.handleLogin()}>
              {loading ?
                <ActivityIndicator size="small" color="white" /> : 
                <Text bold white center>Login</Text>
              }
            </Button>
          </Block>
        </Block>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  login: {
    flex: 1,
    justifyContent: 'center',
  },
  input: {
    borderRadius: 0,
    borderWidth: 0,
    borderBottomColor: theme.colors.gray2,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  hasErrors: {
    borderBottomColor: theme.colors.accent,
  }
})
