import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker'
import { useState } from 'react';
import ChooseImage from './src/screens/image.js'
import Home from './src/screens/Home.js'

export default function App() {

  const [image, setImage] = useState(null)

  const pickImage = async () => {
    // No permission request in neccessary for lauching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4,3],
      quality:1,
    });
    console.log(result);
    
    if(!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <Imagee />
      <Text>Image Picker</Text>
      <Button 
        title='Pick an image from gallery'
        onPress={pickImage}
      />
      {image && <Image source={{uri: image}} style={{width: 100, height: 100}}/>}
      {/* <StatusBar style="auto" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});



