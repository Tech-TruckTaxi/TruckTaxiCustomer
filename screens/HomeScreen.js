import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  View,
  PermissionsAndroid,
  ToastAndroid,
  Text,
  Button,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  FlatList,
  ScrollView,
  TextInput,
  Platform,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const ITEM_SIZE = Platform.OS === 'ios' ? width * 0.72 : width * 0.54;
const {width, height} = Dimensions.get('window');
import {P, H5} from '../components/typography';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import LinearGradient from 'react-native-linear-gradient';
import {IndexPath, Layout, Select, SelectItem} from '@ui-kitten/components';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectDestination,
  selectOrigin,
  setTravelTimeInformation,
} from '../slices/navSlice';
import BookingPreview from './bookingPreview';
import RNRestart from 'react-native-restart';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import messaging from '@react-native-firebase/messaging';
import DatePicker from 'react-native-date-picker';
import Color from '../Global/Color';
import {Manrope} from '../Global/FontFamily';
import {Iconviewcomponent} from '../Global/Icontag';
import RBSheet from 'react-native-raw-bottom-sheet';

const HomeScreen = ({navigation, route}) => {
  console.log('CCCCCCCCCCCCCCC', route.params);

  const {width, height} = Dimensions.get('window');
  const [showLoading, setshowLoading] = useState(false);
  const [vehcilelist, setvehcilelist] = useState([]);
  const [selectedvehcilelist, setselectedvehcilelist] = useState({
    addkmcharge: '20',
    addminutecharge: '3',
    feet: '7.5 feet',
    id: 1,
    loadcapacity: '1000 kgs',
    url: 'https://trucktaxi.co.in/api/images/tataace.png',
    vehicletype: 'TataAce',
  });
  const [selectVehicleid, setselectVehicleId] = useState('');

  const [goodValue, setgoodValue] = useState();
  const [tripValue, settripValue] = useState('Meter Fare');
  const [tripType, settripType] = React.useState([]);
  const [tripTypeid, settripTypeid] = React.useState(1);

  const [packageType, setpackageType] = React.useState([]);
  const [Packagevalue, setPackagevalue] = React.useState([]);
  const [Packageselcted, setPackageselcted] = React.useState([]);

  const [intercityType, setintercityType] = React.useState([]);
  const [intercityvalue, setIntercityValue] = React.useState([]);
  const [intercityselcted, setInterCitySelcted] = React.useState([]);

  const [nightFareType, setNightFareType] = React.useState([]);
  const [nightFareValue, setNightFareValue] = React.useState([]);
  const [nightSelcted, setNightSelcted] = React.useState([]);

  const [tripIndex, settripIndex] = React.useState();
  const [packageIndex, setpackageIndex] = React.useState();
  const [interCityIndex, setinterCityIndex] = React.useState();
  const [nightIndex, setNightIndex] = React.useState();
  const [goodIndex, setgoodIndex] = React.useState();
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  const [initorigin, setinitorigin] = useState('');
  const [initdrop, setinitdrop] = useState('');
  const [dateobj, setDate] = useState();
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);
  const [time, setTime] = useState('');
  const [tempdate, settempDate] = useState(new Date());
  const [countvalue, setcountValue] = useState(1);
  const [countindex, setcountindex] = useState();

  const [packageID, setpackageID] = React.useState([]);
  const [interID, setinterID] = React.useState([]);
  const [nightID, setnightID] = React.useState([]);
  const [tdate, settDate] = useState(new Date());
  const [atlerNumber, setAlterNUmber] = useState(null);
  const [vehicleTypeVisible, setVehicleTypeVisible] = useState(false);
  const [selectVehicle, setSelectVehicle] = useState('open type');
  const [selectVehicleType, setSelectVehicleType] = useState(false);
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

  const [selectedVehicle, setSelectedVehicle] = useState({
    addkmcharge: '20',
    addminutecharge: '3',
    feet: '7.5 feet',
    id: 1,
    loadcapacity: '1000 kgs',
    url: 'https://trucktaxi.co.in/api/images/tataace.png',
    vehicletype: 'TataAce',
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
  const [isfarepac, setisfarepac]=useState(false);
  const [Farevalue, setFarevalue] = useState([]);
  const [selectedFarevalue, setselectedFarevalue] = useState([]);
  const refRBSheet = useRef();
  const [mobilenumber, setMobileNumber] = useState('');
  const refRBSheetGoodsType = useRef();
  const refRBSheetFareType = useRef();
  const refRBSheettripcount = useRef();
  const refRBSheetVehicleFare = useRef();

  console.log("Params -------------------- :",route.params?.Distance);
  
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
    if (!origin) {
      setinitorigin('Please Select Pickup location');
      setinitdrop('Please Select Drop location');
      return;
    }
    // console.log("origin ============ : ", origin + "        destination    " + destination);
    setinitorigin(origin.description);
    if (!destination) return;
    setinitdrop(destination.description);
    // console.log(destination)
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
            setSelectedGoodsType(result.data[0]);
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

  const loadgoods = () => {
    return goodType.map(good => <SelectItem title={good.goodsname} />);
  };

  // const loadpackage = () => {
  //   return packageType.map(packag => (
  //     <SelectItem
  //       title={
  //         <Text>
  //           {packag.package} @ Rs.{packag.basefare}{' '}
  //         </Text>
  //       }
  //     />
  //   ));
  // };
  // const loadintercity = () => {
  //   return intercityType.map(packag => (
  //     <SelectItem
  //       title={
  //         <Text>
  //           {packag.basekm} @ Rs.{packag.basefare}{' '}
  //         </Text>
  //       }
  //     />
  //   ));
  // };
  // const loadnight = () => {
  //   return nightFareType.map(packag => (
  //     <SelectItem
  //       title={
  //         <Text>
  //           {packag.basekm} @ Rs.{packag.basefare}{' '}
  //         </Text>
  //       }
  //     />
  //   ));
  // };

  const BookingPreview = () => {
    if (selectedvehcilelist == undefined) {
      alert('Select Vehcile Type');
    } else if (initorigin == 'Please Select Pickup location') {
      alert('Select Pickup Location');
    } else if (initdrop == 'Please Select Drop location') {
      alert('Select Drop Location');
    } else if (tripValue == undefined) {
      alert('Select Trip Type');
    } else if (goodValue == undefined) {
      alert('Select Goods Type');
    } else if (dateobj == '' || dateobj == undefined) {
      alert('Enter Date And Time');
    } else {
      var datetosend = moment(dateobj, 'DD/MM/YYYY hh:mm A').format(
        'DD/MM/YYYY',
      );
      var timetosend = moment(dateobj, 'DD/MM/YYYY hh:mm A').format('HH:mm');
      console.log(datetosend);
      console.log(timetosend);

      navigation.navigate('offer', {
        selectedvehcilelist: vehicleselected,
        tripValue: tripValue,
        packageid: packageID,
        interID: interID,
        nightID: nightID,
        goodValue: goodValue,
        tripTypeid: tripTypeid,
        Packagevalue: Packageselcted,
        intercityselcted: intercityselcted,
        nightSelcted: nightSelcted,
        tripcount: countvalue,
        time: timetosend,
        datetosend: datetosend,
        alternativemobno: atlerNumber,
        iscv: selectVehicleType,
        nightFareType: nightSelcted,
      });
      setgoodType([]);
    }
  };

  const loadtrips = () => {
    return tripType.map(trips => <SelectItem title={trips.name} />);
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

  const onSelectVehicle = item => {
    // console.log("item ============== : ",item);
    setselectedvehcilelist(item);
    setselectVehicleId(item.id);
    // console.log(item)
    AsyncStorage.getItem('userdata').then(userdata => {
      AsyncStorage.getItem('userToken').then(value => {
        let parseddata = JSON.parse(userdata);
        var myHeaders = new Headers();
        myHeaders.append('Authorization', 'Bearer ' + value);
        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow',
        };
        fetch(
          'https://trucktaxi.co.in/api/customer/getpackages?vehicleid=' +
            item.id +
            '&cityid=' +
            parseddata.cityid,
          requestOptions,
        )
          .then(response => response.json())
          .then(result => {
            setshowLoading(false);
            // console.log(result)
            setpackageType(result.data);
            loadpackage();
          })
          .catch(error => console.log('catch in get_Package_list:', error));

        fetch(
          'https://trucktaxi.co.in/api/customer/getintercitylist?vehicleid=' +
            item.id +
            '&cityid=' +
            parseddata.cityid,
          requestOptions,
        )
          .then(response => response.json())
          .then(result => {
            setshowLoading(false);
            setintercityType(result.data);
            loadintercity();
          })
          .catch(error => console.log('catch in get_interCity_list:', error));

        fetch(
          'https://trucktaxi.co.in/api/customer/getnightfare?vehicleid=' +
            item.id +
            '&cityid=' +
            parseddata.cityid,
          requestOptions,
        )
          .then(response => response.json())
          .then(result => {
            setshowLoading(false);
            setNightFareType(result.data);
            loadnight();
          })
          .catch(error => console.log('catch in get_night_list:', error));
      });
    });
  };

  const selectedFaretype = item => {
    AsyncStorage.getItem('userdata').then(userdata => {
      AsyncStorage.getItem('userToken').then(value => {
        let parseddata = JSON.parse(userdata);
        var myHeaders = new Headers();
        myHeaders.append('Authorization', 'Bearer ' + value);
        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow',
        };
        console.log('====================================');
        console.log(parseddata.cityid);
        console.log('====================================');
        console.log('====================================');
        console.log(item?.name, '0000000000000mmmm', vehicleselected?.id);
        console.log('====================================');
        if (item?.name == 'Package Fare') {
          fetch(
            'https://trucktaxi.co.in/api/customer/getpackages?vehicleid=' +
              vehicleselected.id +
              '&cityid=' +
              parseddata.cityid,
            requestOptions,
          )
            .then(response => response.json())
            .then(result => {
              setshowLoading(false);
              console.log('<====== Package Fare =====>: ', result?.data);
              const sortedPackages = result?.data.sort((a, b) => {
                const hoursA = parseInt(a.baseminute);
                const hoursB = parseInt(b.baseminute);
                return hoursA - hoursB;
              });
              setFarevalue(sortedPackages);
              setselectedFarevalue(sortedPackages[0]);
              // loadpackage();
            })
            .catch(error => console.log('catch in get_Package_list:', error));
        } else {
          if (item?.name == 'Intercity Fare') {
            console.log('intercity fare', requestOptions);

            fetch(
              'https://trucktaxi.co.in/api/customer/getintercitylist?vehicleid=' +
                vehicleselected.id +
                '&cityid=' +
                parseddata.cityid,
              requestOptions,
            )
              .then(response => response.json())
              .then(result => {
                // console.log('intercityType', result);
                console.log(
                  '<====== Intercity Fare nnnnnnnnnnnnn =====>: ',
                  result?.data,
                ); 
                               
                setshowLoading(false);
                setFarevalue(result?.data);
                setselectedFarevalue(result?.data[0]);
                // loadintercity();
              })
              .catch(error =>
                console.log('catch in get_interCity_list:', error),
              );
          } else {
            if (item?.name == 'Night Fare') {
              console.log('night fare');
              fetch(
                'https://trucktaxi.co.in/api/customer/getnightfare?vehicleid=' +
                  vehicleselected?.id +
                  '&cityid=' +
                  parseddata.cityid,
                requestOptions,
              )
                // fetch(
                //   'https://trucktaxi.co.in/api/customer/getnightfare?vehicleid=4&cityid=CBE001',
                //   requestOptions,
                // )
                .then(response => response.json())
                .then(result => {
                  console.log('<====== Night Fare ==================>: ', result);
                  setshowLoading(false);
                  setFarevalue(result?.data);
                  setselectedFarevalue(result?.data[0]);
                  // loadnight();
                })
                .catch(error => console.log('catch in get_night_list:', error));
            }
          }
        }
      });
    });
  };

  const booking = () => {
    // navigation.navigate('offer');
    if (route.params == undefined) {
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
        tripValue: selectedfareType?.name,
        packageid:
          selectedfareType?.name == 'Package Fare' ? selectedfareType?.id : '',
        interID:
          selectedfareType?.name == 'Intercity Fare'
            ? selectedfareType?.id
            : '',
        nightID:
          selectedfareType?.name == 'Night Fare' ? selectedfareType?.id : '',
        goodValue: selectedGoodsType,
        tripTypeid: tripTypeid,
        Packagevalue:
          selectedfareType?.name == 'Package Fare' ? selectedFarevalue : '',
        intercityselcted:
          selectedfareType?.name == 'Intercity Fare' ? selectedFarevalue : '',
        nightSelcted:
          selectedfareType?.name == 'Night Fare' ? selectedFarevalue : '',
        tripcount: countvalue,
        time: time,
        datetosend: dateOnly,
        alternativemobno: mobilenumber,
        iscv: vehicleselected,
        nightFareType:
          selectedfareType?.name == 'Night Fare' ? selectedFarevalue : '',
      });

      // var data = {
      //   selectedvehcilelist: selectedVehicle,
      //   // tripValue: tripValue,
      //   fare: selectFareid,
      //   fareName: selectFareName,
      //   tripTypeid: '',
      //   nighttype: selectNight,
      //   Packagevalue: selectPackage,
      //   goodValue: selectGoodsName,
      //   intercitytype: selectIntercity,
      //   tripcount: 0,
      //   time: timetosend,
      //   datetosend: datetosend,
      //   address: locations,
      //   pickup: locations.pickup.Description,
      //   drop: locations.drop.Description,
      //   noVehicles: noVehicles,
      //   distance: locations?.distance,
      // };

      console.log('goo to homescreen', dateOnly);

      // const data = {
      //   Packagevalue: {
      //     basefare: '1500',
      //     basekm: '30',
      //     baseminute: '6 Hours',
      //     id: 10,
      //     package: '6 Hours',
      //   },
      //   address: {
      //     distance: 3.958,
      //     drop: {
      //       Description: 'Ukkadam, Coimbatore, Tamil Nadu',
      //       position: [Object],
      //     },
      //     pickup: {
      //       Description: 'Ram Nagar, Coimbatore, Tamil Nadu',
      //       position: [Object],
      //     },
      //   },
      //   datetosend: '2024-11-11',
      //   distance: 3.958,
      //   drop: 'Ukkadam, Coimbatore, Tamil Nadu',
      //   fare: '2',
      //   fareName: 'Package Fare',
      //   goodValue: 'Tools & Spare parts',
      //   intercitytype: {},
      //   nighttype: {},
      //   noVehicles: {
      //     label: '1',
      //     value: '1',
      //   },
      //   pickup: 'Ram Nagar, Coimbatore, Tamil Nadu',
      //   selectedvehcilelist: {
      //     addkmcharge: '20',
      //     addminutecharge: '3',
      //     feet: '7.5 feet',
      //     id: 1,
      //     loadcapacity: '1000 kgs',
      //     url: 'https://trucktaxi.co.in/api/images/tataace.png',
      //     vehicletype: 'TataAce',
      //   },
      //   time: '13:50:00',
      //   tripTypeid: '',
      //   tripcount: 0,
      // };

      // navigation?.navigate('offer', data);
      // navigation.navigate('bookpreview', data);
    }
  };

  return (
    // <ScrollView>
    //   <View style={{width: '100%', marginTop: 20}}>
    //     <Text
    //       style={{
    //         fontSize: 16,
    //         color: Color.black,
    //         fontFamily: Manrope.SemiBold,
    //         paddingHorizontal: 20,
    //       }}>
    //       Choose Your Vehicle
    //     </Text>
    //     <FlatList
    //       showsHorizontalScrollIndicator={false}
    //       contentContainerStyle={styles.flatList}
    //       horizontal={true}
    //       data={vehcilelist}
    //       keyExtractor={item => item.id.toString()}
    //       renderItem={({item, index}) => {
    //         const isFocused = selectedvehcilelist
    //           ? item.vehicletype == selectedvehcilelist.vehicletype
    //           : false;
    //         if (isFocused) {
    //           onSelectVehicle(item);
    //         }
    //         return (
    //           <View>
    //             <View
    //               style={{
    //                 ...styles.vehicle,
    //                 overflow: 'hidden',
    //                 borderRadius: 10,
    //                 borderColor: isFocused ? Color.primary : Color.lightgrey,
    //                 borderWidth: isFocused ? 5 : 1,
    //               }}>
    //               <TouchableOpacity
    //                 key={index}
    //                 onPress={() => onSelectVehicle(item)}>
    //                 <Image style={styles.vehicleImg} source={{uri: item.url}} />
    //                 <Text style={styles.vehicleName}>{item.vehicletype}</Text>
    //                 <Text style={styles.vehicleName}>
    //                   {' '}
    //                   {item.loadcapacity}{' '}
    //                 </Text>
    //               </TouchableOpacity>
    //             </View>
    //           </View>
    //         );
    //       }}
    //     />

    //     {selectedvehcilelist != null && (
    //       <View style={styles.typeView}>
    //         <Text
    //           style={{
    //             paddingStart: 20,
    //             paddingVertical: 5,
    //             fontSize: 16,
    //             color: Color.lightBlack,
    //             fontFamily: Manrope.Bold,
    //           }}>
    //           Vehicle Type:{' '}
    //         </Text>
    //         <TouchableOpacity
    //           onPress={() => {
    //             setVehicleTypeVisible(true);
    //           }}
    //           style={{flexDirection: 'row', alignItems: 'center'}}>
    //           <Text
    //             style={{
    //               fontSize: 14,
    //               color: Color.black,
    //               paddingHorizontal: 5,
    //               textTransform: 'uppercase',
    //               fontWeight: '500',
    //             }}>
    //             {selectVehicle?.name != undefined
    //               ? selectVehicle?.name
    //               : 'open type'}
    //           </Text>
    //           <Iconviewcomponent
    //             Icontag={'Ionicons'}
    //             iconname={'chevron-down'}
    //             icon_size={20}
    //             iconstyle={{color: Color.black2, marginRight: 10}}
    //           />
    //         </TouchableOpacity>
    //         <Modal
    //           visible={vehicleTypeVisible}
    //           transparent
    //           animationType="slide">
    //           <View
    //             style={{
    //               backgroundColor: Color.transparantBlack,
    //               flex: 1,
    //             }}
    //           />
    //           <View
    //             style={{
    //               backgroundColor: Color.white,
    //               // flex: 1,
    //               borderTopLeftRadius: 10,
    //               borderTopRightRadius: 10,
    //               padding: 10,
    //             }}>
    //             <Text
    //               style={{
    //                 fontSize: 16,
    //                 color: Color.black,
    //                 paddingHorizontal: 5,
    //                 fontWeight: '500',
    //                 marginVertical: 10,
    //               }}>
    //               Select Your Vehicle Type
    //             </Text>
    //             {vehicleType?.map((item, index) => {
    //               return (
    //                 <TouchableOpacity
    //                   key={index}
    //                   onPress={() => {
    //                     setSelectVehicle(item);
    //                     setSelectVehicleType(item.type);
    //                     setVehicleTypeVisible(false);
    //                   }}>
    //                   <Text
    //                     style={{
    //                       fontSize: 16,
    //                       color: Color.black,
    //                       paddingHorizontal: 5,
    //                       fontWeight: '500',
    //                       textAlign: 'center',
    //                       textTransform: 'uppercase',
    //                       marginVertical: 10,
    //                     }}>
    //                     {item?.name}
    //                   </Text>
    //                   <View
    //                     style={{
    //                       height: 1,
    //                       backgroundColor: Color.cloudyGrey,
    //                     }}
    //                   />
    //                 </TouchableOpacity>
    //               );
    //             })}
    //           </View>
    //         </Modal>
    //       </View>
    //     )}
    //   </View>
    //   <View style={styles.containernormal}>
    //     <View
    //       style={{
    //         width: '95%',
    //         flexDirection: 'row',
    //         justifyContent: 'space-between',
    //         alignItems: 'center',
    //       }}>
    //       <View
    //         style={{
    //           flex: 1,
    //           justifyContent: 'flex-start',
    //           alignItems: 'flex-start',
    //         }}>
    //         <Text
    //           style={{
    //             fontSize: 16,
    //             color: Color.lightBlack,
    //             fontFamily: Manrope.SemiBold,
    //             paddingVertical: 10,
    //           }}>
    //           Pickup Location :
    //         </Text>
    //         <Text
    //           style={{
    //             fontSize: 16,
    //             color: Color.lightBlack,
    //             fontFamily: Manrope.SemiBold,
    //             paddingVertical: 10,
    //           }}>
    //           Drop Location :
    //         </Text>
    //       </View>
    //       <View
    //         style={{
    //           flex: 1.5,
    //           justifyContent: 'flex-start',
    //           alignItems: 'flex-start',
    //         }}>
    //         {origin != null && origin != undefined && origin != ' ' ? (
    //           <View>
    //             <View style={{paddingVertical: 5}}>
    //               <Text
    //                 style={{
    //                   fontSize: 16,
    //                   textAlign: 'justify',
    //                   color: Color.black,
    //                   fontFamily: Manrope.Bold,
    //                 }}>
    //                 {initorigin}
    //               </Text>
    //               <TouchableOpacity
    //                 onPress={() => navigation.navigate('pickupoint')}>
    //                 <Text
    //                   style={{
    //                     color: Color.primary,
    //                     fontSize: 14,
    //                     fontFamily: Manrope.Bold,
    //                     fontWeight: 'bold',
    //                     textDecorationLine: 'underline',
    //                   }}>
    //                   Edit
    //                 </Text>
    //               </TouchableOpacity>
    //             </View>
    //             <View style={{paddingVertical: 5}}>
    //               <Text
    //                 style={{
    //                   fontSize: 16,
    //                   textAlign: 'justify',
    //                   color: Color.black,
    //                   fontFamily: Manrope.Bold,
    //                 }}>
    //                 {initdrop}
    //               </Text>
    //               <TouchableOpacity
    //                 onPress={() => navigation.navigate('pickupoint')}>
    //                 <Text
    //                   style={{
    //                     color: Color.primary,
    //                     fontSize: 14,
    //                     fontFamily: Manrope.Bold,
    //                     fontWeight: 'bold',
    //                     textDecorationLine: 'underline',
    //                   }}>
    //                   Edit
    //                 </Text>
    //               </TouchableOpacity>
    //             </View>
    //           </View>
    //         ) : (
    //           <TouchableOpacity
    //             onPress={() => navigation.navigate('pickupoint')}
    //             style={{
    //               width: '80%',
    //               height: 45,
    //               backgroundColor: Color.primary,
    //               borderRadius: 5,
    //               justifyContent: 'center',
    //               alignItems: 'center',
    //             }}>
    //             <Text style={styles.location}>Choose Location</Text>
    //           </TouchableOpacity>
    //         )}
    //       </View>
    //     </View>

    //     {/* <View style={styles.action}>
    //                 <FontAwesome style={styles.icon} name="map-marker" color="#828282" size={20} />
    //                 <TextInput
    //                     placeholder="Please Select Pickup"
    //                     placeholderTextColor="#666666"
    //                     value={initorigin}
    //                     style={[
    //                         styles.textInput
    //                     ]}
    //                     onPressIn={() => {
    //                         navigation.navigate('pickupoint');
    //                     }}
    //                     autoCapitalize="none"

    //                 />
    //             </View>

    //             <View style={styles.action}>
    //                 <FontAwesome style={styles.icon} name="map-marker" color={'#828282'} size={20} />
    //                 <TextInput
    //                     placeholder="Please Select Drop Location"
    //                     placeholderTextColor="#666666"
    //                     value={initdrop}
    //                     onPressIn={() => {
    //                         navigation.navigate('destinationpoint');
    //                     }}
    //                     style={[
    //                         styles.textInput
    //                     ]}
    //                     autoCapitalize="none"

    //                 />
    //             </View> */}

    //     <View style={{marginVertical: 10}}>
    //       <Text
    //         style={{
    //           fontSize: 16,
    //           color: Color.lightBlack,
    //           fontFamily: Manrope.SemiBold,
    //           paddingVertical: 5,
    //         }}>
    //         Date & Time
    //       </Text>
    //       <TouchableOpacity
    //         onPress={() => {
    //           setShow(true);
    //         }}>
    //         <View style={styles.action}>
    //           <FontAwesome
    //             style={styles.icon}
    //             name="calendar-plus-o"
    //             color={'#828282'}
    //             size={20}
    //           />
    //           <View style={{backgroundColor: '#fff', borderRadius: 20}}>
    //             {show && (
    //               <DatePicker
    //                 modal
    //                 open={show}

    //                 date={tdate}
    //                 mode="datetime"
    //                 minimumDate={new Date()}
    //                 onConfirm={dated => {
    //                   onChange(dated);
    //                   setShow(false);
    //                 }}
    //                 onCancel={() => {
    //                   setShow(false);
    //                 }}
    //               />
    //             )}
    //           </View>

    //           <View
    //             style={{
    //               backgroundColor: '#fff',
    //               borderRadius: 20,
    //               paddingTop: 6,
    //             }}>
    //             <TextInput
    //               placeholder="Select Date And Time"
    //               placeholderTextColor="#666666"
    //               value={dateobj}
    //               style={[styles.textInput]}
    //               editable={false}
    //             />
    //           </View>
    //         </View>
    //       </TouchableOpacity>
    //     </View>

    //     <View style={{marginVertical: 0}}>
    //       <Text
    //         style={{
    //           fontSize: 16,
    //           color: Color.lightBlack,
    //           fontFamily: Manrope.SemiBold,
    //         }}>
    //         Goods Type
    //       </Text>
    //       <View style={styles.action}>
    //         <FontAwesome
    //           style={styles.icon}
    //           name="dropbox"
    //           color={'#828282'}
    //           size={20}
    //         />
    //         <Select
    //           selectedIndex={goodIndex}
    //           value={goodValue}
    //           style={{backgroundColor: '#fff', paddingLeft: 20, width: '80%'}}
    //           onSelect={index => {
    //             setgoodValue(goodType[index.row].goodsname);
    //             setgoodIndex(index);
    //           }}>
    //           {loadgoods()}
    //         </Select>
    //       </View>
    //     </View>
    //     <View style={{marginVertical: 10}}>
    //       <Text
    //         style={{
    //           fontSize: 16,
    //           color: Color.lightBlack,
    //           fontFamily: Manrope.SemiBold,
    //         }}>
    //         Fare Type
    //       </Text>
    //       <View style={styles.action}>
    //         <FontAwesome
    //           style={styles.icon}
    //           name="object-group"
    //           color={'#828282'}
    //           size={20}
    //         />
    //         <Select
    //           selectedIndex={tripIndex}
    //           value={tripValue}
    //           style={{backgroundColor: '#fff', paddingLeft: 20, width: '80%'}}
    //           onSelect={index => {
    //             settripValue(tripType[index.row].name);
    //             settripTypeid(tripType[index.row].id);
    //             settripIndex(index);
    //           }}>
    //           {loadtrips()}
    //         </Select>
    //       </View>
    //     </View>

    //     {tripValue == 'Package Fare' ? (
    //       <View>
    //         <Text
    //           style={{
    //             fontSize: 16,
    //             color: Color.lightBlack,
    //             fontFamily: Manrope.SemiBold,
    //           }}>
    //           Package Fare Type
    //         </Text>
    //         <View style={styles.action}>
    //           <FontAwesome
    //             style={styles.icon}
    //             name="clock-o"
    //             color={'#828282'}
    //             size={20}
    //           />
    //           <Select
    //             selectedIndex={packageIndex}
    //             value={Packagevalue}
    //             style={{
    //               backgroundColor: '#fff',
    //               borderColor: '#fff',
    //               paddingLeft: 20,
    //               width: '80%',
    //             }}
    //             onSelect={index => {
    //               setPackagevalue(packageType[index.row].basefare);
    //               setPackageselcted(packageType[index.row]);
    //               setpackageID(packageType[index.row].id);
    //               setpackageIndex(index);
    //             }}>
    //             {loadpackage()}
    //           </Select>
    //         </View>
    //       </View>
    //     ) : null}

    //     {tripValue == 'Intercity Fare' ? (
    //       <View>
    //         <Text
    //           style={{
    //             fontSize: 16,
    //             color: Color.lightBlack,
    //             fontFamily: Manrope.SemiBold,
    //           }}>
    //           Intercity Fare Type
    //         </Text>
    //         <View style={styles.action}>
    //           <FontAwesome
    //             style={styles.icon}
    //             name="clock-o"
    //             color={'#828282'}
    //             size={20}
    //           />
    //           <Select
    //             selectedIndex={interCityIndex}
    //             value={intercityvalue}
    //             style={{
    //               backgroundColor: '#fff',
    //               borderColor: '#fff',
    //               paddingLeft: 20,
    //               width: '80%',
    //             }}
    //             onSelect={index => {
    //               setIntercityValue(intercityType[index.row].basefare);
    //               setInterCitySelcted(intercityType[index.row]);
    //               setinterID(intercityType[index.row].id);
    //               setinterCityIndex(index);
    //             }}>
    //             {loadintercity()}
    //           </Select>
    //         </View>
    //       </View>
    //     ) : null}

    //     {tripValue == 'Night Fare' ? (
    //       <View>
    //         <Text
    //           style={{
    //             fontSize: 16,
    //             color: Color.lightBlack,
    //             fontFamily: Manrope.SemiBold,
    //           }}>
    //           Night Fare Type
    //         </Text>
    //         <View style={styles.action}>
    //           <FontAwesome
    //             style={styles.icon}
    //             name="clock-o"
    //             color={'#828282'}
    //             size={20}
    //           />
    //           <Select
    //             selectedIndex={nightIndex}
    //             value={nightFareValue}
    //             style={{
    //               backgroundColor: '#fff',
    //               borderColor: '#fff',
    //               paddingLeft: 20,
    //               width: '80%',
    //             }}
    //             onSelect={index => {
    //               setNightFareValue(nightFareType[index.row].basefare);
    //               setNightSelcted(nightFareType[index.row]);
    //               setnightID(nightFareType[index.row].id);
    //               setNightIndex(index);
    //             }}>
    //             {loadnight()}
    //           </Select>
    //         </View>
    //       </View>
    //     ) : null}

    //     <View style={{marginVertical: 5}}>
    //       <Text
    //         style={{
    //           fontSize: 16,
    //           color: Color.lightBlack,
    //           fontFamily: Manrope.SemiBold,
    //         }}>
    //         No. Of Trips
    //       </Text>
    //       <View style={styles.action}>
    //         <FontAwesome
    //           style={styles.icon}
    //           name="dropbox"
    //           color={'#828282'}
    //           size={20}
    //         />
    //         <Select
    //           selectedIndex={countindex}
    //           value={countvalue}
    //           style={{backgroundColor: '#fff', paddingLeft: 20, width: '80%'}}
    //           onSelect={index => {
    //             console.log(index);

    //             var count = index.row + 1;
    //             setcountValue(count);
    //             setcountindex(index.row);
    //           }}>
    //           <SelectItem title={<Text>1 </Text>} />
    //           <SelectItem title={<Text>2 </Text>} />
    //           <SelectItem title={<Text>3 </Text>} />
    //           <SelectItem title={<Text>4</Text>} />
    //           <SelectItem title={<Text>5 </Text>} />
    //         </Select>
    //       </View>
    //     </View>

    //     <View style={styles.numberHeader}>
    //       <Text style={styles.alterNumber}>Alternative Mobile Number </Text>
    //       {/* <Text style={styles.optional}>(optional)</Text> */}
    //     </View>
    //     <View style={styles.numberView}>
    //       <Text style={styles.numberText}>+91</Text>
    //       <TextInput
    //         style={styles.numberInput}
    //         placeholder="Alternative Mobile Number....."
    //         placeholderTextColor={Color.black3}
    //         keyboardType="phone-pad"
    //         value={atlerNumber}
    //         onChangeText={text => setAlterNUmber(text)}
    //         maxLength={10}
    //       />
    //     </View>

    //     <View style={styles.button}>
    //       <TouchableOpacity
    //         style={styles.signIn}
    //         onPress={() => {
    //           BookingPreview();
    //         }}>
    //         <LinearGradient
    //           colors={['#85388d', '#85388d']}
    //           style={styles.signIn}>
    //           <Text
    //             style={[
    //               styles.textSign,
    //               {
    //                 color: '#fff',
    //               },
    //             ]}>
    //             Continue
    //           </Text>
    //         </LinearGradient>
    //       </TouchableOpacity>
    //     </View>
    //   </View>
    // </ScrollView>
    <View style={{flex: 1}}>
      <ScrollView
        style={{
          flex: 1,
          padding: 10,
          backgroundColor: '#D4D3D3',
          marginTop: 3,
        }}>
        <View style={{flex: 1}}>
          <View style={{flex: 1, gap: 10}}>
            <View style={{gap: 10}}>
              <View style={{marginTop: 25, marginBottom: 16}}>
                <Text
                  style={{
                    fontSize: 19,
                    color: '#333333',
                    fontFamily: Manrope.Medium,
                    textTransform: 'capitalize',
                  }}>
                  Choose your Vehicle
                </Text>
              </View>
              <FlatList
                data={vehcilelist}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={data => {
                  const selected = vehicleselected?.id === data?.item?.id;
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
                        setvehicleselected(data?.item);
                        setSelectedFareType({"_id": "5e9070ebfe84eb22b4243818", "id": "1", "name": "Meter Fare"});
                      }}>
                      <Image
                        source={{uri: data?.item?.url}}
                        style={{
                          height: 43,
                          width: 76,
                        }}
                        resizeMode="contain"
                      />
                      <View>
                        <Text
                          style={{
                            color: Color.black,
                            fontFamily: Manrope.Bold,
                            fontSize: 13,
                          }}>
                          {data?.item?.vehicletype}
                        </Text>
                      </View>
                      <View>
                        <Text
                          style={{
                            color: Color.black,
                            fontFamily: Manrope.Bold,
                            fontSize: 12,
                          }}>
                          {data?.item?.loadcapacity}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
                keyExtractor={(item, index) => index}
              />
            </View>
            <View>
              <View
                style={{
                  flexDirection: 'row',
                  gap: 10,
                  marginTop: 20,
                  alignItems: 'center',
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
                <TouchableOpacity
                  onPress={() => {
                    refRBSheet?.current?.open();
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 5,
                    padding: 5,
                  }}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: Color.black,
                      fontFamily: Manrope.Medium,
                      textTransform: 'uppercase',
                    }}>
                    {selectedVehicletype?.name}
                  </Text>
                  <Iconviewcomponent
                    Icontag={'AntDesign'}
                    iconname={'down'}
                    icon_size={20}
                    icon_color={Color.black}
                  /> 
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {/* <View
            style={{
              borderBottomWidth: 1,
              borderColor: Color.grey,
              marginTop: 20,
              marginBottom: 20,
              height: 1,
            }}></View> */}
          <View style={{gap: 10}}>
            <View style={{marginTop: 10}}>
              {route?.params == undefined ? (
                <View>
                  <View
                    style={{
                      // flexDirection: 'row',
                      // alignItems: 'center',
                      gap: 10,
                    }}>
                    <View style={{gap: 35}}>
                      {/* <Text
                        style={{
                          fontSize: 14,
                          color: Color.black,
                          fontFamily: Manrope.Medium,
                          textTransform: 'capitalize',
                        }}>
                        Pickup Location :
                      </Text> */}
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
                        backgroundColor:Color?.primary,
                // width: '50%',

                justifyContent: 'center',
                // justifyContent: 'center',
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
                      {/* <Iconviewcomponent
                        Icontag={'FontAwesome6'}
                        iconname={'location-dot'}
                        icon_size={16}
                        icon_color={Color.white}
                      /> */}
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
                    <View style={{backgroundColor: '#EEEEEE',
                // width: '50%',

                justifyContent: 'center',
                // justifyContent: 'center',
                alignItems: 'center',
                padding: 15,
                borderRadius: 30,
                flexDirection: 'row',
                gap: 20}}>
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
                          width: width / 1.45,
                        }}
                        numberOfLines={1}
                        onPress={()=>{
                          navigation.navigate('Map_screen');
                        }}
                        >
                        {route.params?.data?.pickup?.Address}
                      </Text>
                      {/* <TouchableOpacity
                        style={{padding: 5}}
                        onPress={() => { 
                          navigation.navigate('Map_screen'); 
                        }}>
                        <Text style={{color: Color.primary, fontSize: 14}}>
                          Edit
                        </Text>
                      </TouchableOpacity> */}
                    </View>
                  </View>
                  <View
                    style={{
                      // flexDirection: 'row',
                      gap: 10,
                      // alignItems: 'center',
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
                    <View style={{backgroundColor: '#EEEEEE',
                // width: '50%',

                justifyContent: 'center',
                // justifyContent: 'center',
                alignItems: 'center',
                padding: 15,
                borderRadius: 30,
                flexDirection: 'row',
                gap: 20,}}>
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
                          width: width / 1.45,
                        }}
                        onPress={()=>{
                          navigation.navigate('Map_screen');
                        }}
                        numberOfLines={1}>
                        {route.params?.data?.drop?.Address}
                      </Text>
                      {/* <TouchableOpacity
                        style={{padding: 5}}
                        onPress={() => {
                          navigation.navigate('Map_screen');
                        }}>
                        <Text style={{color: Color.primary, fontSize: 14}}>
                          Edit
                        </Text>
                      </TouchableOpacity> */}
                    </View>
                  </View>
                </View>
              )}
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
                // width: '50%',

                justifyContent: 'center',
                // justifyContent: 'center',
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
            {/* <View style={{gap: 10, marginTop: 10}}>
              <View style={{flexDirection: 'row', gap: 10}}>
                <Text
                  style={{
                    fontSize: 16,
                    color: Color.black, 
                    fontFamily: Manrope.SemiBold,
                    textTransform: 'capitalize',
                  }}>
                  Pickup Location :
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: Color?.purple,
                    padding: 5,
                    borderRadius: 5,
                  }}
                  onPress={() => {
                    console.log('eeeeee'), navigation.navigate('Map_screen');
                  }}>
                  <Text
                    style={{
                      color: Color.white,
                      fontFamily: Manrope.SemiBold,
                      textTransform: 'capitalize',
                    }}>
                    location
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={{flexDirection: 'row', gap: 10}}>
                <Text
                  style={{
                    fontSize: 16,
                    color: Color.black,
                    fontFamily: Manrope.SemiBold,
                    textTransform: 'capitalize',
                  }}>
                  Drop Location :
                </Text>
                <TouchableOpacity
                  style={{
                    backgroundColor: Color?.purple,
                    padding: 5,
                    borderRadius: 5,
                  }}>
                  <Text
                    style={{
                      color: Color.white,
                      fontFamily: Manrope.SemiBold,
                      textTransform: 'capitalize',
                    }}>
                    location
                  </Text>
                </TouchableOpacity>
              </View>
            </View> */}
          </View>
          {/* <View
            style={{
              borderBottomWidth: 1,
              borderColor: Color.grey,
              marginTop: 20,
              marginBottom: 20,
              height: 1,
            }}></View> */}
          <View style={{gap: 15, marginTop: 15}}>
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
                  // borderWidth: 0.5,
                  backgroundColor: '#EEEEEE',
                  // borderColor: Color?.black,
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
                    {selectedGoodsType?.goodsname}
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
                  refRBSheetFareType?.current?.open();
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 20,
                  // borderWidth: 0.5,
                  backgroundColor: '#EEEEEE',
                  // borderColor: Color?.black,
                  borderRadius: 30,
                  padding: 5,
                  justifyContent: 'center',
                }}>
                {/* <Iconviewcomponent
                  Icontag={'AntDesign'}
                  iconname={'dropbox'}
                  icon_size={20}
                  icon_color={Color.black}
                /> */}
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
                    {selectedfareType?.name}
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
            {selectedfareType?.name !== 'Meter Fare' ? (
              <View style={{gap: 10}}>
                <View style={{width: width / 2.7}}>
                  <Text
                    style={{
                      fontSize: 18,
                      color: Color.black,
                      fontFamily: Manrope.Medium,
                      textTransform: 'capitalize',
                    }}>
                    {selectedfareType?.name} :
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    refRBSheetVehicleFare?.current?.open();
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 20,
                    // borderWidth: 0.5,
                    backgroundColor: '#EEEEEE',
                    // borderColor: Color?.black,
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
                    {console.log("fffff",selectedFarevalue)
                    }
                    <Text
                      style={{
                        fontSize: 16,
                        color: Color.black,
                        fontFamily: Manrope.Regular,
                        textTransform: 'capitalize',
                      }}>
                    { isfarepac == true ? `${selectedFarevalue?.baseminute} -->  ${selectedFarevalue?.basekm} KM --> ₹${selectedFarevalue?.basefare}`: "select fare"}
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
            ) : null}
            {/* <View style={{gap:10}}>
            <View style={{width:width/2.7}}>
              <Text
                style={{
                  fontSize: 16,
                  color: Color.black,
                  fontFamily: Manrope.Medium,
                  textTransform: 'capitalize',
                }}>
                Fare Type :
              </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  refRBSheetFareType?.current?.open();
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  borderWidth: 0.5,
                  borderColor: Color?.black,
                  borderRadius:5,
                  padding: 10,
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: Color.black,
                    fontFamily: Manrope.Regular,
                    textTransform: 'capitalize',
                  }}>
                  {selectedfareType?.name}
                </Text>
                <Iconviewcomponent
                  Icontag={'AntDesign'}
                  iconname={'down'}
                  icon_size={20}
                  icon_color={Color.black}
                />
              </TouchableOpacity>
            </View> */}
            {/* {selectedfareType?.name !== 'Meter Fare' ? (
              <View style={{flexDirection: 'row',alignItems:'center'}}>
               <View style={{width:width/2.7}}>
                <Text
                  style={{
                    fontSize: 16,
                  color: Color.black,
                  fontFamily: Manrope.Medium,
                    textTransform: 'capitalize',
                  }}>
                  {selectedfareType?.name} :
                </Text>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    refRBSheetVehicleFare?.current?.open();
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 5,
                    borderWidth: 0.5,
                    borderColor: Color?.black,
                    borderRadius:5,
                    padding: 10,
                  }}>
                  <Text
                    style={{
                      fontSize: 14,
                    color: Color.black,
                    fontFamily: Manrope.Regular,
                      textTransform: 'capitalize',
                    }}>
                    {`${selectedFarevalue?.basekm} KM --> ₹${selectedFarevalue?.basefare}`}
                  </Text>
                  <Iconviewcomponent
                    Icontag={'AntDesign'}
                    iconname={'downcircle'}
                    icon_size={20}
                    icon_color={Color.black}
                  />
                </TouchableOpacity>
              </View>
            ) : null} */}
            <View style={{gap: 10}}>
              <View style={{width: width / 2.7}}>
                <Text
                  style={{
                    fontSize: 18,
                    color: Color.black,
                    fontFamily: Manrope.Medium,
                    textTransform: 'capitalize',
                  }}>
                  NO of Vehicles :
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  refRBSheettripcount?.current?.open();
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 20,
                  // borderWidth: 0.5,
                  backgroundColor: '#EEEEEE',
                  // borderColor: Color?.black,
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
                    {selectedtripcount?.count}
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

            {/* <View style={{flexDirection: 'row',alignItems:'center'}}>
            <View style={{width:width/2.7}}>
              <Text
                style={{
                  fontSize: 16,
                  color: Color.black,
                  fontFamily: Manrope.Medium,
                  textTransform: 'capitalize',
                }}>
                NO of Vehicles :
              </Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  refRBSheettripcount?.current?.open();
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  borderWidth: 0.5,
                  borderColor: Color?.black,
                  borderRadius:5,
                  padding: 10,
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    color: Color.black,
                    fontFamily: Manrope.Regular,
                    textTransform: 'capitalize',
                  }}>
                  {selectedtripcount?.count}
                </Text>
                <Iconviewcomponent
                  Icontag={'AntDesign'}
                  iconname={'downcircle'}
                  icon_size={20}
                  icon_color={Color.black}
                />
              </TouchableOpacity>
            </View> */}
            <View style={{gap: 10}}>
              <Text
                style={{
                  fontSize: 16,
                  color: Color.black,
                  fontFamily: Manrope.Medium,
                  textTransform: 'capitalize',
                }}>
                Alternative Mobile Number{' '}
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
                  placeholder="Alternative Mobile Number....."
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

                return (
                  <TouchableOpacity
                    onPress={() => {
                      setisfarepac(false);
                      selectedFaretype(item);
                      setSelectedFareType(item);
                      if(item?.name == "Night Fare")
                      {
                        settripTypeid(4)
                      }else{
                        if(item?.name == "Package Fare")
                        {
                          settripTypeid(2)
                        }else{
                          if(item?.name == "Intercity Fare")
                          {
                            settripTypeid(3)
                          }else{
                            settripTypeid(1)
                          }
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
          height={selectedfareType?.name !== 'Intercity Fare' ? 300 : 700}
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
            if(isfarepac == false && selectedfareType?.name !== 'Meter Fare')
            {
              ToastAndroid.show(
                'Please Select All Mandatory Fields',
                ToastAndroid.SHORT,
              );
            }else{
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
        {/* <TouchableOpacity
          style={{
            backgroundColor: Color?.primary,
            padding: 10,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: 5,
          }}
          onPress={() => {
          navigation.navigate('quizzApp');
          }}>
          <Text
            style={{
              fontSize: 16,
              color: Color?.white,
              fontFamily: Manrope.SemiBold,
              textTransform: 'capitalize',
            }}>
            quizzApp
          </Text>
          <Iconviewcomponent
            Icontag={'FontAwesome'}
            iconname={'arrow-circle-right'}
            icon_size={20}
            iconstyle={{color: Color.white}}
          />
        </TouchableOpacity> */}
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
    // gap: width * 0.06,
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
    // maxHeight: height * 0.05,
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
