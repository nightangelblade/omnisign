
import React, { Component } from 'react';
import {
  ActionSheetIOS,
  StyleSheet,
  Text,
  TextInput,
  Switch,
  Image,
  View,
} from 'react-native';

var _ = require('lodash');

import { List, ListItem } from 'react-native-elements'

import { NavigationActions } from 'react-navigation'

import { Button } from 'react-native-elements'

import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'

const homeReset = NavigationActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({ routeName: 'Accounts'})
  ]
})

export default class loginUsernamePassword extends React.Component {
  static navigationOptions = {
    title: 'Login with DocuSign'
  }

  constructor(props) {
    super(props);
    this.state = {

      username: __config.username,
      password: __config.password,
      trying: false
    }
    this.handlePress = this.handlePress.bind(this);
  }

  componentDidMount(){

  }

  handlePress(){


    var apiClient = new docusign.ApiClient();
    apiClient.setBasePath(__config.esign_api_host);

    var creds = JSON.stringify({
      Username: this.state.username,
      Password: this.state.password,
      IntegratorKey: __config.internal_client_id
    });
    apiClient.addDefaultHeader('X-DocuSign-Authentication', creds);

    docusign.Configuration.default.setDefaultApiClient(apiClient);

    var authApi = new docusign.AuthenticationApi();

    var loginOps = {};
    loginOps.apiPassword = 'true';
    loginOps.includeAccountIdGuid = 'true';


    this.setState({
      trying: true
    });


    authApi.login(loginOps, (err, loginInfo, response) => {

      this.setState({
        trying: false
      });

      if (err) {
        alert(err);
        return;
      }

      if (loginInfo) {

        var loginAccounts = loginInfo.loginAccounts;
        console.log('LoginInformation: ' + JSON.stringify(loginAccounts));
        var loginAccount = loginAccounts[0];
        var accountId = loginAccount.accountId;
        var baseUrl = loginAccount.baseUrl;
        var accountDomain = baseUrl.split("/v2");

        apiClient.setBasePath(accountDomain[0]);
        docusign.Configuration.default.setDefaultApiClient(apiClient);


        this.props.navigation.dispatch( homeReset );

      }
    });

  }

  render() {

    return (
      <View>

        <FormLabel>Username</FormLabel>
        <FormInput value={this.state.username} onChangeText={(username) => this.setState({username})} />

        <FormLabel>Password</FormLabel>
        <FormInput value={this.state.password} onChangeText={(password) => this.setState({password})} secureTextEntry={true} />

        <Text></Text>

        <Button 
          title={this.state.trying ? "Signing In":"Sign In"}
          onPress={this.handlePress}
          backgroundColor="#ffc820"
          color="#000000"
        />
        

      </View>
    )
 }

}

