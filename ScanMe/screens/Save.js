import React, { Component } from "react";
import { View,Text,StyleSheet,TextInput,TouchableOpacity,Image } from "react-native";
import { ScrollView } from "react-native-gesture-handler";



class Save extends Component {
  constructor(props) {
    super(props);

    var params = props.navigation.state.params.data;

  }
  

  render() {
    return (
      <View>
          <Text>{{params}}</Text>

      </View>
    );
  }
}

export default Save;
