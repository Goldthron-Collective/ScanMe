import React, { Component, useRef  } from "react";
import { View,Text,StyleSheet,ScrollView ,Modal,Pressable ,TouchableOpacity,Dimensions } from "react-native";
import Style from "./Style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SERVER_IP } from "../serverConnect"
import { TextInput ,MD3LightTheme as DefaultTheme} from 'react-native-paper';
import { ImageZoom } from '@likashefqet/react-native-image-zoom';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#04bbd4',

  },
};



class MoreHistory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id : "",
      errorTxt: "",
      items: [],
      date: "",
      dateUpload:"",
      title: "",
      currency: "",
      total: "",
      change: "",
      uri: "",
      loading: true,
      recID: this.props.route.params.rec_id,
      modalVisible: false,
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

loadHistory = async () => {

  const id = await AsyncStorage.getItem("@id");

  this.setState({id: id});

  if (id == null) {
    this.props.navigation.navigate("Login");
  }

  
  return fetch(SERVER_IP+"getByRecId?id="+id+"&recid="+await this.state.recID)
  .then(async(response) => {
  
    if (response.status == 200) {
       response.json().then(async(json) => {

        const imageData = `data:image/jpg;base64,${json[0].images}`;

       
        this.setState({title: json[0].title});
        this.setState({currency: json[0].currency});
        this.setState({date: json[0].dateatime});
        this.setState({dateUpload: json[0].dateofupload});
        this.setState({total: json[0].total.toString()});
        this.setState({change: json[0].changes.toString()});
        this.setState({items: JSON.parse(json[0].items)});
        this.setState({uri:imageData}, () => this.setState({loading: false}));
   
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

Save = async () => {
 
  return fetch(SERVER_IP+"updRec?id="+this.state.id+"&recid="+this.state.recID+"&title="+this.state.title+"&dateofupload="+this.state.dateUpload+"&datetime="+this.state.date+"&total="+this.state.total+"&currency="+this.state.currency+"&change="+this.state.change+"&items="+JSON.stringify(this.state.items))
  .then(async(response) => {
  
    if (response.status == 200) {
    
      this.setState({ errorTxt: "Updated Text" });
      return  this.props.navigation.navigate("History");

    } else {

      return this.setState({ errorTxt: "Erorr Cant Save Change" });
    }
  })
  .catch((error) => {
    console.error(error);
  });
}

Delete = async() =>
{

}

//<Image source={{uri: this.state.uri  }} style={{ width:200, height:200 }} />
render() {
  if (this.state.loading == true) {
    return (
      <View style={Style.container}>

          <Text style={{fontSize: 30,fontWeight: 'bold'}}>Loading...</Text>


        </View>
    )
  }
  return (
   
    <ScrollView  style={styles.container}>

      <Text style={styles.title}>Edit , View & Save</Text>

      <Text style={Style.textStyle}> {this.state.errorTxt} </Text>

      <Modal
       animationType="slide"
       transparent={true}
       visible={this.state.modalVisible}
       onRequestClose={() => {
         Alert.alert("Modal has been closed.");
         this.setState({modalVisible: !this.state.modalVisible});
       }}>
           <View style={Style.centeredView}>
          <View style={Style.imgModalView}>
          <Text style={Style.modalText}>Pinch To Zoom</Text>
            <ImageZoom uri={this.state.uri} style={{ width: Dimensions.get('window').width, height:Dimensions.get('window').height }}/>
            <Pressable
              style={Style.button}
              onPress={() =>  this.setState({modalVisible: !this.state.modalVisible})}
            >
              <Text style={Style.textStyle}>Close</Text>
            </Pressable>
          </View>
        </View>

      </Modal>

      <Pressable
        style={Style.button}
        onPress={() => this.setState({modalVisible: true})}
      >
        <Text style={Style.textStyle}>Show Image Of Recipt</Text>
      </Pressable>
      
      
      
    
      <TextInput
    onChangeText={(title) => this.setState({ title })}
    value={this.state.title.toString()}
     style={Style.inputBox}
     theme={theme}
     label="Title"
  />


  <TextInput
    onChangeText={(date) => this.setState({ date })}
    value={this.state.date.toString()}
     style={Style.inputBox}
     theme={theme}
     label="Date Of Purchase"
  />

  <TextInput
    onChangeText={(dateUpload) => this.setState({ dateUpload })}
    value={this.state.dateUpload.toString()}
    style={Style.inputBox}
    theme={theme}
    label="Date Of Upload"


  />

  <TextInput
    onChangeText={(currency) => this.setState({ currency })}
    value={this.state.currency.toString()}
    style={Style.inputBox}
    theme={theme}
    label="Currency Type"
  />

  <TextInput
    onChangeText={(total) => this.setState({ total })}
    value={this.state.total.toString()}
    style={Style.inputBox}
    theme={theme}
    label="Total"
  />

  <TextInput
    onChangeText={(change) => this.setState({ change })}
    value={this.state.change.toString()}
    style={Style.inputBox}
    theme={theme}
    label="Change"
  />
  
  {
      this.state.items.map((item , index)=>
        

        <View style={{flexDirection:"row"}}  key={item.item}>
       
          <View style={{flex:1}} >
            <TextInput 
           
            style={Style.inputBox}
            theme={theme}
            label="Item Name"
            onChangeText={(item) =>
            {
            
              let inputValues=this.state.items;
              inputValues[index]=item;
              this.setState({ inputValues,index })
            }}
            value={item.item}>
             
            </TextInput>
          </View>

          <View style={{flex:1}}>
            <TextInput 
          
            style={Style.inputBox}
            theme={theme}
            label="Price"
            onChangeText={(item) => {
              let inputValues2=this.state.items;
              inputValues2[index]=item;
              this.setState({ item ,index})
            }}

            value={item.price}>
             
            </TextInput>
          </View>

        </View> )
    }
    

  <View style={{flexDirection:"row",paddingTop:30,paddingBottom: 100}}  >
       
          <View style={{flex:1}}>

          <TouchableOpacity
            onPress={() => this.Save()}
            style={Style.AcceptButton}
          >
            <Text style={Style.buttonText}>Save</Text>
          </TouchableOpacity>

          </View>

          <View style={{flex:1}}>

          <TouchableOpacity
            onPress={() => this.Delete()}
            style={Style.DeclineButton}
          >
            <Text style={Style.buttonText}>Delete</Text>
          </TouchableOpacity>

          </View>

        </View>
      
    </ScrollView >
  );
}
}


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 30,
    paddingTop: 50,


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
});

export default MoreHistory