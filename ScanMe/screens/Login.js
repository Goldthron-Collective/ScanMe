import React, { Component } from "react";
import { View,Text,StyleSheet,TextInput,TouchableOpacity,Image } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Style from "./Style";
import logo from "./logo.png";
import {SERVER_IP} from "../serverConnect"


class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      errorTxt: "",
    };
  }
  login = async () => {

    let email = this.state.email.toLowerCase();
    let pass = this.state.password;


    if(email || pass == "")
    {

    }
    
    fetch(SERVER_IP+"login?email="+email+"&password="+pass)
      .then(async(response) => {
      
  
        if (response.status == 200) {
           response.json().then(async(json) => {
           
            await AsyncStorage.setItem("@id", String(json[0].id));
            
            this.props.navigation.navigate("Homes");
           })
          

         
        } else if (response.status == 403) {
          return this.setState({ errorTxt: "Email doesnt Exist" });
          //used display the resposnes from the server
        } else if (response.status == 403) {
          return this.setState({ errorTxt: "Invalid Password" });
          //each error code returns a diffrent response to the user
        } else {
          return this.setState({ errorTxt: "Something went wrong" });
        }
      })
      .catch((error) => {
        console.error(error);
      });
      
  };
  

  render() {
    return (
     
        <View style={Style.welcome}>
          <TextInput
            style={Style.inputBox}
            onChangeText={(value) => this.setState({ email: value })}
            value={this.state.email}
            placeholder="Email"
          />

          <TextInput
            style={Style.inputBox}
            secureTextEntry={true}
            onChangeText={(value) => this.setState({ password: value })}
            value={this.state.password}
            placeholder="Password"
          />

          <Text style={Style.errorText}>{this.state.errorTxt}</Text>

          <TouchableOpacity
            style={Style.buttonStyleDefault}
            onPress={() => {
              this.login();
            }}
          >
            <Text style={Style.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={Style.buttonStyleDefault}
            onPress={() => this.props.navigation.navigate("SignUP")}
          >
            <Text style={Style.buttonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
    
    );
  }
}

export default Login;
