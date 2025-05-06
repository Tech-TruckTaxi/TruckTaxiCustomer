import React, {
  Component,
  useContext,
  useState,
  useRef,
  useEffect,
  Fragment,
} from 'react';
import {
  Image,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
  Modal,
  Pressable,
  ToastAndroid,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import {getPixelSize} from './utils/utils';
import {useDispatch, useSelector} from 'react-redux';
import {
  selectDestination,
  selectOrigin,
  setOrigin,
  setNull,
  setDestination,
  setTravelTimeInformation,
} from '../slices/navSlice';
import {P, H5, H4, H2, H6, H3} from '../components/typography';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';
import {CommonActions} from '@react-navigation/native';
import {
  Back,
  LocationBox,
  LocationText,
  LocationTimeBox,
  LocationTimeText,
  LocationTimeTextSmall,
} from './Map/styles';
import moment from 'moment';
import OTPInput from '../components/OTPInput';
import Color from '../Global/Color';
import {Manrope} from '../Global/FontFamily';
import {Iconviewcomponent} from '../Global/Icontag';
const {width, height} = Dimensions.get('screen');
const BookingPreview = ({navigation, route}) => {
  console.log('XXXXXXXXXXXddddXXXXXXXXXXXX');
  console.log(route?.params, 'sssss');
  console.log('XXXXXXXXXXXXXXXXXXXXXXX');
  const [region, setregion] = useState({
    latitude: 12.9630208,
    longitude: 80.1898496,
    latitudeDelta: 0.0143,
    longitudeDelta: 0.0134,
  });
  const mapView = useRef();
  const [duration, setduration] = React.useState(null);
  const [initorigin, setinitorigin] = useState(null);
  const [initdrop, setinitdrop] = useState(null);
  const [showLoading, setshowLoading] = useState(false);
  const [pickadd, setpickadd] = useState('');
  const [pickdrop, setpickdrop] = useState('');
  const [amount, setamount] = useState('');
  const {packageid} = route.params;
  const {interID} = route.params;
  const {nightID} = route.params;
  const {location} = route.params;
  const {alternativemobno} = route.params;
  const {distance} = route.params;

  const {selectedvehcilelist} = route.params;
  const {tripValue} = route.params;
  const {goodValue} = route.params;
  const {Packagevalue} = route.params;
  const {datetosend} = route.params;
  const {time} = route.params;
  const {peakfare} = route.params;
  const {tripcount} = route.params;
  const {total} = route.params;
  const {tripTypeid} = route.params;
  const {interfare} = route.params;
  const {iscv} = route.params;

  const dispatch = useDispatch();
  const inputRef = useRef(null);

  const [code, setCode] = useState('');
  const [isPinReady, setIsPinReady] = useState(false);
  const [bookingOTPVisible, setBookingOTPVisible] = useState(false);
  const [bookingData, setBookingData] = useState({});
  console.log(
    'distancedistancedistancedistance',
    distance,
    'ooooooooooooooooo',
  );

  useEffect(() => {
    navigation.setOptions({
      title: <Text>Booking Preview</Text>,
    });
  });

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      reload();
    });
    return unsubscribe;
  }, [navigation]);

  const reload = () => {
    console.log('Regular Call');
    setinitorigin({
      latitude: 11.0168,
      longitude: 76.9558,
    });
    setregion({
      latitude: 11.0168,
      longitude: 76.9558,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    setinitdrop({
      latitude: location?.drop?.latitude,
      longitude: location?.drop?.longitude,
    });

    setshowLoading(true);
    setamount(peakfare);
    setshowLoading(false);
  };

  const ConfirmBooking = () => {
    AsyncStorage.getItem('user').then(mobile => {
      AsyncStorage.getItem('userToken').then(value => {
        var myHeaders = new Headers();
        myHeaders.append('Authorization', 'Bearer ' + value);
        myHeaders.append('Content-Type', 'application/json');
        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow',
        };
        fetch(
          'https://trucktaxi.co.in/api/customer/getprofiledetails?mobileno=' +
            mobile,
          requestOptions,
        )
          .then(response => response.json())
          .then(result => {
            console.log('sssssssssssss', result);
            var id = result.data[0].customerid;
            var cityidid = result.data[0].cityid;
            const isValidTrip = (tripDate, tripTime) => {
              const currentDate = new Date();
              const selectedDateTime = new Date(`${tripDate} ${tripTime}`);
              const formattedCurrentDate = currentDate
                .toISOString()
                .split('T')[0];
              const formattedTripDate = tripDate;

              console.log('Selected DateTime:', selectedDateTime);
              console.log('Current DateTime:', currentDate);
              if (formattedTripDate > formattedCurrentDate) {
                return true;
              } else if (formattedTripDate === formattedCurrentDate) {
                const currentHours = currentDate?.getHours();
                const currentMinutes = currentDate?.getMinutes();

                const [tripHours, tripMinutes] = tripTime
                  .replace(/AM|PM/, '')
                  .split(':')
                  .map(Number);

                const isPM = tripTime?.includes('PM');
                const selectedHours =
                  isPM && tripHours !== 12 ? tripHours + 12 : tripHours % 12;

                if (
                  selectedHours > currentHours ||
                  (selectedHours === currentHours &&
                    tripMinutes >= currentMinutes)
                ) {
                  return true;
                }
              }

              return false;
            };
            const data = isValidTrip(datetosend, time);
            const getCurrentTime = () => {
              return moment().format('hh:mm A');
            };
            var raw = JSON.stringify({
              cityid: cityidid,
              mobileno: mobile,
              name: result.data[0].customername,
              fromloc: location?.pickup?.Address,
              fromloclat: location?.pickup?.latitude.toString(),
              fromloclong: location?.pickup?.longitude.toString(),
              toloc: location?.drop?.Address,
              toloclat: location?.drop?.latitude.toString(),
              toloclong: location?.drop?.longitude.toString(),
              tripdate: datetosend,
              triptime: data ? time : getCurrentTime(),
              noofbookings: 1,
              iscv: iscv,
              triptype: tripTypeid,
              packagetype: packageid,
              nighttype: nightID,
              intercitytype: `${Math.round(
                selectedvehcilelist?.basekm,
              )}-${interfare}-${selectedvehcilelist?.baseminute}`,
              vechicletype: selectedvehcilelist?.vehicleID,
              goodstype: goodValue?.goodsname,
              customerid: id,
              alternativemobno: alternativemobno,
              distance : distance?.distance

            });
            var requestOptions = {
              method: 'POST',
              headers: myHeaders,
              body: raw,
              redirect: 'follow',
            };
            fetch(
              'https://trucktaxi.co.in/api/customer/booknow',
              requestOptions,
            )
              .then(response => response.json())
              .then(result => {
                if (result.data[0].status == 200) {
                  setshowLoading(false);
                  setBookingOTPVisible(true);
                  console.log('result', result?.data[0]);
                  setBookingData(result?.data?.[0]);
                } else {
                  ToastAndroid.show('Try again later', ToastAndroid.SHORT);
                }
              })
              .catch(error => {
                setshowLoading(false);
              });
          });
      });
    });

    dispatch(setOrigin(null));
    dispatch(setDestination(null));
  };

  const getquote = () => {
    AsyncStorage.getItem('user').then(mobile => {
      AsyncStorage.getItem('userToken').then(value => {
        var myHeaders = new Headers();
        myHeaders.append('Authorization', 'Bearer ' + value);
        myHeaders.append('Content-Type', 'multipart/form-data');
        var requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow',
        };
        fetch(
          'https://trucktaxi.co.in/api/customer/getprofiledetails?mobileno=' +
            mobile,
          requestOptions,
        )
          .then(response => response.json())
          .then(result => {
            var id = result.data[0].customerid;
            var cityidid = result.data[0].cityid;
            let date = moment(datetosend, 'DD-MM-YYYY').format('YYYY-MM-DD');
            const isValidTrip = (tripDate, tripTime) => {
              const currentDate = new Date();
              const selectedDateTime = new Date(`${tripDate} ${tripTime}`);
              const formattedCurrentDate = currentDate
                .toISOString()
                .split('T')[0];
              const formattedTripDate = tripDate;
              if (formattedTripDate > formattedCurrentDate) {
                return true;
              } else if (formattedTripDate === formattedCurrentDate) {
                const currentHours = currentDate?.getHours();
                const currentMinutes = currentDate?.getMinutes();

                const [tripHours, tripMinutes] = tripTime
                  .replace(/AM|PM/, '')
                  .split(':')
                  .map(Number);

                const isPM = tripTime?.includes('PM');
                const selectedHours =
                  isPM && tripHours !== 12 ? tripHours + 12 : tripHours % 12;

                if (
                  selectedHours > currentHours ||
                  (selectedHours === currentHours &&
                    tripMinutes >= currentMinutes)
                ) {
                  return true;
                }
              }

              return false;
            };
            const data = isValidTrip(datetosend, time);
            const getCurrentTime = () => {
              return moment().format('hh:mm A'); // Example Output: "03:08 PM"
            };
            var formData = new FormData();

            formData.append('branchid', cityidid);
            formData.append('mobileno', mobile);
            formData.append('name', result.data[0].customername);
            formData.append('fromloc', location?.pickup?.Address);
            formData.append(
              'fromloclat',
              location?.pickup?.latitude.toString(),
            );
            formData.append(
              'fromloclong',
              location?.pickup?.longitude.toString(),
            );
            formData.append('toloc', location?.drop?.Address);
            formData.append('toloclat', location?.drop?.latitude.toString());
            formData.append('toloclong', location?.drop?.longitude.toString());
            formData.append('tripdate', datetosend);
            formData.append('triptime', data ? time : getCurrentTime());
            formData.append('triptype', tripTypeid);
            formData.append('packagetype', packageid);
            formData.append('intercitytype', interfare);
            formData.append('vechicletype', selectedvehcilelist?.vehicleID);
            formData.append('goodstype', goodValue?.goodsname);
            formData.append('customerid', id);
            formData.append('fare', total);
            formData.append('distance', distance?.distance);
            formData.append('iscv', iscv);

            console.log('enquiry payload data <=====>', formData);
            var requestOptions = {
              method: 'POST',
              headers: myHeaders,
              body: formData,
              redirect: 'follow',
            };
            fetch(
              'https://trucktaxi.co.in/api/customer/addenquiry',
              requestOptions,
            )
              .then(response => response.json())
              .then(result => {
                setshowLoading(false);
                if (result.data[0].status == 200) {
                  navigation.reset({
                    index: 0,
                    routes: [{name: 'New Booking'}],
                  });
                  ToastAndroid.show(
                    'Enquiry Sent successfully',
                    ToastAndroid.SHORT,
                  );
                  navigation.navigate('Home');
                  dispatch(setNull());
                }
              })
              .catch(error => {
                setshowLoading(false);
              });
          });
      });
    });
  };

  const setVerifyOTP = async () => {
    try {
      AsyncStorage.getItem('user').then(mobile => {
        AsyncStorage.getItem('userToken').then(value => {
          var myHeaders = new Headers();
          myHeaders.append('Content-Type', 'application/json');
          myHeaders.append('Authorization', 'Bearer ' + value);

          var raw = JSON.stringify({
            bookid: bookingData?.bookid,
            OTP: code,
          });

          var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow',
          };
          console.log('requ============ : ', requestOptions);
          fetch(
            'https://trucktaxi.co.in/api/customer/verifyTripOTP',
            requestOptions,
          )
            .then(response => response.json())
            .then(result => {
              if (result?.status == 200) {
                setshowLoading(false);
                ToastAndroid.show(result?.message, ToastAndroid.SHORT);
                setBookingOTPVisible(false);
                navigation.reset({
                  index: 0,
                  routes: [{name: 'New Booking'}],
                });
              } else {
                ToastAndroid.show(result?.message, ToastAndroid.SHORT);
                setshowLoading(false);
              }
            })
            .catch(error => console.log('error', error));
        });
      });
    } catch (error) {
      console.log('catch in Verify_OTP_Api :', error);
    }
  };

  if (showLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView style={styles.map} region={region} ref={mapView} loadingEnabled>
        <MapViewDirections
          origin={initorigin}
          destination={initdrop}
          apikey="AIzaSyAGbxLrxGIFLkfaGze-660NY6RrITMkeR0"
          strokeWidth={4}
          strokeColor="#3500c2"
          onReady={result => {
            setduration(Math.floor(result.duration));
            mapView.current.fitToCoordinates(result.coordinates, {
              edgePadding: {
                right: getPixelSize(50),
                left: getPixelSize(50),
                top: getPixelSize(150),
                bottom: getPixelSize(350),
              },
            });
          }}
        />
        <Marker coordinate={initdrop} anchor={{x: 0, y: 0}}>
          <LocationBox>
            <LocationText>Destination</LocationText>
          </LocationBox>
        </Marker>

        <Marker coordinate={initorigin} anchor={{x: 0, y: 0}}>
          <LocationBox>
            <LocationTimeBox>
              <LocationTimeText>{duration}</LocationTimeText>
              <LocationTimeTextSmall>MIN</LocationTimeTextSmall>
            </LocationTimeBox>
            <LocationText>ETA</LocationText>
          </LocationBox>
        </Marker>
      </MapView>

      <ScrollView>
        <View style={[styles.footer]}>
          <Text>Location Details</Text>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 20,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Iconviewcomponent
                Icontag={'Fontisto'}
                iconname={'map-marker-alt'}
                icon_size={22}
                icon_color={Color.primary}
              />
              <Text
                style={{
                  fontSize: 16,
                  color: Color.lightBlack,
                  fontFamily: Manrope.SemiBold,
                  paddingStart: 10,
                }}>
                Pickup :
              </Text>
            </View>
            <Text
              style={{
                width: '70%',
                textAlign: 'left',
                fontSize: 16,
                color: Color.black,
                fontFamily: Manrope.Bold,
              }}
              numberOfLines={5}>
              {location?.pickup?.Address}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginTop: 20,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Iconviewcomponent
                Icontag={'Fontisto'}
                iconname={'map-marker-alt'}
                icon_size={22}
                icon_color={Color.primary}
              />
              <Text
                style={{
                  fontSize: 16,
                  color: Color.lightBlack,
                  fontFamily: Manrope.SemiBold,
                  paddingStart: 10,
                }}>
                Drop :
              </Text>
            </View>
            <Text
              style={{
                width: '70%',
                textAlign: 'left',
                fontSize: 16,
                color: Color.black,
                fontFamily: Manrope.Bold,
              }}
              numberOfLines={5}>
              {location?.drop?.Address}
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              marginTop: 30,
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontSize: 16,
                color: Color.lightBlack,
                fontFamily: Manrope.SemiBold,
                marginRight: 10,
              }}>
              Pickup Time
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: Color.black,
                fontFamily: Manrope.Bold,
                marginLeft: 20,
              }}>
              {' '}
              {datetosend} - {time}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              marginTop: 20,
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontSize: 16,
                color: Color.lightBlack,
                fontFamily: Manrope.SemiBold,
                marginRight: 10,
              }}>
              Trip Type
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: Color.black,
                fontFamily: Manrope.Bold,
                marginLeft: 20,
              }}>
              {tripValue}{' '}
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              marginTop: 20,
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                fontSize: 16,
                color: Color.lightBlack,
                fontFamily: Manrope.SemiBold,
                marginRight: 10,
              }}>
              Approximate Fare
            </Text>
            <Text
              style={{
                fontSize: 16,
                color: Color.black,
                fontFamily: Manrope.Bold,
                marginLeft: 20,
              }}>
              Rs {total}{' '}
            </Text>
          </View>

          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              marginTop: 20,
              gap: 20,
              justifyContent: 'space-between',
            }}>
            <View style={styles.button}>
              <TouchableOpacity
                style={styles.signIn}
                onPress={() => {
                  getquote();
                }}>
                <LinearGradient
                  colors={['#85388d', '#85388d']}
                  style={styles.signIn}>
                  <Text
                    style={[
                      styles.textSign,
                      {
                        color: '#fff',
                      },
                    ]}>
                    Enquiry
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <View style={styles.button}>
              <TouchableOpacity
                style={styles.signIn}
                onPress={() => {
                  ConfirmBooking();
                }}>
                <LinearGradient
                  colors={['#85388d', '#85388d']}
                  style={styles.signIn}>
                  <Text
                    style={[
                      styles.textSign,
                      {
                        color: '#fff',
                      },
                    ]}>
                    Book
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          <Modal
            visible={bookingOTPVisible}
            transparent={true}
            animationType="slide">
            <Pressable
              style={{
                flex: 1,
                backgroundColor: '#00000050',
              }}
              onPress={() => {
                setBookingOTPVisible(false);
              }}>
              <View style={{flex: 1}} />
              <View
                style={{
                  backgroundColor: '#fff',
                  padding: 20,
                  paddingVertical: 20,
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    width: '100%',
                    fontSize: 16,
                    color: Color.black,
                    fontFamily: Manrope.Bold,
                  }}>
                  Enter Your Booking OTP
                </Text>
                <OTPInput
                  code={code.toString()}
                  setCode={setCode}
                  setIsPinReady={setIsPinReady}
                  maximumLength={6}
                  inputRef={inputRef}
                />
                <TouchableOpacity
                  onPress={() => {
                    setVerifyOTP();
                  }}
                  style={{
                    width: '80%',
                    height: 45,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: Color.primary,
                    borderRadius: 10,
                  }}>
                  <Text style={styles.confirm}>Submit</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Modal>
        </View>
      </ScrollView>
    </View>
  );
};

export default BookingPreview;

const styles = StyleSheet.create({
  map: {
    height: '38%',
  },
  container: {
    flex: 1,
  },
  header: {
    flex: 1,
    // justifyContent: 'flex-end',
    paddingHorizontal: 0,
    paddingBottom: 2,
  },
  confirm: {
    color: Color.white,
    fontSize: 16,
    textAlign: 'center',
  },
  timestamp: {marginTop: 2},

  markerFixed: {
    left: '50%',
    marginLeft: -24,
    marginTop: -48,
    position: 'absolute',
    top: '25%',
  },
  marker: {
    height: 48,
    width: 48,
  },
  divd: {
    marginTop: 10,
    marginBottom: 10,
  },
  footer: {
    width: Dimensions.get('window').width,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 30,
  },
  region: {
    color: '#000000',
    lineHeight: 20,
    margin: 20,
  },
  text_header: {
    color: '#DB3239',
    fontWeight: 'normal',
    alignContent: 'center',
    textAlign: 'left',
    fontSize: 18,
    marginBottom: 0,
  },

  locationtext: {
    color: '#000000',
    fontSize: 14,
  },
  text_footer: {
    color: '#fff',
    fontSize: 18,
  },
  action: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
  },
  actionError: {
    flexDirection: 'row',
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FF0000',
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 0 : -12,
    paddingLeft: 10,
    color: '#05375a',
  },
  errorMsg: {
    color: '#FF0000',
    fontSize: 14,
  },
  button: {
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 10,
  },
  signIn: {
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.4,
    height: height * 0.05,
    borderRadius: 8,
    backgroundColor: '#DB3239',
    borderColor: '#DB3239',
  },
  textSign: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  podetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 0.5,
    marginTop: 10,
  },
  nextfoot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  billdea: {
    borderTopWidth: 1,
    borderColor: '#E5E5E5',
  },
});
