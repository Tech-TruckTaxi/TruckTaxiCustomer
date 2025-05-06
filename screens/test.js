import {
    Alert,
    Dimensions,
    FlatList,
    Keyboard,
    KeyboardAvoidingView,
    Modal,
    PermissionsAndroid,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    ToastAndroid,
    TouchableOpacity,
    View,
  } from 'react-native';
  import React, {useEffect, useState, useRef} from 'react';
  import Geolocation from '@react-native-community/geolocation';
  import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
  import {useNavigation} from '@react-navigation/native';
  import Color from '../Global/Color';
  import MapViewDirections from 'react-native-maps-directions';
  import {get} from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
  const {width, height} = Dimensions.get('screen');
  import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
  import {Iconviewcomponent} from '../Global/Icontag';
  import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
  import axios from 'axios';
  import {Manrope} from '../Global/FontFamily';
  import RBSheet from 'react-native-raw-bottom-sheet';
  import {Time} from 'react-native-gifted-chat';
  import {duration} from 'moment';
  const Map_screen = () => {
    const refRBSheet = useRef();
  
    const navigation = useNavigation();
  
    const [origin, setOrigin] = useState({
      latitude: 11.0168,
      longitude: 76.9558,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
  
    const [modalVisible, setModalVisible] = useState(false);
  
    const [SearchResults, setSearchResults] = useState([
      {
        id: 1,
        name: 'Pickup',
      },
      {
        id: 2,
        name: 'Drop',
      },
    ]);
  
    const [SearchlistData, setSearchlistData] = useState({
      location: null,
      details: null,
    });
  
    const [selectedSearchResult, setSelectedSearchResult] = useState({
      id: 1,
      name: 'Pickup',
    });
    const [distance, setDistance] = useState({
      distance: null,
      Time: null,
    });
  
    const [location, setLocation] = useState({
      pickup: {
        latitude: 0,
        longitude: 0,
        pickup: false,
        Address: '',
      },
      drop: {
        latitude: 0,
        longitude: 0,
        drop: false,
        Address: '',
      },
    });
  
    useEffect(() => {
      requestPermission();
    }, []);
  
    // get Address from latitude and longitude
    const GetAddress = async item => {
      try {
        const apiKey = 'AIzaSyAOl88J2TyN1uxEENd8sjtYNq8Xa2nW4rk'; // Replace with your API key
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${item?.latitude},${item?.longitude}&key=${apiKey}`;
        const response = await axios.get(url);
        const {results} = response.data;
        if (results.length > 0) {
          const value = results[0]?.formatted_address;
          location?.pickup?.pickup == true
            ? setLocation({
                ...location,
                drop: {
                  latitude: item.latitude ?? 0,
                  longitude: item.longitude ?? 0,
                  drop: true,
                  Address: value,
                },
              })
            : setLocation({
                ...location,
                pickup: {
                  latitude: item.latitude ?? 0,
                  longitude: item.longitude ?? 0,
                  pickup: true,
                  Address: value,
                },
              });
        } else {
          return 'Address not found';
        }
      } catch (error) {
        console.log('Catch in Get Address', error);
      }
    };
  
    const getCurrentPosition = () => {
      console.log('vvvvvvvvvvv333333333333');
      Geolocation.getCurrentPosition(info => {
        GetAddress(info?.coords);
      });
    };
  
    const requestPermission = async (retry = true) => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Permission',
              message: 'This app needs access to your location.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );
          console.log('granted', granted);
          console.log('test', granted);
          console.log(
            'PermissionsAndroid.RESULTS.GRANTED==>',
            PermissionsAndroid.RESULTS.GRANTED,
          );
  
          if (granted === 'granted') {
            getCurrentPosition();
          } else {
            console.log('Location permission denied');
            Alert.alert(
              'Location Disabled',
              'Please enable location services for a better experience',
              [
                {text: 'Cancel', style: 'cancel'},
                {
                  text: 'Retry',
                  onPress: () => {
                    if (retry) {
                      requestPermission(false); // Retry only once
                    }
                  },
                },
              ],
            );
          }
        } catch (err) {
          console.warn(err);
        }
      } else {
        // For iOS, location permission is handled differently
        Geolocation.requestAuthorization('whenInUse').then(permission => {
          if (permission === 'granted') {
            getCurrentPosition();
          } else {
            Alert.alert(
              'Location Disabled',
              'Please enable location services for a better experience',
              [
                {text: 'Cancel', style: 'cancel'},
                {
                  text: 'Retry',
                  onPress: () => {
                    if (retry) {
                      requestPermission(false); // Retry only once on iOS
                    }
                  },
                },
              ],
            );
          }
        });
      }
    };
  
    const ConfirmLocation = () => {
      try {
        console.log('go to Home to get the location');
        if (location?.drop?.drop == true && location?.pickup?.pickup == true) {
          navigation.navigate('Home', {data: location, Distance: distance});
        } else {
          ToastAndroid.show(
            'Pleas Enter Pick and Drop Location is Mandatory',
            ToastAndroid.SHORT,
          );
        }
      } catch (error) {
        console.log('catch in confirmlocation ', error);
      }
    };
  
    return (
      <View style={{flex: 1}}>
        <View style={{backgroundColor:Color?.white,height:height/3}}>
          <GooglePlacesAutocomplete
                placeholder="Search"
                onPress={(data, details = null) => { 
                  setSearchlistData({
                    location: data?.description,
                    data: details?.geometry,
                  });
                }}
                
                nearbyPlacesAPI="GooglePlacesSearch" // Prioritize nearby results
                debounce={400}
                predefinedPlacesAlwaysVisible={true}
                styles={{
                  description: {
                    color: Color.black,
                  },
                  powered: {width: 0, height: 0},
                  textInputContainer: {
                    // flex: 1,
                    backgroundColor: 'white',
                    borderWidth: 1,
                    borderColor: '#D8D8D8',
                    borderRadius: 5,
                    marginHorizontal: 10,
                    marginTop: 10,
                    placeholderTextColor: '#000',
                  },
                  textInput: {
                    color: Color.black,
                    fontFamily: Manrope.SemiBold,
                    fontSize: 16,
                    paddingBottom: 0,
                  },
                  predefinedPlacesDescription: {
                    color: '#1faadb',
                  },
                }}
                renderRightButton={() => {
                  return (
                    <TouchableOpacity
                      style={{
                      
                        marginHorizontal: 10,
                        alignItems: 'center',
                        bottom: 0,
                        justifyContent: 'center',
                      }}
                      onPress={mapData => {
                        refRBSheet?.current?.open();
                      }}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: Manrope.SemiBold,
                          color: Color.DullOrange,
                        }}>
                        Done
                      </Text>
                    </TouchableOpacity>
                  );
                }}
                GooglePlacesDetailsQuery={{
                  fields: 'geometry',
                }}
                fetchDetails={true}
                textInputProps={{
                  leftIcon: {type: 'font-awesome', name: 'chevron-left'},
                  errorStyle: {color: 'red'},
                  placeholderTextColor: Color.cloudyGrey,
                  placeholder:"Pickup & Drop Location",
                  onFocus:()=>{
                    console.log("dklvnjkvnfjbnjbn");
                  },
               
                  
                  
                }}
                query={{
                  key: 'AIzaSyAOl88J2TyN1uxEENd8sjtYNq8Xa2nW4rk',
                  language: 'en',
                  components: 'country:in',
                  location: '10.7905,78.7047',
                  radius: 200000,
                }}
                onFail={error =>
                  console.error('catch the GeoCoding error', error)
                }
              />
        </View>
        <View style={{width: width, height: height / 1.9, flex: 1}}>
        
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={origin}
            showsUserLocation={true}
            followsUserLocation={true}
            showsMyLocationButton={true}
            onPress={e => {
              GetAddress(e.nativeEvent.coordinate);
            }}>
            <Marker
              draggable
              coordinate={{
                latitude: location.pickup?.latitude,
                longitude: location.pickup?.longitude,
              }}
              onDragEnd={async e => {
                console.log('start ======== ', e.nativeEvent.coordinate);
                try {
                  const apiKey = 'AIzaSyAOl88J2TyN1uxEENd8sjtYNq8Xa2nW4rk';
                  const {latitude, longitude} = e.nativeEvent.coordinate; // Replace with your API key
                  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
                  const response = await axios.get(url);
                  const {results} = response.data;
                  if (results.length > 0) {
                    const value = results[0]?.formatted_address;
                    setLocation({
                      ...location,
                      pickup: {
                        latitude: latitude ?? 0,
                        longitude: longitude ?? 0,
                        pickup: true,
                        Address: value,
                      },
                    });
                    console.log('Address updated:', value);
                  } else {
                    console.log('No address found for these coordinates.');
                  }
                } catch (error) {
                  console.log('Error in onDragEnd', error);
                }
              }}
              title={'Pickup Location'}
              description={'Drag to change Pickup location'}
              pinColor={'#884190'}
            />
            {location?.pickup?.pickup && (
              <Marker
                draggable
                coordinate={{
                  latitude: location.drop?.latitude,
                  longitude: location.drop?.longitude,
                }}
                onDragEnd={async e => {
                  try {
                    const apiKey = 'AIzaSyAOl88J2TyN1uxEENd8sjtYNq8Xa2nW4rk';
                    const {latitude, longitude} = e.nativeEvent.coordinate; // Replace with your API key
                    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
                    const response = await axios.get(url);
                    const {results} = response.data;
                    if (results.length > 0) {
                      const value = results[0]?.formatted_address;
                      setLocation({
                        ...location,
                        drop: {
                          latitude: latitude ?? 0,
                          longitude: longitude ?? 0,
                          drop: true,
                          Address: value,
                        },
                      });
                      console.log('Address updated:', value);
                    } else {
                      console.log('No address found for these coordinates.');
                    }
                  } catch (error) {
                    console.log('Error in onDragEnd', error);
                  }
                }}
                title={'Drop Location'}
                description={'Drag to change Drop location'}
                pinColor={'#884190'}
              />
            )}
            {location?.pickup?.pickup && location?.drop?.drop && (
              <MapViewDirections
                origin={{
                  latitude: location.pickup?.latitude,
                  longitude: location.pickup?.longitude,
                }}
                destination={{
                  latitude: location.drop?.latitude,
                  longitude: location.drop?.longitude,
                }}
                apikey={'AIzaSyAOl88J2TyN1uxEENd8sjtYNq8Xa2nW4rk'}
                strokeWidth={3}
                strokeColor={'#884190'}
                onReady={result => {
                  setDistance({
                    distance: result?.distance,
                    Time: result?.duration,
                  });
                }}
              />
            )}
          </MapView>
        </View>
        <ScrollView style={{backgroundColor: Color?.white, flex: 1}}>
          <View
            style={{
              flex: 1,
              backgroundColor: Color?.white,
              padding: 10,
            }}>
            <View style={{gap: 10}}>
              <Text
                style={{
                  color: Color?.black,
                  fontSize: 16,
                  fontWeight: '500',
                }}>
                Pickup & Drop Location
              </Text>
              <Pressable
                style={{
                  borderWidth: 1,
                  borderRadius: 10,
                  borderColor: Color?.grey,
                  marginBottom: 10,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingHorizontal: 10,
                }}
                onPress={() => {
                  setModalVisible(true);
                }}>
                <Text
                  style={{
                    color: Color?.black,
                    fontSize: 16,
                    fontWeight: '200',
                    padding: 10,
                  }}>
                  Pickup & Drop Location
                </Text>
                <Iconviewcomponent
                  Icontag={'Feather'}
                  iconname={'search'}
                  icon_size={20}
                  iconstyle={{color: Color?.grey}}
                />
              </Pressable>
            </View>
            <View
              style={{
                borderWidth: 1,
                borderColor: Color?.grey,
                padding: 10,
                borderRadius: 10,
                gap: 10,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 10,
                    alignItems: 'center',
                  }}>
                  <Iconviewcomponent
                    Icontag={'FontAwesome6'}
                    iconname={'location-dot'}
                    icon_size={20}
                    iconstyle={{
                      color: location?.pickup?.pickup ? 'green' : Color?.red,
                    }}
                  />
                  <View
                    style={{
                      width: width * 0.5,
                    }}>
                    <Text
                      style={{
                        fontWeight: '300',
                        color: location?.pickup?.pickup ? 'green' : Color?.red,
                        fontSize: 16,
                      }}>
                      Pickup Location
                    </Text>
                    <Text
                      style={{
                        fontWeight: '500',
                        color: location?.pickup?.pickup ? 'green' : Color?.red,
                        fontSize: 16,
                      }}>
                      {`${
                        location?.pickup?.pickup
                          ? location?.pickup?.Address
                          : 'pickup Location'
                      }`}
                    </Text>
                  </View>
                </View>
                <View>
                  {location?.pickup?.pickup ? (
                    <Iconviewcomponent
                      Icontag={'AntDesign'}
                      iconname={'checkcircle'}
                      icon_size={20}
                      iconstyle={{
                        color: 'green',
                      }}
                    />
                  ) : (
                    <Text
                      style={{
                        fontWeight: '500',
                        color: location?.drop?.drop ? Color?.black : Color?.red,
                        fontSize: 12,
                        textTransform: 'capitalize',
                      }}>
                      not selected
                    </Text>
                  )}
                </View>
              </View>
              <View
                style={{
                  borderTopWidth: 1,
                  borderColor: Color?.grey,
                }}
              />
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    gap: 10,
                    alignItems: 'center',
                  }}>
                  <Iconviewcomponent
                    Icontag={'FontAwesome6'}
                    iconname={'location-arrow'}
                    icon_size={20}
                    iconstyle={{
                      color: location?.drop?.drop ? 'green' : Color?.red,
                    }}
                  />
                  <View
                    style={{
                      width: width * 0.5,
                    }}>
                    <Text
                      style={{
                        fontWeight: '300',
                        color: location?.drop?.drop ? 'green' : Color?.red,
                        fontSize: 16,
                      }}>
                      Drop Location
                    </Text>
                    <Text
                      style={{
                        fontWeight: '500',
                        color: location?.drop?.drop ? 'green' : Color?.red,
                        fontSize: 16,
                      }}>
                      {`${
                        location?.drop?.drop
                          ? location?.drop?.Address
                          : 'Drop Location'
                      }`}
                    </Text>
                  </View>
                </View>
                <View>
                  {location?.drop?.drop ? (
                    <Iconviewcomponent
                      Icontag={'AntDesign'}
                      iconname={'checkcircle'}
                      icon_size={20}
                      iconstyle={{
                        color: 'green',
                      }}
                    />
                  ) : (
                    <Text
                      style={{
                        fontWeight: '500',
                        color: Color?.red,
                        fontSize: 12,
                        textTransform: 'capitalize',
                      }}>
                      not selected
                    </Text>
                  )}
                </View>
              </View>
            </View>
          </View>
          {location?.pickup?.pickup && location?.drop?.drop ? (
            <View
              style={{
                padding: 15,
                backgroundColor: Color?.white,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              {distance?.Time ? (
                <View>
                  <Text
                    style={{
                      color: Color?.black,
                      fontWeight: '500',
                      fontSize: 16,
                      textTransform: 'capitalize',
                    }}>
                    Time
                  </Text>
                  <Text
                    style={{
                      color:'#884190',
                      fontWeight: '500',
                      fontSize: 16,
                      textTransform: 'uppercase',
                    }}>
          {Math.round(distance?.Time) + ' min'}
                  </Text>
                </View>
              ) : null}
  
              {distance?.distance ? (
                <View>
                  <Text
                    style={{
                      color: Color?.black,
                      fontWeight: '500',
                      fontSize: 16,
                      textTransform: 'capitalize',
                    }}>
                    Duration
                  </Text>
                  <Text
                    style={{
                      color:'#884190',
                      fontWeight: '500',
                      fontSize: 16,
                      textTransform: 'uppercase',
                    }}>
                  {distance?.distance ? `${Math.round(distance?.distance)} KM` : null}
                  </Text>
                </View>
              ) : null}
            </View>
          ) : null}
          <TouchableOpacity
            disabled={
              location?.pickup?.pickup && location?.drop?.drop ? false : true
            }
            onPress={() => ConfirmLocation()}
            style={{
              padding: 10,
              backgroundColor:
                location?.pickup?.pickup && location?.drop?.drop
                  ? '#884190'
                  : '#dda0dd',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              gap: 10,
            }}>
            <Text
              style={{
                color: Color.white,
                fontSize: 16,
              }}>
              Confirm Location
            </Text>
            <Iconviewcomponent
              Icontag={'FontAwesome'}
              iconname={'arrow-circle-right'}
              icon_size={20}
              iconstyle={{color: Color?.white}}
            />
          </TouchableOpacity>
        </ScrollView>
        <Modal
          animationType="none"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}>
          <ScrollView
            style={{flex: 1, backgroundColor: '#0000008', padding: 10}}
            keyboardShouldPersistTaps="always">
            <View style={{gap: 10, flex: 1}}>
              <Text
                style={{
                  fontWeight: '500',
                  fontSize: 16,
                  color: Color?.black,
                  textTransform: 'capitalize',
                }}>
                search pickup & drop location
              </Text>
              <GooglePlacesAutocomplete
                placeholder="Search"
                onPress={(data, details = null) => { 
                  setSearchlistData({
                    location: data?.description,
                    data: details?.geometry,
                  });
                }}
                nearbyPlacesAPI="GooglePlacesSearch" // Prioritize nearby results
                debounce={400}
                predefinedPlacesAlwaysVisible={true}
                styles={{
                  description: {
                    color: Color.black,
                  },
                  powered: {width: 0, height: 0},
                  textInputContainer: {
                    flex: 1,
                    backgroundColor: 'white',
                    borderWidth: 1,
                    borderColor: '#D8D8D8',
                    borderRadius: 5,
                    marginHorizontal: 10,
                    marginTop: 10,
                    placeholderTextColor: '#000',
                  },
                  textInput: {
                    color: Color.black,
                    fontFamily: Manrope.SemiBold,
                    fontSize: 16,
                    paddingBottom: 0,
                  },
                  predefinedPlacesDescription: {
                    color: '#1faadb',
                  },
                }}
                renderRightButton={() => {
                  return (
                    <TouchableOpacity
                      style={{
                        // position: 'absolute',
                        // top: 0,
                        // zIndex: 1,
                        marginHorizontal: 10,
                        alignItems: 'center',
                        bottom: 0,
                        justifyContent: 'center',
                      }}
                      onPress={mapData => {
                        refRBSheet?.current?.open();
                      }}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontFamily: Manrope.SemiBold,
                          color: Color.DullOrange,
                        }}>
                        Done
                      </Text>
                    </TouchableOpacity>
                  );
                }}
                GooglePlacesDetailsQuery={{
                  fields: 'geometry',
                }}
                fetchDetails={true}
                textInputProps={{
                  leftIcon: {type: 'font-awesome', name: 'chevron-left'},
                  errorStyle: {color: 'red'},
                  placeholderTextColor: Color.cloudyGrey,
                }}
                query={{
                  key: 'AIzaSyAOl88J2TyN1uxEENd8sjtYNq8Xa2nW4rk',
                  language: 'en',
                  components: 'country:in',
                  location: '10.7905,78.7047',
                  radius: 200000,
                }}
                onFail={error =>
                  console.error('catch the GeoCoding error', error)
                }
              />
             
            </View>
          </ScrollView>
        </Modal>
        {/* Buttom Sheet */}
        <RBSheet
          ref={refRBSheet}
          closeOnDragDown={true}
          closeOnPressMask={true}
          height={200}
          customStyles={{
            wrapper: {
              backgroundColor: '#00000088',
            },
            container: {
              backgroundColor: 'white',
            },
          }}>
          <View style={{flex: 1}}>
            <View style={{margin: 20, gap: 10, flex: 1}}>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 10,
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: Manrope.SemiBold,
                    color: Color.primary,
                    textAlign: 'center',
                  }}>
                  Select Pickup / Drop Location
                </Text>
              </View>
              {SearchResults?.map((item, index) => {
                const selected = item?.id === selectedSearchResult?.id;
                return (
                  <TouchableOpacity
                    key={index}
                    style={{flexDirection: 'row', gap: 10, alignItems: 'center'}}
                    onPress={() => {
                      setSelectedSearchResult(item);
                    }}>
                    <Iconviewcomponent
                      Icontag={'Fontisto'}
                      iconname={
                        selected ? 'radio-btn-active' : 'radio-btn-passive'
                      }
                      icon_size={20}
                      iconstyle={{color:'#884190'}}
                    />
                    <Text
                      style={{
                        fontFamily: Manrope.SemiBold,
                        fontSize: 16,
                        color: Color.black,
                      }}>
                      {`${item?.name} Location`}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <TouchableOpacity
              style={{
                backgroundColor:'#884190',
                padding: 10,
                alignItems: 'center',
              }}
              onPress={() => {
                if (selectedSearchResult?.name == 'Drop') {
                  setLocation({
                    ...location,
                    drop: {
                      latitude: SearchlistData?.data?.location?.lat ?? 0,
                      longitude: SearchlistData?.data?.location?.lng ?? 0,
                      drop: true,
                      Address: SearchlistData?.location,
                    },
                  });
                  refRBSheet.current.close();
                  setModalVisible(false);
                } else {
                  setLocation({
                    ...location,
                    pickup: {
                      latitude: SearchlistData?.data?.location?.lat ?? 0,
                      longitude: SearchlistData?.data?.location?.lng ?? 0,
                      pickup: true,
                      Address: SearchlistData?.location,
                    },
                  });
                  refRBSheet.current.close();
                  setModalVisible(false);
                }
              }}>
              <Text
                style={{
                  color: Color?.white,
                  fontFamily: Manrope.SemiBold,
                  textTransform: 'capitalize',
                  fontSize: 16,
                }}>
                Apply
              </Text>
            </TouchableOpacity>
          </View>
        </RBSheet>
      </View>
    );
  };
  
  export default Map_screen;
  
  const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      paddingBottom: 20,
    },
    map: {
      flex: 1,
      width: width * 1,
      height: height * 0.58,
    },
    inputContainer: {
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
      backgroundColor: Color.white,
      paddingHorizontal: width * 0.06,
      paddingVertical: height * 0.0,
    },
    headerText: {
      color: Color.black,
      padding: width * 0.02,
      paddingBottom: height * 0.06,
      fontWeight: 'bold',
    },
    ///////////
    autocompleteView: {
      position: 'absolute',
      right: 20,
      top: height * 0.05,
      width: width * 0.9,
      zIndex: 99,
    },
    ///////////
    DDView: {
      marginTop: height * 0.03,
      flexDirection: 'row',
      justifyContent: 'center',
      gap: width * 0.1,
    },
    DDText: {
      fontSize: 14,
      color: Color.black,
    },
    inputContainer1: {
      borderWidth: 1,
      borderColor: 'black',
      borderRadius: 6,
      marginTop: height * 0.02,
      marginBottom: height * 0.002,
    },
    inputContainer2: {
      flexDirection: 'row',
      overflow: 'hidden',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: width * 0.01,
      paddingHorizontal: width * 0.05,
    },
    inputContainer3: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      gap: width * 0.08,
    },
    locationText: {
      color: Color.red,
    },
    location: {
      width: width * 0.5,
      color: 'red',
      fontWeight: 'bold',
    },
    select: {
      fontSize: 12,
      color: Color.red,
      fontWeight: 'bold',
    },
    line: {
      marginVertical: height * 0.002,
      borderBottomColor: '#cccccc', // Adjust the color as needed
      borderBottomWidth: 1,
      width: '100%', // Adjust the width as needed
    },
    next: {
      backgroundColor: Color.primary,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 10,
      gap: 5,
      height: 50,
      marginVertical: 10,
      borderRadius: 5,
    },
    nextText: {
      fontSize: 16,
      color: Color.white,
    },
  });
  