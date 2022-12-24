import React, { Component } from "react";
import { View, Text, FlatList, TouchableOpacity ,StyleSheet,Alert,Modal,Pressable } from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { SERVER_IP } from "../serverConnect"

//sort by total 
//categorise by month (change start and end date of month)
//total amount spent this month

class History extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id : "",
      errorTxt: "",
      data: "",
      modalVisible: false,
      sortBy: "Date Of Upload - Descending",
    };
  }
  async componentDidMount() {
    this.unsubscribe = this.props.navigation.addListener("focus", () => {
    
    this.loadHistory();
    
   

  });
  }
async componentWillUnmount() {
  this.unsubscribe();
}
totalAscending = async() => 
{
  const data = [...this.state.data].sort((a, b) => a.total - b.total);
  this.setState({sortBy: "Total - Low To High"});
  this.setState({data: data});
}
totalDescending = async() => 
{
  const data = [...this.state.data].sort((a, b) => a.total - b.total);
  this.setState({sortBy: "Total - High To Low"});
  this.setState({data: data});
}
dateUploadAscending = async() => 
{
  const data = [...this.state.data].sort((a, b) => a.dateofupload > b.dateofupload ? 1 : -1,);
  this.setState({sortBy: "Date Of Upload - Ascending"});
  this.setState({data: data});

}
dateUploadDescending = async() => 
{
  const data = [...this.state.data].sort((a, b) => a.dateofupload > b.dateofupload ? -1 : 1,);
  this.setState({sortBy: "Date Of Upload - Descending"});
  this.setState({data: data});
}

loadHistory = async () => {
  const id = await AsyncStorage.getItem("@id");

  this.setState({id: id});

  if (id == null) {
    this.props.navigation.navigate("Login");
  }

  
  fetch(SERVER_IP+"getAllReceipts?id="+id)
  .then(async(response) => {
  
    if (response.status == 200) {
       response.json().then(async(json) => {

        this.setState({data: json});
       
       
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
    <View style={styles.container}>


      <Text style={styles.title}>History</Text>

      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          this.setState({modalVisible: !this.state.modalVisible});
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Select Sort By</Text>

            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {this.totalDescending(); this.setState({modalVisible: !this.state.modalVisible})}}
            >
              <Text style={styles.textStyle}>Total - High to Low</Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() =>  {this.totalAscending(); this.setState({modalVisible: !this.state.modalVisible})}}
            >
              <Text style={styles.textStyle}>Total - Low to High</Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {this.dateUploadDescending(); this.setState({modalVisible: !this.state.modalVisible})}}
            >
              <Text style={styles.textStyle}>Date Of Upload - Descending</Text>
            </Pressable>

            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => {this.dateUploadAscending(); this.setState({modalVisible: !this.state.modalVisible})}}
            >
              <Text style={styles.textStyle}>Date Of Upload - Ascending</Text>
            </Pressable>

         
          </View>
        </View>
      </Modal>
      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => this.setState({modalVisible: true})}
      >
        <Text style={styles.textStyle}>Sort By </Text>
      </Pressable>
      <Text > {this.state.sortBy} </Text>
      <FlatList
          data={this.state.data}
          keyExtractor={(item) => item.recipt_id}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
              style={styles.button}
              onPress={() => this.props.navigation.navigate("MoreHistory",{rec_id: item.recipt_id})}>
                <Text  style={styles.text} >{item.title} </Text>
                <Text  style={styles.text}> {item.dateofupload} </Text>
                <Text  style={styles.text}>{item.total} </Text>
              </TouchableOpacity>
            )
 
          }}
          
        />
      
    </View>
  );
}
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
   
  },
  button:
  {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
    margin: 10,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

export default History