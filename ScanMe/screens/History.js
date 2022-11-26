import React, { Component } from "react";
import { View, Text, FlatList, TextInput ,StyleSheet} from "react-native";
import { NavigationActions } from "react-navigation";



class History extends Component {
  constructor(props) {
    super(props);

    this.state = {
    
    };
  }
  async componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener("focus", () => {

    this.checkLoggedIn()
    this.loadHistory()
   

  });
  }
async componentWillUnmount() {
  this.unsubscribe();
}
checkLoggedIn = async () => {
  const id = await AsyncStorage.getItem("@id");
  console.log(id);

  if (id == null) {
    this.props.navigation.navigate("Login");
  }
};
loadHistory = async () => {
  
};

render() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>History</Text>
     <View />
      
    </View>
  );
}
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});

export default History