import { StyleSheet, View, Dimensions } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as ScreenOrientation from 'expo-screen-orientation';
import { useEffect, useRef, useState } from 'react';

import Home from './src/screens/Home.js'

const windowDimensions = Dimensions.get('window');
const screenDimensions = Dimensions.get('screen');


export default function App() {

  // const ori = 
  // async function changeScreenOrientation() {
  //   await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

  //   console.log(ScreenOrientation.orientationInfo);
  // }

  // changeScreenOrientation()

  // const [width, setWidth] = useState(1280)

  const webviewRef = useRef(null);
  useEffect(() => {
    // Add orientation change listener
    const subscription =
      ScreenOrientation.addOrientationChangeListener(onOrientationChange);

    // Clean up the listener when the component unmounts
    return () => {
      // Remove the orientation change listener
      ScreenOrientation.removeOrientationChangeListener(subscription);
    };
  }, []);
  const onOrientationChange = (event) => {
    webviewRef.current?.reload();
    // console.log(event)

    // const detctWidth = Dimensions.get('window').width;
    // if(detctWidth >= 720){
    //   setWidth(detctWidth);
    //   console.log(width)
    //   console.log("> 600")
    // }else{
    //   console.log(width)
    //   console.log("< 600")
    // }
    // console.log("width: ", width);
  };

  const [dimensions, setDimensions] = useState({
    window: windowDimensions,
    screen: screenDimensions,
  });

  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      'change',
      ({window, screen}) => {
        setDimensions({window, screen});
      },
    );
    // console.log(dimensions)
    return () => subscription?.remove();
  });


  return (
    <SafeAreaProvider>
        <View style={styles.container}>
            <Home widthWindow={dimensions.window.width}/>
        </View>
    </SafeAreaProvider>
  );
}

// window	ScaledSize	Size of the visible Application window.
// screen	ScaledSize	Size of the device's screen.

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
});



