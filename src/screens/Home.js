import { useEffect, useState, useRef } from 'react';
import { Text, View, Image, Pressable} from 'react-native';
import { Header, Button } from '@rneui/themed';
import * as ImagePicker from 'expo-image-picker';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Dropdown } from 'react-native-element-dropdown';
import QRCode from 'react-native-qrcode-svg';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';

// import ScanQR from './ScanQR.js';
// import Test from './TakePic.js';

const Main = (props)=>{
    const [list, setList] = useState([]);
    const [image, setImage] = useState(null);
    const [change, setChange] = useState(null);
    const [check, setCheck] = useState(false);
    const [valueQR, setValueQR] = useState('');
    const [valueItem, setValueItem] = useState(null);
    const [valueLabel, setValueLabel] = useState(null);
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState();
    const getQRConvert = useRef();

    const albumName = 'QRCodeStorage'

    const listQR = [
        {label: 'Zalo', value: 'zalo'},
        {label: 'KakaoTalk', value: 'kakao'},
        {label: 'WeChat', value: 'wechat'},
        {label: 'Line', value: 'line'},
        {label: 'WhatsApp', value: 'whatsapp'},
        {label: 'Techcombank', value: 'techcom'},
        {label: 'BIDV', value: 'bidv'},
        {label: 'Vietcombank', value: 'vietcom'},
        {label: 'Agribank', value: 'agri'},
    ]

    useEffect(() => {
        (async () => {
          const mediaLibraryPermission = await MediaLibrary.requestPermissionsAsync();
          setHasMediaLibraryPermission(mediaLibraryPermission.status === "granted");
        })();
      }, []);

    useEffect(()=>{
            if(getQRConvert.current != undefined){
                getQRConvert.current.toDataURL((data)=>{
                    setChange('data:image/png;base64,'+data)
                })
            }
    }, [valueQR])

    useEffect(()=>{
        (async()=>{
            try{
                if(list.length != 0){
                    console.log("set? ",list)
                    await AsyncStorage.setItem("myContent", JSON.stringify(list))
                }
            } catch(err){
                console.warn(err)
            }
        })();
    },[change, list, valueQR])

    useEffect(()=>{
        (async()=>{
            try{
                let jsonvalue = await AsyncStorage.getItem("myContent")
                if(jsonvalue != null){
                    if(list.length == 0){
                        setList(JSON.parse(jsonvalue))
                    }
                    console.log("value:",JSON.parse(jsonvalue))
                    console.log(list)
                }
            }catch(err){
                console.warn(err)
            }
        })();
    },[])


    const pickImage = async () => {
        // No permission request in neccessary for lauching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
        //   aspect: [4,3],
            quality:1,
        });
        if(!result.canceled) {
            setImage(result.assets[0].uri);
            const results = await BarCodeScanner.scanFromURLAsync(result.assets[0].uri)
            setValueQR(results[0].data)
        }
    }

    // console.log(typeof props.widthWindow.widthWindow)

    const LANDSCAPE = (props)=>{
        const CButton = ({className, title, width, height, space, borderRadius, ...props})=>{
            let space_x = 0;
            let space_y = 0;
            (space == undefined)? space_x = 0: space_x = space.x;
            (space == undefined)? space_y = 0: space_y = space.y;
    
            return(
                <View className={className}>
                    <Button
                        title={title} 
                        buttonStyle={{width: parseInt(width), height: parseInt(height), marginRight: space_x, marginLeft: space_x, marginTop: space_y, marginBottom: space_y, borderRadius: parseInt(`${(borderRadius == undefined)?0:borderRadius}`)}}
                        onPress={()=>{setImage(props.uri)}}
                    />
                </View>
            )
        }
    
        const ListButton = (list) => {
            
            return list.list.map((button, index) => {
                return(
                    <CButton key={index} className="mr-2" title={button.title} uri={button.uri} width="100" height="50" space={{x: 3, y:3}} borderRadius="5"/>
                )
            })
        }

        const handleSaveQRImage = () => {
            (async () => {
                if(change != null){
                    const base64Code = change.split("data:image/png;base64,")[1];
    
                    const filename = FileSystem.documentDirectory+ albumName + valueItem + new Date().getMilliseconds() +new Date().getSeconds() + ".png";
                    await FileSystem.writeAsStringAsync(filename, base64Code, {
                        encoding: FileSystem.EncodingType.Base64,
                    });
    
                    setImage(filename)

                    setList([...list, {
                        title: valueItem,
                        uri: filename
                    }])
    
                    const albumasset = await MediaLibrary.getAlbumAsync(albumName);
                    const cachedAsset = await MediaLibrary.createAssetAsync(filename);
                    if(albumasset != null){ // cung thay k co tac dung gi may (chua trien khai het duoc chuc nang)
                        const test = await MediaLibrary.createAlbumAsync(albumName, cachedAsset, false);
                    }
                }
                
            })();
            setChange(null)
            setValueQR('')
            setValueLabel(null)
        }

        const handleCancel = ()=>{
            setChange(null);
        }

        const handleClearCache = async ()=>{
            await AsyncStorage.removeItem('myContent')
            setChange(null)
            setImage(null)
            setList([])
        }

        return (
            <View className="flex flex-row h-screen">
                <View className="basis-2/3 bg-yellow-400 items-center justify-center">
                    <View className="w-[40%] items-center">
                        {(change == null)?
                            <View>
                                <Button title="Choose Image" onPress={props.onPress}/>
                                <Button title="Clear Cache" onPress={handleClearCache}/>
                            </View>
                            :
                            <>
                                <Text className="font-bold text-lg">Choose name for the QR</Text>
                                <Dropdown
                                    className="bg-slate-600 w-full h-[50]"
                                    data={listQR}
                                    search
                                    searchPlaceholder="Search..."
                                    placeholder={(valueLabel == null)?"Select item...":valueLabel}
                                    maxHeight={300}
                                    labelField="label"
                                    valueField="value"
                                    onChange={item => {
                                        setValueItem(item.value)
                                        setValueLabel(item.label)
                                    }}
                                />
                                <View className="flex flex-row bg-black">
                                    <Button title="Save QR" onPress={handleSaveQRImage}/>
                                    <Button title="Cancel" onPress={handleCancel}/>
                                </View>
                            </>
                        }
                        
                    </View>
                </View>
                <View className="basis-1/3">
                    <View>
                        <View className="flex items-center mt-5">
                            <Text className="text-bl font-bold tracking-wider text-xl text-center">When you scan QR code please check my name:</Text>
                            <Text className="font-bold text-3xl">Bùi Đức Hiển</Text>
                        </View>
                    </View>
                    <View className="flex-row h-[65%] justify-end">
                        <View className="flex-1 justify-center items-center">
                            {
                                (valueQR.length == 0)?
                                    <Image 
                                        source={{uri: image}} 
                                        style={{width: '98%', height: 418}}
                                    />
                                :
                                    <QRCode 
                                        size={418} 
                                        value={valueQR}
                                        logoBackgroundColor='transparent'
                                        backgroundColor="none"
                                        getRef={getQRConvert}
                                    />
                            }
                        </View>
                    </View>
                    <View className="flex flex-row flex-wrap justify-start">
                        <ListButton list={props.list}/>
                    </View>
                </View>
            </View>
        )
    }
    
    const PORTRAIT = ()=>{
        return (
            <View className="flex-1 justify-center bg-red">
                <Text>PORTRAIT</Text>
            </View>
        )
    }

    if(props.widthWindow.widthWindow <= 720){
        return(
            <PORTRAIT/>
        )
    }else{
        return(
            <LANDSCAPE list={list} image={image} onPress={pickImage}/>
        )
    }
}

export default function Home(widthWindow){
    return (
        <View className="h-full w-full">
            <Main filename={require("../../assets/zalotest.jpg")} widthWindow={widthWindow}/>
            {/* <ScanQR/> */}
            {/* <Test/> */}
        </View>
    )
}
