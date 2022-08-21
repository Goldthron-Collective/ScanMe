import * as ImagePicker from 'expo-image-picker';
import React, { useState, useEffect } from 'react';
import { Button, Image, View, Text } from 'react-native';

function ImagePickerComponent({ onSubmit }) {
  const [image, setImage] = useState(null);
  const [text, setText] = useState('Please add an image');

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      base64: true, //return base64 data.
      //this will allow the Vision API to read this image.
    });
    if (!result.cancelled) {
        setImage(result.uri);
        setText("Loading.."); //set value of text Hook
        const responseData = await onSubmit(result.base64);
        setText(responseData.text); //change the value of this Hook again.
      }
  };
  return (
    <View>
      <Button title="Pick an image from camera roll" onPress={pickImage} />
      {image && (
        <Image
          source={{ uri: image }}
          style={{ width: 200, height: 200, resizeMode:"contain" }}
        />
      )}
      <Text>{text}</Text>
    </View>
  );
}
export default ImagePickerComponent;