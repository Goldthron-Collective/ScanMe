import React, { Component, Fragment } from "react";
import { View, Text, FlatList, TouchableOpacity ,Image,Alert,Modal,Pressable } from "react-native";
import Style from "./Style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SERVER_IP } from "../serverConnect"

//sort by total 
//categorise by month (change start and end date of month)
//total amount spent this month
// add search ( filter what to search by)
//total each month
// categroise i.e food ,shopping,books,clothing etc

const months = [
  'JAN',
  'FEB',
  'MAR',
  'APR',
  'MAY',
  'JUN',
  'JUL',
  'AUG',
  'SEP',
  'OCT',
  'NOV',
  'DEC'
];
const days = [
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY'
];

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
  const data = [...this.state.data].sort((b, a) => a.total - b.total);
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


        for(let i = 0; i < json.length; i++)
        {
          
          const response = await fetch('https://autocomplete.clearbit.com/v1/companies/suggest?query='+json[i].title);
          const responses = await response.json();
          json[i].currency = responses[0].logo;
        }
        // add new object called image
        // do item.image in render within the URL;


        

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

renderDate = (date,ind) => {

  const day = new Date(date.toString());
  const formatDate = days[day.getDay()] + ", " + day.getDate() + " " + months[day.getMonth()] +" " + day.getFullYear()

  this.state.data[ind].dateofupload = formatDate;

  const first = this.state.data.map(e => e.dateofupload).indexOf(formatDate);
  //const last = this.state.data.map(e => e.dateofupload).lastIndexOf(formatDate);

  if(ind > first)
  {
    return;
  }

  
  let monthTotal = 0;

  for(let i = 0;i<this.state.data.length; i++)
  {
    if(this.state.data[i].dateofupload == formatDate)
    {
      monthTotal += this.state.data[i].total;
    }
  }
  monthTotal = "£" + Math.round(monthTotal * 100) / 100;


  return(

    <View style={{flexDirection:'row', flexWrap: "wrap",justifyContent:'space-between' , paddingVertical: 15}}>
      <View>
        <Text style={Style.textDate}>{formatDate}</Text>
      </View>
      <View>
        <Text style={Style.textMonthTotal}>{monthTotal}</Text>
      </View>
    </View>

  )

}

render() {
  return (
    <View style={Style.containerHis}>


      <Text style={Style.title}>History</Text>

      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          this.setState({modalVisible: !this.state.modalVisible});
        }}
      >
        <View style={Style.centeredView}>
          <View style={Style.modalView}>
            <Text style={Style.modalText}>Select Sort By</Text>

            <Pressable
              style={[Style.button]}
              onPress={() => {this.totalDescending(); this.setState({modalVisible: !this.state.modalVisible})}}
            >
              <Text style={Style.textStyle}>Total - High to Low</Text>
            </Pressable>

            <Pressable
              style={[Style.button]}
              onPress={() =>  {this.totalAscending(); this.setState({modalVisible: !this.state.modalVisible})}}
            >
              <Text style={Style.textStyle}>Total - Low to High</Text>
            </Pressable>

            <Pressable
              style={[Style.button]}
              onPress={() => {this.dateUploadDescending(); this.setState({modalVisible: !this.state.modalVisible})}}
            >
              <Text style={Style.textStyle}>Date Of Upload - Descending</Text>
            </Pressable>

            <Pressable
              style={[Style.button]}
              onPress={() => {this.dateUploadAscending(); this.setState({modalVisible: !this.state.modalVisible})}}
            >
              <Text style={Style.textStyle}>Date Of Upload - Ascending</Text>
            </Pressable>

         
          </View>
        </View>
      </Modal>
      <Pressable
        style={[Style.button]}
        onPress={() => this.setState({modalVisible: true})}
      >
        <Text style={Style.textStyle}>Sort By </Text>
      </Pressable>
      <Text > {this.state.sortBy} </Text>

     
      
      <FlatList
            style={{marginTop: 30, paddingBottom: 200}}
          data={this.state.data}
          keyExtractor={(item) => item.recipt_id}
          renderItem={({ item ,index}) => {
            return (
              <Fragment>
              {this.renderDate(this.state.data[index].dateofupload,index)}
              <TouchableOpacity
              style={Style.buttonHistory}
              onPress={() => this.props.navigation.navigate("MoreHistory",{rec_id: item.recipt_id})}>

                <View style={{flexDirection:'row', flexWrap: "wrap",justifyContent:'space-between'}}>
                  <View >

                  <View style={{flexDirection:'row', flexWrap: "wrap",justifyContent:'space-evenly'}}>

                    <Image style={Style.imgHistory} source={{uri: item.currency}}/>

                    <Text style={Style.textTitle}>{item.title}</Text>
                    </View>

                  </View>
                  <View>
                    <Text style={Style.textTotal}>{item.total}</Text>
                  </View>
                </View>

              </TouchableOpacity>
              </Fragment>
            )
 
          }}
          
        />
      

    </View>
  );
}
}

export default History