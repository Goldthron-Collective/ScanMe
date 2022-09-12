import * as ImagePicker from 'expo-image-picker';
import React, { useState, useEffect } from 'react';
import { Button, Image, View, Text , StyleSheet, TouchableOpacity} from 'react-native';
import gallery from './icons/gallery.png'

function ImagePickerComponent({ onSubmit }) {
  //const [image, setImage] = useState(null);
 

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      base64: true, //return base64 data.
      //this will allow the Vision API to read this image.
    });
    if (!result.cancelled) {
      //  setImage(result.uri);
        
        const responseData = await onSubmit(result.base64);
       // setText(responseData.text); //change the value of this Hook again.
      }
  };
  return (
    <View>
      <TouchableOpacity onPress={pickImage}>
        <Image source={gallery}/>
       </TouchableOpacity>
      
    </View>
  );
}
export default ImagePickerComponent;