import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    TextInput,
    StatusBar,
    ActivityIndicator,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from "@react-native-async-storage/async-storage";


const verifyBookingOtp = ({ navigation, route }) => {
    const [value, setValue] = useState('');
    const [formattedValue, setFormattedValue] = useState('');
    const [valid, setValid] = useState(true);
    const phoneInput = useRef();
    const [load, setload] = useState(false);
    const [confirm, setConfirm] = useState(null);
    const [code, setCode] = useState('');
    const { bookingid } = route.params;


    const [data, setData] = React.useState({
        username: '',
        password: '',
        check_textInputChange: false,
        secureTextEntry: true,
        isValidUser: true,
        isValidPassword: true,
    });

    useEffect(() => {
        navigation.setOptions({
            headerShown: false
        });
    }, []);

    async function loginHandle(formattedValue) {
        console.log(formattedValue)
        setload(true);
        setload(false);





        AsyncStorage.getItem('user').then(mobile => {
            AsyncStorage.getItem('userToken').then(value => {
                var myHeaders = new Headers();
                myHeaders.append("Authorization", "Bearer " + value);
                myHeaders.append("Content-Type", "application/json");

                var raw = JSON.stringify({
                    "bookid": bookingid,
                    "OTP": formattedValue
                });

                var requestOptions = {
                    method: 'POST',
                    headers: myHeaders,
                    body: raw,
                    redirect: 'follow'
                };

                fetch("https://trucktaxi.co.in/api/customer/verifyTripOTP", requestOptions)
                    .then(response => response.json())
                    .then(result => {
                        console.log(result)
                        if (result.status == 200) {
                            alert('Booking Successful')
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'My Bookings' }]
                            })
                        }
                        else {
                            alert('Invalid OTP')
                        }

                    })
                    .catch(error => console.log('error', error));

            })
        })
    }



    const textInputChange = val => {
        setFormattedValue(val);

    };


    const handleValidUser = val => {
        if (val.trim().length == 10) {
            var value = '+91' + val;
            setFormattedValue(value);
        } else {
            setData({
                ...data,
                isValidUser: false,
            });
        }
    };

    if (load) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (!confirm) {
        return (
            <View style={styles.container}>
                <StatusBar backgroundColor="#fff" barStyle="dark-content" />
                <View style={styles.header}>
                    {/* <Animatable.Image
                        animation="bounceIn"
                        duration={1500}
                        source={require('../assets/unlock.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    /> */}
                    <Text
                        style={[
                            styles.title]}>
                        Booking Verification
                    </Text>
                    <Text
                        style={[
                            styles.subititle]}>
                        You Will Get A OTP via SMS
                    </Text>
                </View>

                <Animatable.View
                    style={[
                        styles.footer
                    ]}
                    animation="fadeInUpBig">


                    <View style={{ flex: 1, flexDirection: 'row', marginLeft: 24 }}>

                        <View style={styles.action}>
                            <TextInput
                                placeholder="Enter OTP"
                                placeholderTextColor="#666666"
                                style={[styles.textInput]}
                                autoCapitalize="none"
                                maxLength={6}
                                keyboardType={'numeric'}
                                onChangeText={val => textInputChange(val)}
                                onEndEditing={e => handleValidUser(e.nativeEvent.text)}
                            />
                        </View>
                    </View>

                    <View style={styles.button}>
                        <TouchableOpacity
                            onPress={() => {
                                const checkValid = phoneInput.current?.isValidNumber(value);
                                setValid(checkValid ? checkValid : false);
                                loginHandle(formattedValue);
                                //proceed
                            }}>
                            <LinearGradient
                                colors={['#85388d', '#85388d']}
                                style={styles.signIn}>
                                <Text style={styles.textSign}>Confirm Booking</Text>
                                <MaterialIcons name="navigate-next" color="#fff" size={20} />
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </Animatable.View>
            </View>
        );
    }

    if (load) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }


};

export default verifyBookingOtp;

const { height } = Dimensions.get('screen');
const height_logo = height * 0.28;
const height_logot = height * 0.18;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    containerotp: {
        flex: 1,
        backgroundColor: '#fff',
    },
    tinyLogo: {
        width: 100,
        height: 100,
        resizeMode: 'stretch',
    },

    header: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    footer: {
        flex: 2,
        backgroundColor: '#fff',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 50,
        paddingHorizontal: 10,
    },
    phone: {
        marginTop: 4,
        fontSize: 14,
        marginLeft: 24,
    },

    subititle: {
        color: '#85388d',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 2,
    },

    title: {
        color: '#85388d',
        fontSize: 18,
        paddingTop: 40,
        marginTop: 2,
        fontWeight: 'bold',
    },
    action: {
        flexDirection: 'row',
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#E6E7E8',
        width: Dimensions.get('window').width - 70,
        height: 46,
        paddingLeft: 10,
        borderRadius: 45,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actiontw: {
        flexDirection: 'row',
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#E6E7E8',
        width: 52,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
        borderRadius: 45,
        height: 46,

        fontSize: 14,
    },
    text: {
        color: 'grey',
        marginLeft: 24,
    },
    textInput: {
        flex: 1,
        paddingLeft: 10,
        color: '#05375a',
    },
    button: {
        alignItems: 'center',
        marginTop: 30,
    },
    signIn: {
        width: 336,
        height: 42,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 45,
        flexDirection: 'row',
    },
    textSign: {
        color: 'white',
        fontWeight: 'bold',
    },
    errorMsg: {
        color: '#FF0000',
        fontSize: 14,
        marginTop: 10,
        marginLeft: 20,
    },
    borderStyleBase: {
        width: 30,
        height: 45,
    },

    borderStyleHighLighted: {
        borderColor: '#C71F3B',
    },

    logo: {
        width: 111,
        height: 111,
    },
    logotw: {
        width: height_logot,
        height: height_logot,
    },

    underlineStyleBase: {
        borderWidth: 0,
        borderBottomWidth: 3,
    },

    underlineStyleHighLighted: {
        borderColor: '#C71F3B',
    },

    containers: {
        width: '80%',
        margin: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    otptext: {
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 24,
    },
    tinyLogo: {
        width: Dimensions.get('window').width,
        height: 440,
        resizeMode: 'stretch',
    },
});
