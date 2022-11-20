import React, { Component } from "react";
import { View, Text, ScrollView, TextInput, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Style from "./Style";

import { SERVER_IP } from "../serverConnect"

class SignUP extends Component {
  constructor(props) {
    super(props);

    this.state = {
   
    };
  }

  
  logout = () => {


      
  };
  

  render() {
    return (
     
       
        <View style={Style.welcome}>
           
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("Login")}
            style={Style.buttonStyleDefault}
          >
            <Text style={Style.buttonText}>Logout</Text>
          </TouchableOpacity>

        </View>
     
    );
  }
}

export default SignUP;
