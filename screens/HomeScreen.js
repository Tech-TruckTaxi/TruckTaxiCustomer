import React, { useEffect, useRef, useState} from 'react';
import {
  View,
  PermissionsAndroid,
  ToastAndroid,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  FlatList,
  ScrollView,
  TextInput,
  Platform,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const {width, height} = Dimensions.get('window');
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useSelector} from 'react-redux';
import {
  selectDestination,
  selectOrigin,
} from '../slices/navSlice';
import RNRestart from 'react-native-restart';
import moment from 'moment';
import messaging from '@react-native-firebase/messaging';
import DatePicker from 'react-native-date-picker';
import Color from '../Global/Color';
import {Manrope} from '../Global/FontFamily';
import {Iconviewcomponent} from '../Global/Icontag';
import RBSheet from 'react-native-raw-bottom-sheet';

const HomeScreen = ({navigation, route}) => {
  const {width, height} = Dimensions.get('window');
  const [showLoading, setshowLoading] = useState(false);
  const [vehcilelist, setvehcilelist] = useState([]);
  const [tripType, settripType] = React.useState([]);
  
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  const [initorigin, setinitorigin] = useState('');
  const [initdrop, setinitdrop] = useState('');
  const [dateobj, setDate] = useState();
  const [show, setShow] = useState(false);
 
  const [tdate, settDate] = useState(new Date());
  const [vehicleType, setVehicleType] = useState([
    {
      id: 1,
      name: 'open type',
    },
    {
      id: 2,
      name: 'closed type',
    },
  ]);
  const [intercitydata, setIntercitydata] = useState({
    baseminute: 0,
    basekm: 0,
    basefare: 0,
  });

  // ================NEW WORK =======================
  const [goodType, setgoodType] = React.useState([]);
  const [vehicleselected, setvehicleselected] = useState('');
  const [selectedVehicletype, setselectedVehicletype] = useState({
    id: 1,
    name: 'open type',
  });
  const [selectedGoodsType, setSelectedGoodsType] = useState('');
  const [selectedfareType, setSelectedFareType] = useState('');
  const [Tripcount, settripcount] = useState([
    {
      index: 0,
      count: 1,
    },
    {
      index: 1,
      count: 2,
    },
    {
      index: 2,
      count: 3,
    },
    {
      index: 3,
      count: 4,
    },
    {
      index: 4,
      count: 5,
    },
  ]);
  const [selectedtripcount, setselectedtripcount] = useState({
    index: 0,
    count: 1,
  });
  const [isfarepac, setisfarepac] = useState(false);
  const [isgoodsty, setIsgoodsty] = useState(false);
  const [Farevalue, setFarevalue] = useState([]);
  const [selectedFarevalue, setselectedFarevalue] = useState([]);
  const refRBSheet = useRef();
  const [mobilenumber, setMobileNumber] = useState('');
  const refRBSheetGoodsType = useRef();
  const refRBSheetFareType = useRef();
  const refRBSheettripcount = useRef();
  const refRBSheetVehicleFare = useRef();
  const refRBSheetHours = useRef();
  const [ChooseVehicle, setChoosevehicle] = useState(null);
  const [Hours, setHours] = useState([
    {
      id: 1,
      hours: '1 hour',
    },
    {
      id: 2,
      hours: '2 hours',
    },
    {
      id: 3,
      hours: '3 hours',
    },
    {
      id: 6,
      hours: '6 hours',
    },
    {
      id: 9,
      hours: '9 hours',
    },
    {
      id: 12,
      hours: '12 hours',
    },
  ]);
  const [selecthours, setSelecthours] = useState(null);
  useEffect(() => {
    var date = moment().format('DD/MM/YYYY hh:mm A');
    setDate(date);

    navigation.setOptions({
      title: <Text>Create Load</Text>,
      headerRight: () => (
        <View style={{flexDirection: 'row'}}>
          <FontAwesome
            style={{padding: 10}}
            onPress={() => {
              refresh();
            }}
            name="refresh"
            size={20}
            backgroundColor="#ffffff"
            color="#85388d"
          />
        </View>
      ),
    });
  }, []);

  useEffect(() => {
    if (route?.params?.Distance.distance > 25) {
      Getintercityfun();
    }
  }, [route?.params?.Distance.distance != undefined]);

  useEffect(() => {
    if (!origin) {
      setinitorigin('Please Select Pickup location');
      setinitdrop('Please Select Drop location');
      return;
    }
    setinitorigin(origin.description);
    if (!destination) return;
    setinitdrop(destination.description);
  }, [origin, destination]);

  useEffect(() => {
    AsyncStorage.getItem('userdata').then(userdata => {
      AsyncStorage.getItem('userToken').then(value => {
        let parseddata = JSON.parse(userdata);
        let myHeaders = new Headers();
        myHeaders.append('Authorization', 'Bearer ' + value);
        myHeaders.append('Content-Type', 'application/json');
        messaging()
          .getToken()
          .then(token => {
            var raw = JSON.stringify({
              customerid: parseddata.customerid,
              registrationtoken: token,
            });

            var requestOptions = {
              method: 'POST',
              headers: myHeaders,
              redirect: 'follow',
              body: raw,
            };
            fetch(
              'https://trucktaxi.co.in/api/customer/updateToken',
              requestOptions,
            )
              .then(response => response.json())
              .then(result => {
                console.log(result);
              })
              .catch(error => console.log('error', error));
          });

        return messaging().onTokenRefresh(token => {
          var raw = JSON.stringify({
            customerid: parseddata.customerid,
            registrationtoken: token,
          });

          var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            redirect: 'follow',
            body: raw,
          };
          fetch(
            'https://trucktaxi.co.in/api/customer/updateToken',
            requestOptions,
          )
            .then(response => response.json())
            .then(result => {
              console.log(result);
            })
            .catch(error => console.log('error', error));
        });
      });
    });
  }, []);

  const refresh = () => {
    RNRestart.Restart();
  };

  useEffect(() => {
    reload();
  }, []);

  // GET VEHICLE DATA :
  const GetVehicledata = async (data, fare, hour) => {
    try {
      console.log('SelectedGoodsType', data);
      console.log('data', fare);
      console.log('hour', hour);
      console.log('<======================>');

      AsyncStorage.getItem('userdata')
        .then(userdata => {
          let parseddata = JSON.parse(userdata);

          AsyncStorage.getItem('userToken').then(value => {
            var myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer ' + value);
            var requestOptions = {
              method: 'GET',
              headers: myHeaders,
              redirect: 'follow',
            };
            // if(=="")
            console.log('selectedfareType', fare);
            console.log('hour', hour);
            console.log('parseddata.cityid', parseddata.cityid);

            if (fare?.name == 'Meter Fare') {
              const distancevalue = Math.round(data);
              fetch(
                `https://trucktaxi.co.in/api/customer/getmeterfareforall?distance=${distancevalue}&cityid=${parseddata.cityid}`,
                requestOptions,
              )
                .then(response => response.json())
                .then(result => {
                  console.log('XXXXXXXXXXX', result?.data);

                  setChoosevehicle(result?.data);
                  setvehicleselected(result?.data[0]);
                });
            } else {
              if (fare?.name == 'Package Fare') {
                const distancevalue = Math.round(data);
                console.log('dtattttt', hour, parseddata.cityid, distancevalue);

                fetch(
                  `https://trucktaxi.co.in/api/customer/getpackagesforall?hours=${hour?.id}&cityid=${parseddata.cityid}&distance=${distancevalue}`,
                  requestOptions,
                )
                  .then(response => response.json())
                  .then(result => {
                    console.log('XXXXXXXXXXXpackage', result?.data);

                    setChoosevehicle(result?.data);
                    setvehicleselected(result?.data[0]);
                  });
                console.log('Package fare data');
              } else {
                if (fare?.name == 'Night Fare') {
                  const distancevalue = Math.round(data);
                  fetch(
                    `https://trucktaxi.co.in/api/customer/getnightfareallvehicles?hours=${hour?.id}&cityid=${parseddata.cityid}&distance=${distancevalue}`,
                    requestOptions,
                  )
                    .then(response => response.json())
                    .then(result => {
                      console.log('CCCCCCC NIGHTFARE', result?.data);

                      setChoosevehicle(result?.data);
                      setvehicleselected(result?.data[0]);
                    });
                  console.log('Night fare data');
                } else {
                  if (fare?.name == 'Intercity Fare') {
                    const distancevalue = Math.round(data);
                    fetch(
                      `https://trucktaxi.co.in/api/customer/getinterbaseamount?distance=${distancevalue}`,
                      requestOptions,
                    )
                      .then(response => response.json())
                      .then(result => {
                        console.log('CCCCCCC INTERCITY', result?.data);
                        setChoosevehicle(result?.data);
                        setvehicleselected(result?.data[0]);
                      });
                    console.log('INTERCITY fare data');
                  } else {
                    console.log('ssssssssss data');
                  }
                }
              }
            }
          });
        })
        .catch(error => console.log('CATCH IN GetVehicledata', error));
    } catch (error) {
      console.log('Catch IN GetVehicledata : ', error);
    }
  };
  // GET INTERCITY DATA :

  const Getintercitydata = async data => {
    try {
      console.log('TOTAL DISTANCE', data);
      AsyncStorage.getItem('userToken')
        .then(value => {
          var myHeaders = new Headers();
          myHeaders.append('Authorization', 'Bearer ' + value);
          var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow',
          };
          fetch(
            `https://trucktaxi.co.in/api/customer/getinterbaseamount?distance=${data}`,
            requestOptions,
          )
            .then(response => response.json())
            .then(result => {
              console.log('<====== GET CHOOSE VEHICLE =====>: ', result?.data);
              setChoosevehicle(result?.data);
              console.log('xxxxxxxxxxx', result?.data[0]);
              setvehicleselected(result?.data[0]);
            });
        })
        .catch(error => console.log('CATCH IN Getintercitydata', error));
    } catch (error) {
      console.log('Catch IN Getintercitydata : ', error);
    }
  };

  useEffect(() => {
    if (!!route?.params?.Distance) {
      console.log('Checking for Distance', route?.params?.Distance);
      if (route?.params?.Distance?.distance > 25) {
        Getintercitydata(route?.params?.Distance?.distance);
      } else {
        GetVehicledata(
          route?.params?.Distance?.distance,
          selectedfareType,
          selecthours,
        );
        console.log(
          'GetVehicledataGetVehicledataGetVehicledataGetVehicledataGetVehicledataGetVehicledataGetVehicledata',
        );
      }
    }
  }, [route?.params?.Distance]);

  const reload = () => {
    setshowLoading(true);
    requestLocationPermission();
    AsyncStorage.getItem('userdata').then(userdata => {
      AsyncStorage.getItem('userToken').then(value => {
        let parseddata = JSON.parse(userdata);
        var myHeaders = new Headers();
        myHeaders.append('Authorization', 'Bearer ' + value);
        AsyncStorage.getItem('newuser').then(status => {
          if (status == 'New') {
            navigation.navigate('profileScreen');
            ToastAndroid.show('Update Your Profile', ToastAndroid.SHORT);
            setshowLoading(false);
          }
        });
        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow',
        };

        fetch(
          'https://trucktaxi.co.in/api/customer/getvehicletypes?cityid=' +
            parseddata.cityid,
          requestOptions,
        )
          .then(response => response.json())
          .then(result => {
            setshowLoading(false);
            setvehcilelist(result.data);
            setvehicleselected(result.data[0]);
          })
          .catch(error => {
            setshowLoading(false);
          });

        fetch(
          'https://trucktaxi.co.in/api/customer/getgoodstypes',
          requestOptions,
        )
          .then(response => response.json())
          .then(result => {
            setgoodType(result.data);
            // setSelectedGoodsType(result.data[0]);
          })
          .catch(error => console.log('error', error));

        fetch(
          'https://trucktaxi.co.in/api/customer/gettriptypes',
          requestOptions,
        )
          .then(response => response.json())
          .then(result => {
            // console.log(result)
            setshowLoading(false);
            settripType(result.data);
            setSelectedFareType(result.data[0]);
          })
          .catch(error => console.log('error', error));
      });
    });
  };

  const requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Truck Taxi',
          message: 'Allow us you use your location.',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the location');
      } else {
        console.log('location permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const onChange = dated => {
    try {
      var ndate = moment(dated).format('DD/MM/YYYY hh:mm A');
      setDate(ndate);
      console.log(ndate);
    } catch (error) {
      console.log('error', error);
    }
  };

  if (showLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const selectedFaretype = item => {
    // AsyncStorage.getItem('userdata').then(userdata => {
    //   AsyncStorage.getItem('userToken').then(value => {
    //     let parseddata = JSON.parse(userdata);
    //     var myHeaders = new Headers();
    //     myHeaders.append('Authorization', 'Bearer ' + value);
    //     var requestOptions = {
    //       method: 'GET',
    //       headers: myHeaders,
    //       redirect: 'follow',
    //     };
    //     console.log('====================================');
    //     console.log(parseddata.cityid);
    //     console.log('====================================');
    //     console.log('====================================');
    //     console.log(item?.name, '0000000000000mmmm', vehicleselected?.id);
    //     console.log('====================================');
    //     if (item?.name == 'Package Fare') {
    //       fetch(
    //         'https://trucktaxi.co.in/api/customer/getpackages?vehicleid=' +
    //           vehicleselected.id +
    //           '&cityid=' +
    //           parseddata.cityid,
    //         requestOptions,
    //       )
    //         .then(response => response.json())
    //         .then(result => {
    //           setshowLoading(false);
    //           console.log('<====== Package Fare =====>: ', result?.data);
    //           const sortedPackages = result?.data.sort((a, b) => {
    //             const hoursA = parseInt(a.baseminute);
    //             const hoursB = parseInt(b.baseminute);
    //             return hoursA - hoursB;
    //           });
    //           setFarevalue(sortedPackages);
    //           setselectedFarevalue(sortedPackages[0]);
    //           // loadpackage();
    //         })
    //         .catch(error => console.log('catch in get_Package_list:', error));
    //     } else {
    //       if (item?.name == 'Intercity Fare') {
    //         console.log('intercity fare', requestOptions);
    //         // console.log("Distance ================= :", route.params?.Distance.distance);
    //         const requestOptions = {
    //           method: 'GET',
    //           redirect: 'follow',
    //         };
    //         fetch(
    //           'https://trucktaxi.co.in/api/customer/getinterbaseamount?distance=' +
    //             route.params?.Distance.distance +
    //             '&vehicletype=' +
    //             vehicleselected.id,
    //           requestOptions,
    //         )
    //           .then(response => response.json())
    //           .then(result => {
    //             console.log('InterCity Fare Result *************** ', result);
    //             setshowLoading(false);
    //             setFarevalue(result?.data);
    //             // setselectInterBaseValue(result?.data)
    //             setselectedFarevalue(result?.data[0]);
    //           })
    //           .catch(error =>
    //             console.error('catch in getinterbase_amount :', error),
    //           );
    //       } else {
    //         if (item?.name == 'Night Fare') {
    //           console.log('night fare');
    //           fetch(
    //             'https://trucktaxi.co.in/api/customer/getnightfare?vehicleid=' +
    //               vehicleselected?.id +
    //               '&cityid=' +
    //               parseddata.cityid,
    //             requestOptions,
    //           )
    //             .then(response => response.json())
    //             .then(result => {
    //               console.log(
    //                 '<====== Night Fare ==================>: ',
    //                 result,
    //               );
    //               setshowLoading(false);
    //               setFarevalue(result?.data);
    //               setselectedFarevalue(result?.data[0]);
    //               // loadnight();
    //             })
    //             .catch(error => console.log('catch in get_night_list:', error));
    //         }
    //       }
    //     }
    //   });
    // });
  };

  const booking = () => {
    if (route.params == undefined || selectedGoodsType == '') {
      ToastAndroid.show(
        'Please Select All Mandatory Fields',
        ToastAndroid.SHORT,
      );
    } else {
      const [day, month, year] = dateobj.split(' ')[0].split('/');
      const dateOnly = `${year}-${month}-${day}`;
      const time = dateobj.split(' ')[1] + ' ' + dateobj.split(' ')[2];  
      navigation.navigate('offer', {
        location: route?.params?.data,
        Distance: route.params?.Distance,
        selectedvehcilelist: vehicleselected,
        tripValue:
          route?.params?.Distance.distance > 25
            ? 'Intercity Fare'
            : selectedfareType?.name,
        packageid:
          route?.params?.Distance.distance > 25
            ? ''
            : selectedfareType?.name == 'Package Fare'
            ? vehicleselected?.id
            : '',
        interID:
          route?.params?.Distance.distance > 25
            ? ''
            : selectedfareType?.name == 'Intercity Fare'
            ? vehicleselected?.id
            : '',
        nightID:
          route?.params?.Distance.distance > 25
            ? ''
            : selectedfareType?.name == 'Night Fare'
            ? vehicleselected?.id
            : '',
        goodValue: selectedGoodsType,
        tripTypeid:
          route?.params?.Distance.distance > 25
            ? 3
            : selectedfareType?.name == 'Night Fare'
            ? 4
            : selectedfareType?.name == 'Intercity Fare'
            ? 3
            : selectedfareType?.name == 'Package Fare'
            ? 2
            : 1,
        Packagevalue:
          selectedfareType?.name == 'Package Fare' ? selectedFarevalue : '',
        intercityselcted:
          selectedfareType?.name == 'Intercity Fare' ? selectedFarevalue : '',
        nightSelcted:
          selectedfareType?.name == 'Night Fare' ? selectedFarevalue : '',
        // tripcount: countvalue,
        time: time,
        datetosend: dateOnly,
        alternativemobno: mobilenumber,
        iscv:selectedVehicletype?.name == "open type" ? false : true ,
        nightFareType:
          selectedfareType?.name == 'Night Fare' ? selectedFarevalue : '',
      });
    }
  };

  const Getintercityfun = async () => {
    try {
      if (route?.params?.Distance.distance >= 25) {
        const requestOptions = {
          method: 'GET',
          redirect: 'follow',
        };
        console.log(
          ' route.params?.Distance.distance',
          route.params?.Distance.distance,
        );

        fetch(
          'https://trucktaxi.co.in/api/customer/getinterbaseamount?distance=' +
            route.params?.Distance.distance +
            '&vehicletype=' +
            vehicleselected.id,
          requestOptions,
        )
          .then(response => response.json())
          .then(result => {
            setshowLoading(false);
            if (
              !result ||
              !result.data ||
              !Array.isArray(result.data) ||
              result.data.length === 0
            ) {
              throw new Error('Invalid response: Data is undefined or empty');
            }
            setIntercitydata(result?.data[0]);
          })
          .catch(error =>
            console.error('catch in getinterbase_amount :', error),
          );
      }
    } catch (error) {
      console.log('Catch IN Intercity', error);
    }
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView
        style={{
          flex: 1,
          padding: 10,
          backgroundColor: '#D4D3D3',
          marginTop: 3,
        }}
      
        >
        <View style={{flex: 1}}>
          <View style={{gap: 10}}>
            <View style={{marginTop: 10}}>
              {route?.params == undefined ? (
                <View>
                  <View
                    style={{
                      gap: 10,
                    }}>
                    <View style={{gap: 35}}>
                      <Text
                        style={{
                          fontSize: 18,
                          color: Color.black,
                          fontFamily: Manrope.Medium,
                          textTransform: 'capitalize',
                        }}>
                        Pickup & Drop Location :
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={{
                        backgroundColor: Color?.primary,
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 15,
                        borderRadius: 30,
                        flexDirection: 'row',
                        gap: 20,
                      }}
                      onPress={() => navigation.navigate('Map_screen')}>
                      <Iconviewcomponent
                        Icontag={'FontAwesome6'}
                        iconname={'location-dot'}
                        icon_size={20}
                        icon_color={Color.white}
                      />
                      <Text
                        style={{
                          color: Color.white,
                          fontFamily: Manrope.Medium,
                          textTransform: 'capitalize',
                          fontSize: 16,
                          width: width / 1.45,
                        }}>
                        Choose Location
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={{gap: 10}}>
                  <View
                    style={{
                      gap: 10,
                    }}>
                    <View>
                      <Text
                        style={{
                          fontSize: 18,
                          color: Color.black,
                          fontFamily: Manrope.Medium,
                          textTransform: 'capitalize',
                        }}>
                        Pickup Location :
                      </Text>
                    </View>
                    <View
                      style={{
                        backgroundColor: '#EEEEEE',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 15,
                        borderRadius: 30,
                        flexDirection: 'row',
                        gap: 20,
                      }}>
                      <Iconviewcomponent
                        Icontag={'FontAwesome6'}
                        iconname={'location-dot'}
                        icon_size={20}
                        icon_color={Color.black}
                      />
                      <Text
                        style={{
                          fontSize: 16,
                          color: Color.black,
                          fontFamily: Manrope.Medium,
                          textTransform: 'capitalize',
                          width: width / 1.7,
                        }}
                        numberOfLines={1}
                       
                      >
                        {route.params?.data?.pickup?.Address}
                      </Text>
                    
                      <Iconviewcomponent
                        Icontag={'MaterialIcons'}
                        iconname={'edit'}
                        icon_size={20}
                        icon_color={Color.primary}
                        onpress={() => {
                          navigation.navigate('Map_screen', {
                            data: {pickup: true},
                          });
                        }}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      gap: 10,
                    }}>
                    <View>
                      <Text
                        style={{
                          fontSize: 18,
                          color: Color.black,
                          fontFamily: Manrope.Medium,
                          textTransform: 'capitalize',
                        }}>
                        Drop Location :
                      </Text>
                    </View>
                    <View
                      style={{
                        backgroundColor: '#EEEEEE',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: 15,
                        borderRadius: 30,
                        flexDirection: 'row',
                        gap: 20,
                      }}>
                      <Iconviewcomponent
                        Icontag={'FontAwesome6'}
                        iconname={'location-dot'}
                        icon_size={20}
                        icon_color={Color.black}
                      />
                      <Text
                        style={{
                          fontSize: 16,
                          color: Color.black,
                          fontFamily: Manrope.Medium,
                          textTransform: 'capitalize',
                          width: width / 1.7,
                        }}
                       
                        numberOfLines={1}>
                        {route.params?.data?.drop?.Address}
                      </Text>
                      <Iconviewcomponent
                        Icontag={'MaterialIcons'}
                        iconname={'edit'}
                        icon_size={20}
                        icon_color={Color.primary}
                        onpress={() => {
                          navigation.navigate('Map_screen', {
                            data: {drop: true},
                          });
                        }}
                      />
                    </View>
                  </View>
                </View>
              )}
            </View>
            <View>
              <View
                style={{
                  gap: 19,
                  marginTop: 20,
                  marginBottom: 10,
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    color: Color.black,
                    fontFamily: Manrope.Medium,
                    textTransform: 'capitalize',
                  }}>
                  Vehicle Type : {}
                </Text>
                <View
                  style={{flexDirection: 'row', alignItems: 'center', gap: 40}}>
                  <Pressable
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                    }}
                    onPress={() => {
                      setselectedVehicletype({
                        id: 1,
                        name: 'open type',
                      });
                    }}>
                    <Iconviewcomponent
                      Icontag={'Fontisto'}
                      iconname={
                        selectedVehicletype?.id == 1
                          ? 'radio-btn-active'
                          : 'radio-btn-passive'
                      }
                      icon_size={20}
                      icon_color={
                        selectedVehicletype?.id == 1
                          ? Color.primary
                          : Color?.black
                      }
                    />
                    <Text
                      style={{
                        color:
                          selectedVehicletype?.id == 1
                            ? Color?.primary
                            : Color?.black,
                        fontSize: 18,
                        fontFamily: Manrope?.Regular,
                      }}>
                      Open Type
                    </Text>
                  </Pressable>
                  <Pressable
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                    }}
                    onPress={() => {
                      setselectedVehicletype({
                        id: 2,
                        name: 'Closed type',
                      });
                    }}>
                    <Iconviewcomponent
                      Icontag={'Fontisto'}
                      iconname={
                        selectedVehicletype?.id == 2
                          ? 'radio-btn-active'
                          : 'radio-btn-passive'
                      }
                      icon_size={20}
                      icon_color={
                        selectedVehicletype?.id == 2
                          ? Color.primary
                          : Color?.black
                      }
                    />
                    <Text
                      style={{
                        color:
                          selectedVehicletype?.id == 2
                            ? Color?.primary
                            : Color?.black,
                        fontSize: 18,
                        fontFamily: Manrope?.Regular,
                      }}>
                      Closed Type
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
            <View
              style={{
                flexDirection: 'row',
                gap: 10,
                width: width,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 18,
                  color: Color.black,
                  fontFamily: Manrope.Medium,
                  textTransform: 'capitalize',
                }}>
                Date & Time :
              </Text>
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: '#EEEEEE',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 15,
                borderRadius: 30,
                flexDirection: 'row',
                gap: 20,
              }}
              onPress={() => {
                setShow(true);
              }}>
              <Iconviewcomponent
                Icontag={'FontAwesome'}
                iconname={'calendar-plus-o'}
                icon_size={20}
                icon_color={Color.black}
              />
              <Text
                style={{
                  fontSize: 16,
                  color: Color.black,
                  fontFamily: Manrope.Regular,
                  textTransform: 'Uppercase',
                  width: width / 1.45,
                }}>
                {dateobj ? dateobj : tdate.toLocaleString()}
              </Text>
              {show && (
                <DatePicker
                  modal
                  open={show}
                  date={tdate}
                  mode="datetime"
                  minimumDate={new Date()}
                  onConfirm={dated => {
                    onChange(dated);
                    setShow(false);
                  }}
                  onCancel={() => {
                    setShow(false);
                  }}
                />
              )}
            </TouchableOpacity>
          </View>

          <View style={{gap: 15, marginTop: 15}}>
            {/* Slected Goods Type */}

            <View style={{gap: 10}}>
              <View style={{width: width / 2.7}}>
                <Text
                  style={{
                    fontSize: 18,
                    color: Color.black,
                    fontFamily: Manrope.Medium,
                    textTransform: 'capitalize',
                  }}>
                  Goods Type :
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  refRBSheetGoodsType?.current?.open();
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 20,
                  backgroundColor: '#EEEEEE',
                  borderRadius: 30,
                  padding: 5,
                  justifyContent: 'center',
                }}>
                <Iconviewcomponent
                  Icontag={'AntDesign'}
                  iconname={'dropbox'}
                  icon_size={20}
                  icon_color={Color.black}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderWidth: 1,
                    borderColor: Color?.grey,
                    padding: 10,
                    width: width / 1.45,
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: Color.black,
                      fontFamily: Manrope.Regular,
                      textTransform: 'capitalize',
                    }}>
                    {isgoodsty == true
                      ? `${selectedGoodsType?.goodsname}`
                      : 'select Goods type'}
                  </Text>
                  <Iconviewcomponent
                    Icontag={'AntDesign'}
                    iconname={'down'}
                    icon_size={15}
                    icon_color={Color.black}
                  />
                </View>
              </TouchableOpacity>
            </View>


            <View style={{gap: 10}}>
              <View style={{width: width / 2.7}}>
                <Text
                  style={{
                    fontSize: 18,
                    color: Color.black,
                    fontFamily: Manrope.Medium,
                    textTransform: 'capitalize',
                  }}>
                  Fare Type :
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  route?.params?.Distance.distance > 25
                    ? null
                    : refRBSheetFareType?.current?.open();
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 20,
                  backgroundColor: '#EEEEEE',
                  borderRadius: 30,
                  padding: 5,
                  justifyContent: 'center',
                }}>
                <Image
                  source={require('../assets/light.png')}
                  style={{height: 30, width: 30}}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderWidth: 1,
                    borderColor: Color?.grey,
                    padding: 10,
                    width: width / 1.45,
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: Color.black,
                      fontFamily: Manrope.Regular,
                      textTransform: 'capitalize',
                    }}>
                    {`${
                      route?.params?.Distance.distance > 25
                        ? 'Intercity Fare'
                        : selectedfareType?.name
                    }`}
                  </Text>
                  <Iconviewcomponent
                    Icontag={'AntDesign'}
                    iconname={'down'}
                    icon_size={15}
                    icon_color={Color.black}
                  />
                </View>
              </TouchableOpacity>
            </View>


            {route?.params?.Distance.distance >
            25 ? null : selectedfareType?.name == 'Intercity Fare' ||
              selectedfareType?.name == 'Meter Fare' ? null : (
              <View style={{gap: 10}}>
                <View style={{width: width / 2.7}}>
                  <Text
                    style={{
                      fontSize: 18,
                      color: Color.black,
                      fontFamily: Manrope.Medium,
                      textTransform: 'capitalize',
                    }}>
                    Hours
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    refRBSheetHours?.current?.open();
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 20,
                    backgroundColor: '#EEEEEE',
                    borderRadius: 30,
                    padding: 5,
                    justifyContent: 'center',
                  }}>
                  <Iconviewcomponent
                    Icontag={'AntDesign'}
                    iconname={'dropbox'}
                    icon_size={20}
                    icon_color={Color.black}
                  />
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderWidth: 1,
                      borderColor: Color?.grey,
                      padding: 10,
                      width: width / 1.45,
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        color: Color.black,
                        fontFamily: Manrope.Regular,
                        textTransform: 'capitalize',
                      }}>
                      {selecthours ? selecthours?.hours : 'Select Hours'}
                    </Text>
                    <Iconviewcomponent
                      Icontag={'AntDesign'}
                      iconname={'down'}
                      icon_size={15}
                      icon_color={Color.black}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            )}

            {/* CHOOSE VEHICLE */}
            {route?.params == undefined ? null : (
              <View style={{gap: 10}}>
                <View style={{marginBottom: 16}}>
                  {ChooseVehicle == undefined ? null : (
                    <Text
                      style={{
                        fontSize: 19,
                        color: '#333333',
                        fontFamily: Manrope.Medium,
                        textTransform: 'capitalize',
                      }}>
                      Choose your Vehicle
                    </Text>
                  )}
               
                </View>
                <FlatList
                  data={ChooseVehicle}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  renderItem={data => {
                    
                    const selected =
                      route?.params?.Distance.distance > 25
                        ? vehicleselected?.vehicleID == data?.item?.vehicleID
                        : selectedfareType?.name == 'Meter Fare' ||
                          selectedfareType?.name == 'Intercity Fare'
                        ? // vehicleselected?.vehicleID == data?.item?.vehicleID :selectedfareType?.name == 'Intercity Fare' ?
                          vehicleselected?.vehicleID == data?.item?.vehicleID
                        : vehicleselected?.id == data?.item?.id;
                    return (
                      <TouchableOpacity
                        style={{
                          marginRight: 20,
                          borderWidth: selected ? 3 : 1,
                          padding: 10,
                          borderRadius: 5,
                          borderColor: selected ? Color?.primary : Color?.grey,
                        }}
                        onPress={() => {
                          console.log(data?.item);
                          setvehicleselected(data?.item);
                        }}
                        disabled={
                          selectedfareType?.name == 'Package Fare' &&
                          data?.item?.id == null
                            ? true
                            : false
                        }>
                        <Image
                          source={{uri: data?.item?.url}}
                          style={{
                            height: 43,
                            width: 76,
                          }}
                          resizeMode="contain"
                        />
                        <View
                          style={{
                            gap: 8,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <View
                            style={{
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <View>
                              <Text
                                style={{
                                  color: Color.black,
                                  fontFamily: Manrope.Bold,
                                  fontSize: 13,
                                }}>
                                {data?.item?.vehicleName}
                              </Text>
                            </View>
                            <View>
                              <Text
                                style={{
                                  color: Color.black,
                                  fontFamily: Manrope.Bold,
                                  fontSize: 12,
                                }}>
                                {data?.item?.loadCapacity}
                              </Text>
                            </View>
                          </View>
                          <View>
                            <Text
                              style={{
                                color: selected ? Color?.primary : Color?.black,
                                fontSize: 12,
                                fontFamily: Manrope?.SemiBold,
                              }}>
                              ₹{data?.item?.estimatedFare}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  }}
                  keyExtractor={(item, index) => index}
                />
              </View>
            )}

            {/* Alternative Mobile Number */}

            <View style={{gap: 10}}>
              <Text
                style={{
                  fontSize: 16,
                  color: Color.black,
                  fontFamily: Manrope.Medium,
                  textTransform: 'capitalize',
                }}>
                Receiver Mobile Number{' '}
                <Text style={{color: '#888888'}}>{`( optional ) `}</Text>
              </Text>
              <View
                style={{
                  width: width * 0.93,
                  flexDirection: 'row',
                  borderWidth: 1,
                  borderColor: Color?.grey,
                  borderRadius: 5,
                  alignItems: 'center',
                  paddingLeft: 10,
                  marginBottom: 20,
                  gap: 10,
                }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: Color.black,
                    fontFamily: Manrope.SemiBold,
                    textTransform: 'capitalize',
                  }}>
                  +91-
                </Text>
                <TextInput
                  placeholder="Receiver Mobile Number....."
                  placeholderTextColor={'#888888'}
                  keyboardType="number-pad"
                  maxLength={10}
                  value={mobilenumber}
                  onChangeText={text => setMobileNumber(text)}
                  style={{
                    width: width * 0.6,
                    fontSize: 16,
                    color: Color.black,
                    fontFamily: Manrope.Regular,
                  }}
                />
              </View>
            </View>
          </View>
        </View>

        {/* Select Vehicle Type Button Sheet */}

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
          <View style={{margin: 20, gap: 10}}>
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
                Select Vehicle Type
              </Text>
            </View>
            <ScrollView style={{marginBottom: 35}}>
              {vehicleType?.map((item, index) => {
                const Selected = selectedVehicletype?.id === item?.id;

                return (
                  <TouchableOpacity
                    onPress={() => {
                      setselectedVehicletype(item);
                      refRBSheet?.current?.close();
                    }}
                    style={{
                      padding: 10,
                      borderWidth: 1,
                      alignItems: 'center',
                      marginBottom: 5,
                      borderRadius: 5,
                      borderColor: Selected ? Color?.primary : Color?.black,
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: Manrope.SemiBold,
                        color: Selected ? Color?.primary : Color.black,
                        textTransform: 'capitalize',
                      }}>
                      {item?.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </RBSheet>

        {/* Select Goods Type Button Sheet */}

        <RBSheet
          ref={refRBSheetGoodsType}
          closeOnDragDown={true}
          closeOnPressMask={true}
          height={500}
          customStyles={{
            wrapper: {
              backgroundColor: '#00000088',
            },
            container: {
              backgroundColor: 'white',
            },
          }}>
          <View style={{margin: 20, gap: 10}}>
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
                Select Goods Type
              </Text>
            </View>
            <ScrollView style={{marginBottom: 35}}>
              {goodType?.map((item, index) => {
                const Selected = selectedGoodsType?.goodsid === item?.goodsid;

                return (
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedGoodsType(item);
                      setIsgoodsty(true);

                      refRBSheetGoodsType?.current?.close();
                    }}
                    style={{
                      padding: 10,
                      borderWidth: 1,
                      alignItems: 'center',
                      marginBottom: 5,
                      borderRadius: 5,
                      borderColor: Selected ? Color?.primary : Color?.black,
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: Manrope.SemiBold,
                        color: Selected ? Color?.primary : Color.black,
                        textTransform: 'capitalize',
                      }}>
                      {item?.goodsname}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </RBSheet>

        {/* Select Fare Type Button Sheet */}

        <RBSheet
          ref={refRBSheetFareType}
          closeOnDragDown={true}
          closeOnPressMask={true}
          height={300}
          customStyles={{
            wrapper: {
              backgroundColor: '#00000088',
            },
            container: {
              backgroundColor: 'white',
            },
          }}>
          <View style={{margin: 20, gap: 10}}>
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
                Select Fare Type
              </Text>
            </View>
            <ScrollView style={{marginBottom: 35}}>
              {tripType?.map((item, index) => {
                const Selected = selectedfareType?.name === item?.name;
                console.log(
                  'item ------------------ :',
                  JSON.stringify(item) +
                    ' distance *********' +
                    route.params?.Distance.distance,
                );
                // if(!!route?.params)
                // {
                //   if(route.params?.Distance.distance > 25)
                //     {
                //       Getintercitydata();
                //     }else{
                //       GetVehicledata();
                //     }
                // }

                return (
                  <TouchableOpacity
                    onPress={() => {
                      console.log('cccccccccccccccccccvv', item);
                      setisfarepac(false);
                      selectedFaretype(item);
                      setSelectedFareType(item);

                      // if (item?.name == 'Night Fare') {
                      //   settripTypeid(4);
                      // } else {
                      //   if (item?.name == 'Package Fare') {
                      //     settripTypeid(2);
                      //   } else {
                      //     if (item?.name == 'Intercity Fare') {
                      //       settripTypeid(3);
                      //     } else {
                      //       settripTypeid(1);
                      //     }
                      //   }
                      // }
                      if (!!route?.params?.Distance?.distance) {
                        if (route?.params?.Distance?.distance > 25) {
                          console.log('dcdcd');
                        } else {
                          GetVehicledata(
                            route?.params?.Distance?.distance,
                            item,
                            selecthours,
                          );
                        }
                      }
                      refRBSheetFareType?.current?.close();
                    }}
                    style={{
                      padding: 10,
                      borderWidth: 1,
                      alignItems: 'center',
                      marginBottom: 5,
                      borderRadius: 5,
                      borderColor: Selected ? Color?.primary : Color?.black,
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: Manrope.SemiBold,
                        color: Selected ? Color?.primary : Color.black,
                        textTransform: 'capitalize',
                      }}>
                      {item?.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </RBSheet>

        {/* Select Trip Count Button Sheet */}

        <RBSheet
          ref={refRBSheettripcount}
          closeOnDragDown={true}
          closeOnPressMask={true}
          height={350}
          customStyles={{
            wrapper: {
              backgroundColor: '#00000088',
            },
            container: {
              backgroundColor: 'white',
            },
          }}>
          <View style={{margin: 20, gap: 10}}>
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
                Select Vehicles
              </Text>
            </View>
            <ScrollView style={{marginBottom: 35}}>
              {Tripcount?.map((item, index) => {
                const Selected = selectedtripcount?.count === item?.count;

                return (
                  <TouchableOpacity
                    onPress={() => {
                      setselectedtripcount(item);
                      refRBSheettripcount?.current?.close();
                    }}
                    style={{
                      padding: 10,
                      borderWidth: 1,
                      alignItems: 'center',
                      marginBottom: 5,
                      borderRadius: 5,
                      borderColor: Selected ? Color?.primary : Color?.black,
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: Manrope.SemiBold,
                        color: Selected ? Color?.primary : Color.black,
                        textTransform: 'capitalize',
                      }}>
                      {item?.count}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </RBSheet>

        {/* Select Vehicle fare amount Button Sheet */}

        <RBSheet
          ref={refRBSheetVehicleFare}
          closeOnDragDown={true}
          closeOnPressMask={true}
          height={300}
          // height={selectedfareType?.name !== 'Intercity Fare' ? 300 : 700}
          customStyles={{
            wrapper: {
              backgroundColor: '#00000088',
            },
            container: {
              backgroundColor: 'white',
            },
          }}>
          <View style={{margin: 20, gap: 10}}>
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
                {selectedfareType?.name}
              </Text>
            </View>
            <ScrollView style={{marginBottom: 35}}>
              {Farevalue?.map((item, index) => {
                const Selected = selectedFarevalue === item;
                return (
                  <TouchableOpacity
                    onPress={() => {
                      console.log('Selected item ****************** ', item);

                      setselectedFarevalue(item);
                      setisfarepac(true);
                      refRBSheetVehicleFare?.current?.close();
                    }}
                    style={{
                      padding: 10,
                      borderWidth: 1,
                      alignItems: 'center',
                      marginBottom: 5,
                      borderRadius: 5,
                      borderColor: Selected ? Color?.primary : Color?.black,
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: Manrope.SemiBold,
                        color: Selected ? Color?.primary : Color.black,
                      }}>
                      {`${item?.basekm} KM --> ₹${item?.basefare}`}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </RBSheet>

        {/* Select Hours Button Sheet */}

        <RBSheet
          ref={refRBSheetHours}
          closeOnDragDown={true}
          closeOnPressMask={true}
          height={400}
          // height={selectedfareType?.name !== 'Intercity Fare' ? 300 : 700}
          customStyles={{
            wrapper: {
              backgroundColor: '#00000088',
            },
            container: {
              backgroundColor: 'white',
            },
          }}>
          <View style={{margin: 20, gap: 10}}>
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
                Select Hours
              </Text>
            </View>
            <ScrollView style={{marginBottom: 35}}>
              {Hours?.map((item, index) => {
                const Selected = selecthours?.id === item?.id;  
              
                if(selectedfareType?.name == 'Night Fare')
                {
                  if(item?.id !== 1 && item?.id !== 2 && item?.id !== 3) 
                  {
                    return null 
                  }
                }
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setSelecthours(item);
                      if (!!route?.params?.Distance?.distance) {
                        if (route?.params?.Distance?.distance > 25) {
                          console.log('dcdcd');
                        } else {
                          console.log('chess');

                          GetVehicledata(
                            route?.params?.Distance?.distance,
                            selectedfareType,
                            item,
                          );
                        }
                      }
                      refRBSheetHours?.current?.close();
                    }}
                    style={{
                      padding: 10,
                      borderWidth: 1,
                      alignItems: 'center',
                      marginBottom: 5,
                      borderRadius: 5,
                      borderColor: Selected ? Color?.primary : Color?.black,
                    }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontFamily: Manrope.SemiBold,
                        textTransform: 'capitalize',
                        color: Selected ? Color?.primary : Color.black,
                      }}>
                      {item?.hours}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </RBSheet>
      </ScrollView>

      <View>
        <TouchableOpacity
          style={{
            backgroundColor: Color?.primary,
            padding: 10,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: 5,
          }}
          onPress={() => {
            if (
              selectedfareType?.name == 'Package Fare' ||
              selectedfareType?.name == 'Night Fare'
            ) {
              if (selecthours !== null) {
                booking();
              } else {
                ToastAndroid.show('please select hours', ToastAndroid.SHORT);
              }
            } else {
              booking();
            }
          }}>
          <Text
            style={{
              fontSize: 16,
              color: Color?.white,
              fontFamily: Manrope.SemiBold,
              textTransform: 'capitalize',
            }}>
            Next
          </Text>
          <Iconviewcomponent
            Icontag={'FontAwesome'}
            iconname={'arrow-circle-right'}
            icon_size={20}
            iconstyle={{color: Color.white}}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    marginLeft: 8,
    margin: 5,
    height: 82,
    width: 82,
    borderRadius: 40,
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: '#85388d',
  },
  vehicle: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: width * 0.03,
    borderWidth: 0.2,
    borderRadius: 3,
    borderWidthColor: Color.black,
    marginHorizontal: width * 0.02,
    overflow: 'hidden',
  },
  vehicleImg: {
    width: width * 0.23,
    height: height * 0.08,
    resizeMode: 'contain',
    overflow: 'hidden',
  },
  vehicleName: {
    color: Color.black,
    fontWeight: '500',
    fontSize: 14,
    textAlign: 'center',
  },
  typeView: {
    width: '95%',
    flexDirection: 'row',
    justifyContent: 'Flex-start',
    alignItems: 'center',
    marginTop: height * 0.01,
  },
  datePickerStyle: {
    borderRadius: 10,
    borderColor: '#eee',
    marginLeft: 10,
  },
  icon: {
    paddingLeft: 20,
    paddingTop: 5,
  },
  containernormal: {
    flex: 1,
    backgroundColor: '#eee',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  weightcontainer: {
    marginLeft: 8,
    margin: 5,
    height: 25,
    width: 80,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#85388d',
  },
  weighttext: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  action: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    padding: 4,
    borderBottomColor: '#f2f2f2',
    borderRadius: 45,
    margin: 10,
  },
  actiondiv: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    padding: 4,
    borderBottomColor: '#f2f2f2',
    borderRadius: 45,
    margin: 10,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 20,
    color: '#05375a',
    paddingTop: 12,
  },
  button: {
    alignItems: 'center',
    marginVertical: 20,
  },
  signIn: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
  },
  carouselContainer: {
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  flatList: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  cardContainer: {
    height: 100,
    width: width * 0.5,
    marginRight: 8,
  },
  card: {
    height: 100,
    width: width * 0.5,
    borderRadius: 12,
    padding: 10,
  },
  imageBackground: {
    width: '80%',
    height: 30,
    borderRadius: 2,
  },
  text: {color: 'white', fontWeight: 'bold'},
  locationView: {
    width: '95%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: width * 0.115,
  },
  locationTextView: {
    marginTop: height * 0.03,
    gap: height * 0.03,
  },
  location: {
    fontSize: 14,
    color: Color.white,
  },
  locationInnerView: {
    marginTop: height * 0.02,
    gap: height * 0.01,
  },
  locationText: {
    width: width * 0.5,
    color: Color.black,
    gap: height * 0.03,
    overflow: 'hidden',
  },

  /////
  numberHeader: {
    width: '95%',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: height * 0.02,
    gap: width * 0.01,
  },
  alterNumber: {
    color: Color.black,
    fontFamily: Manrope.Bold,
    fontSize: 15,
  },
  optional: {
    color: Color.shadow,
  },
  numberView: {
    flexDirection: 'row',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: height * 0.02,
  },
  numberText: {
    color: Color.black,
    alignSelf: 'center',
    paddingHorizontal: width * 0.03,
    fontSize: 14,
  },
  numberInput: {
    color: Color.black,
    width: width * 0.7,
  },
});
