import React, { Component } from "react";
import { View,Text,StyleSheet,TextInput,TouchableOpacity,Image } from "react-native";
import { ScrollView } from "react-native-gesture-handler";



export default function Save({route}){

  function parseData(data) 
  {
    
    //find date
    //find total and remove everthing after that in array
    //find currency
    //find money in total using currency 
    //find each item and hashmap key/value pair for item/price
  
  
    //console.log(data);
    //const date = //regex of all date formats
    //const items = //regex of money 
    console.log("----------------------------------------------------------------------------------------------");
    const date1 = /\d{2}([\/.-])\d{2}\1\d{4}/;
    const date2 = /(?:^|\W)(?:jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|(nov|dec)(?:ember)?)(?:$|\W)/;
    
    const currencyRegex = /[\$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F\u17DB\u20A0-\u20BD\uA838\uFDFC\uFE69\uFF04\uFFE0\uFFE1\uFFE5\uFFE6]/;
    const total = /(?:^|\W)((balance)|(total)|(due)|(sub-total)|(sale)|(sub total))(?:$|\W)/;    //-
  
    var totalMatch = null;
    var date = null;
    var currency = null;

     
    for(let i = 0; i < data.length; i++)
    {
      date = data[i].match(date1);
      if(date != null)
      {
        date = data[i];
        data.splice(i,1);
        break;
      }
      date = data[i].match(date2);
      if(date != null)
      {
        date = data[i];
        data.splice(i,1);
        break;
      }      
    }
    
    for(let i = 0; i < data.length; i++)
    {
      currency = data[i].match(currencyRegex);
      if(currency != null)
      {
        currency = data[i];
        data.splice(i,1);
        break;
      }
    }

    for (let i = 0; i < data.length; i++) 
    {
      totalMatch = data[i].match(total);
      if(totalMatch != null)
      {
        totalMatch  = data[i];
        data.splice(i,1);
        break;
      }
    }

    const items = [];
  
    for(let i = 0; i < data.length; i++)
    {
      //console.log(data[i]);

      var item = data[i].match(/(?<=^| )\d+\.\d+(?=$| )/g);
      if (item != null)
      {
        items.push(data[i]);
      }


    }  
    totalMatch = String(totalMatch);  
    var doublenumber = totalMatch.match(/(?<=^| )\d+\.\d+(?=$| )/g);

    console.log(items);
    //console.log(date+" date");
    //console.log(currency+" currency");
    //console.log(totalMatch+" total price");
    //console.log(doublenumber+" total price number");

    return totalMatch;
  }

    return (
      <View style={styles.container}>
          <Text style={styles.title}>test</Text>
          <Text>{parseData(route.params.arrData)}</Text>

      </View>
    )
  
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
  }
});


