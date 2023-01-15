import React, { Component ,Fragment ,useState } from "react";
import { View,Text,StyleSheet ,Modal,Pressable ,TouchableOpacity,Dimensions ,FlatList,Button,SafeAreaView,ActivityIndicator} from "react-native";
import Style from "./Style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SERVER_IP } from "../serverConnect"
import { TextInput ,MD3LightTheme as DefaultTheme} from 'react-native-paper';
import { ImageZoom } from '@likashefqet/react-native-image-zoom';
import DateTimePicker from '@react-native-community/datetimepicker';

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: '#04bbd4',

  },
};

const MySubComponent = (props) => {

  const [datePicker, setDatePicker] = useState(false);
 
  const [date, setDate] = useState(new Date());
 
  function showDatePicker() {
    setDatePicker(true);
  };

  function onDateSelected(event, value) {
    console.log(value + " SET");
    setDate(value);
  };
  function closeDatePicker(){
    setDatePicker(false);
  }
  function saveCloseDatePicker(event, value){
    setDate(value);
    setDatePicker(false);

  }

  
  if (props.display) {

    console.log(date);
  return (
    <SafeAreaView style={{ flex: 1 }}>
  
  
        {datePicker && (
          <DateTimePicker
            value={date}
            mode={'datetime'}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            is24Hour={true}
            textColor="black"
            onChange={onDateSelected}
            style={Style.datePicker}
          />
        )}
           {datePicker && (
        <View style={{flexDirection:"row"}}>
        <View style={{flex:1}}>
          <Button
            onPress={closeDatePicker}
            title="Cancel"
            color="#841584"
          />
       
        </View>
        <View style={{flex:1}}>
        <Button
            onPress={saveCloseDatePicker}
            title="Save"
            color="#841584"
          />
          
        </View>
      </View>
      )}
   
       <Pressable onPress={showDatePicker}>
        <View pointerEvents="none">
        <TextInput
                value={date.toLocaleString('en-GB', { timeZone: 'UTC' }).toString()}
                style={Style.inputBox}
                theme={theme}
                label={props.type == 'upload' ? 'Upload Date' : 'Recipt Date'}
                />
        </View>
        </Pressable>


       
 
    
    </SafeAreaView>
  );

      }
};


class MoreHistory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id : "",
      errorTxt: "",
      items: [{item: "", price: ""}],
      date: "",
      dateUpload:"",
      title: "",
      currency: "",
      total: "",
      change: "",
      uri: null,
      loading: true,
      recID: this.props.route.params.rec_id,
      modalVisible: false,
      loadingIMG: "",

    };
  }
 // componentWillReceiveProps(nextProps) {
  //  this.showCategory(nextProps);
 // }
  
  

  async componentDidMount() {
   
    this.unsubscribe = this.props.navigation.addListener("focus", () => {
      this.setState({loading: true});
    this.loadHistory();
   

  });
  }
async componentWillUnmount() {
  this.unsubscribe();
}
loadingScreen = () => {
  if(this.state.loadingIMG == true)
  {
    return(
      
           <ActivityIndicator size="large"  color="#0000ff"/>
      
    )
  }
  else
  {
    return;
  }
}
loadImage = async () => {


  return fetch(SERVER_IP+"recimage?id="+this.state.id+"&recid="+this.state.recID)
  .then(async(response) => {
   
    if (response.status == 200) {
       response.json().then((json) => {
        
        const imageData = `data:image/jpg;base64,${json[0].images}`;

        this.setState({uri:imageData}, () => this.setState({loadingIMG: false}));
        this.setState({loadingIMG:false});
        this.setState({modalVisible: true});
        
        
       })
      
    }else {
     
      return this.setState({ errorTxt: "Something went wrong" });
    }
  })
  .catch((error) => {
    console.error(error);
  });

}

loadHistory = async () => {

  const id = await AsyncStorage.getItem("@id");

  this.setState({id: id});

  if (id == null) {
    this.props.navigation.navigate("Login");
  }
  
  return fetch(SERVER_IP+"getByRecId?id="+id+"&recid="+this.props.route.params.rec_id)
  .then(async(response) => {

    if (response.status == 200) {
   
       response.json().then((json) => {
        this.setState({title: json[0].title});
        this.setState({currency: json[0].currency});
        this.setState({date: json[0].dateatime});
        this.setState({dateUpload: json[0].dateofupload});
        this.setState({total: json[0].total.toString()});
        this.setState({change: json[0].changes.toString()});
        this.setState({items: JSON.parse(json[0].items.toString())});
        this.setState({recID: this.props.route.params.rec_id} ,() => this.setState({loading: false}));
   
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

render() {
  if (this.state.loading == true) {
    return (
      <View style={Style.container}>

          <Text style={{fontSize: 30,fontWeight: 'bold'}}>Loading...</Text>


        </View>
    )
  }
  return (
   
    <View  style={styles.container}>


      <Text style={styles.title}>Edit , View & Save</Text>

      {this.loadingScreen()}

      <Text style={Style.textStyle}> {this.state.errorTxt} </Text>

      
       <FlatList
      style={{flex: 1}}
          data={this.state.items}
          
          keyExtractor={(item) => item.item}
          ListHeaderComponent={() => (
            <View>


                <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.modalVisible}
                onRequestClose={() => {
                  console.log("called");
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
                  onPress={() => {this.setState({loadingIMG: true});this.loadImage();}}
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

                <MySubComponent display={true} data={this.state.date} type={'recipt'}/>

                <MySubComponent display={true} data={this.state.dateUpload} type={'upload'}/>

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

            </View>
          )}
          renderItem={({ item,index }) => {
            return (
              <Fragment>
                <View style={{flexDirection:"row"}}>
                  <View style={{flex:1}}>
                    <TextInput 
                    
                    style={Style.inputBox}
                    theme={theme}
                    label="Item Name"
                    onChangeText={text => {
                      this.state.items[index].item = text;
                      this.setState({item});
                    }}
                    value={this.state.items[index].item}>
                    </TextInput>
                  </View>
                  <View style={{flex:1}}>
                    <TextInput 
                    
                    style={Style.inputBox}
                    theme={theme}
                    label="Price"
                    onChangeText={text => {
                      this.state.items[index].price = text;
                      this.setState({item});
                    }}
                    value={this.state.items[index].price}>
                   
                    </TextInput>
                  </View>
                </View>
                </Fragment>
            )
          }}
        />
         <View style={{flexDirection:"row",paddingTop:0}}  >
       
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

 
      
    </View >
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