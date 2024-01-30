import { useState } from 'react';
import { Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';



export default function ChooseImage (){

    const [image, setImage] = useState(null)
    

    return (
        <ChooseImage source={require('../../assets/icon.png')} style={{width: 100, height: 100}} />
    );
}