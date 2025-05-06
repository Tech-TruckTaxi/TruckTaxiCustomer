import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {useSelector} from 'react-redux';
import {selectDestination, selectOrigin} from '../slices/navSlice';
import {P, H5, H4, H2, H6, H3} from '../components/typography';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Button} from '@ui-kitten/components';
import Snackbar from 'react-native-snackbar';
import Color from '../Global/Color';
import {Manrope} from '../Global/FontFamily';
const {width, height} = Dimensions.get('screen');
const OfferScreen = ({navigation, route}) => {
  const origin = useSelector(selectOrigin);
  const destination = useSelector(selectDestination);
  const {selectedvehcilelist} = route.params;
  const {location} = route.params;
  const {tripValue} = route.params;
  const {goodValue} = route.params;
  const {Packagevalue} = route.params;
  const {nightFareType} = route.params;
  const {datetosend} = route.params;
  const {time} = route.params;
  const {tripcount} = route.params;
  const {tripTypeid} = route.params;
  const {packageid} = route.params;
  const {interID} = route.params;
  const {nightID} = route.params;
  const {alternativemobno} = route.params;
  const {Distance} = route.params;
  const {iscv} = route.params;
  const [showLoading, setshowLoading] = useState(false);
  const [amount, setamount] = useState('');
  const [peakfare, setpeakfare] = useState('');
  const [couponapplied, setcouponapplied] = useState(false);
  const [couponcode, setcouponcode] = useState('');
  const [total, settotal] = useState('');

  const [interfare, setinterfare] = useState('');

  useEffect(() => {
    reload();
  }, [
    tripValue,
    Packagevalue,
    selectedvehcilelist,
    tripcount,
    datetosend,
    origin,
    destination,
    nightFareType,
  ]);

  useEffect(() => {
    navigation.setOptions({
      title: <Text>Booking Information</Text>,
      headerRight: () => (
        <View style={{flexDirection: 'row'}}>
          <FontAwesome
            style={{padding: 10}}
            onPress={() => {
              home();
            }}
            name="home"
            size={25}
            backgroundColor="#ffffff"
            color="#85388d"
          />
        </View>
      ),
    });
  }, []);

  const handleremove = () => {
    Snackbar.show({
      text: 'Coupon Removed',
      duration: Snackbar.LENGTH_SHORT,
      backgroundColor: '#DB3239',
    });
    setcouponcode('Enter Coupon Code');
    setcouponapplied(false);
  };

  const reload = () => {
    setshowLoading(true);
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

        if (tripValue == 'Meter Fare') {
          console.log('Meter Fare', Distance);

          fetch(
            'https://trucktaxi.co.in/api/customer/getmeterfare?distance=' +
              Distance?.distance +
              '&cityid=' +
              parseddata.cityid +
              '&vehicleid=' +
              selectedvehcilelist.id,
            requestOptions,
          )
            .then(response => response.json())
            .then(meterfare => {
              console.log('gggggggggggggggggggg', meterfare);

              var charge = parseFloat(meterfare.data[0].approximatefare);
              setamount(charge);
              fetch(
                'https://trucktaxi.co.in/api/customer/getadditionalfare?pickuptime=' +
                  time +
                  '&fare=' +
                  charge,
                requestOptions,
              )
                .then(response => response.json())
                .then(additionafate => {
                  var addtionalcharges =
                    parseFloat(additionafate.approxmatefare) -
                    parseFloat(charge);
                  var total = addtionalcharges + parseFloat(charge);
                  settotal(total);
                  setpeakfare(addtionalcharges);
                })
                .catch(error => console.log('error', error));
            });
        } else if (tripValue == 'Package Fare') {
          console.log('Package Farewwwwwwwwwwwwwwww', Packagevalue);

          var basefare = parseFloat(Packagevalue.basefare);
          var basekm = parseFloat(Packagevalue.basekm);

          fetch(
            'https://trucktaxi.co.in/api/customer/getfareforpackage?distance=' +
              Distance?.distance +
              '&basefare=' +
              basefare +
              '&basekm=' +
              basekm +
              '&addkmcharge=18',
            requestOptions,
          )
            .then(response => response.json())
            .then(packagefare => {
              var charge = parseFloat(packagefare.data[0].approximatefare);
              setamount(charge);
              fetch(
                'https://trucktaxi.co.in/api/customer/getadditionalfare?pickuptime=' +
                  time +
                  '&fare=' +
                  charge,
                requestOptions,
              )
                .then(response => response.json())
                .then(additionafate => {
                  var addtionalcharges =
                    parseFloat(additionafate.approxmatefare) -
                    parseFloat(charge);
                  var total = addtionalcharges + parseFloat(charge);
                  settotal(total);
                  setpeakfare(addtionalcharges);
                })
                .catch(error => console.log('error', error));
            });
        } else if (tripValue == 'Intercity Fare') {
          console.log('selectedFarevalue==>Intercity');

          fetch(
            'https://trucktaxi.co.in/api/customer/getinterbaseamount?distance=' +
              Distance?.distance +
              '&vehicletype=' +
              selectedvehcilelist.id,
            requestOptions,
          )
            .then(response => response.json())
            .then(result => {
              var charge = parseFloat(result.data[0].basefare);
              console.log('Interbase ----------------------', charge);

              setamount(charge);

              fetch(
                'https://trucktaxi.co.in/api/customer/getadditionalfare?pickuptime=' +
                  time +
                  '&fare=' +
                  charge,
                requestOptions,
              )
                .then(response => response.json())
                .then(additionafate => {
                  console.log('intercity add -------', additionafate);

                  var addtionalcharges =
                    parseFloat(additionafate.approxmatefare) -
                    parseFloat(charge);
                  var total = addtionalcharges + parseFloat(charge);
                  settotal(total);
                  setpeakfare(addtionalcharges);
                })
                .catch(error => console.log('error', error));
            });
        } else if (tripValue == 'Night Fare') {
          var nightbasefare = parseFloat(nightFareType.basefare);
          var nightbasekm = parseFloat(nightFareType.basekm);
          var nightAddKMCharge = parseFloat(nightFareType.AddKMCharge);
          fetch(
            'https://trucktaxi.co.in/api/customer/getfarefornight?vehicleid=' +
              selectedvehcilelist.id +
              '&cityid=' +
              parseddata.cityid +
              '&distance=' +
              destination?.distance +
              '&basefare=' +
              nightbasefare +
              '&basekm=' +
              nightbasekm +
              '&addkmcharge=' +
              nightAddKMCharge,
            requestOptions,
          )
            .then(response => response.json())
            .then(intercitylist => {
              var distance = parseFloat(Distance?.distance);
              var list = [];
              list = intercitylist.data;

              var closest = list.reduce((a, b) => {
                return Math.abs(b.basekm - distance) <
                  Math.abs(a.basekm - distance)
                  ? b
                  : a;
              });
              let intfare =
                closest.basekm +
                '-' +
                closest.basefare +
                '-' +
                closest.baseminute;
              setinterfare(intfare);
              var charge = parseFloat(closest.basefare);
              setamount(charge);

              fetch(
                'https://trucktaxi.co.in/api/customer/getadditionalfare?pickuptime=' +
                  time +
                  '&fare=' +
                  charge,
                requestOptions,
              )
                .then(response => response.json())
                .then(additionafate => {
                  console.log('night add', additionafate);

                  var addtionalcharges =
                    parseFloat(additionafate.approxmatefare) -
                    parseFloat(charge);
                  var total = addtionalcharges + parseFloat(charge);
                  settotal(total);
                  setpeakfare(addtionalcharges);
                })
                .catch(error => console.log('error', error));
            });
        }
      });
    });
  };

  const home = () => {
    navigation.navigate('Home');
  };

  const handleValidUser = val => {
    setcouponcode(val);
  };

  const booknow = () => {
    navigation.navigate('bookpreview', {
      selectedvehcilelist: selectedvehcilelist,
      location: location,
      tripValue: tripValue,
      goodValue: goodValue,
      packageid: packageid,
      interID: interID,
      nightID: nightID,
      Packagevalue: Packagevalue,
      time: time,
      distance: Distance,
      interfare:
        tripValue == 'Intercity Fare' ? selectedvehcilelist?.estimatedFare : '',
      datetosend: datetosend,
      tripTypeid: tripTypeid,
      tripcount: tripcount,
      peakfare: peakfare,
      iscv: iscv,
      total: selectedvehcilelist?.estimatedFare,
      alternativemobno: alternativemobno,
      nightFareType: nightFareType,
    });
  };

  const couponhandle = () => {
    if (couponcode == '' || couponcode == undefined || couponcode == null) {
      Snackbar.show({
        text: 'Enter Valid Coupon Code',
        duration: Snackbar.LENGTH_SHORT,
        backgroundColor: '#DB3239',
      });
    } else {
      AsyncStorage.getItem('userdata').then(userdata => {
        AsyncStorage.getItem('userToken').then(value => {
          let parseddata = JSON.parse(userdata);
          var myHeaders = new Headers();
          myHeaders.append('Authorization', 'Bearer ' + value);
          myHeaders.append('Content-Type', 'application/json');

          console.log(parseFloat(parseddata.customerid), 'ppppppppppppppppppp');

          var raw = JSON.stringify({
            offercode: couponcode,
            fare: amount,
          });

          var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow',
          };

          fetch(
            'https://trucktaxi.co.in/api/customer/applyCoupon',
            requestOptions,
          )
            .then(response => response.json())
            .then(result => {
              console.log('Coupon resp============:', result);
              if (result?.message == 'Invalid Offer Id please check!.') {
                Snackbar.show({
                  text: result?.message,
                  duration: Snackbar.LENGTH_SHORT,
                  backgroundColor: '#DB3239',
                });
              } else {
                setcouponapplied(true);
                Snackbar.show({
                  text: 'Coupon Code Applied',
                  duration: Snackbar.LENGTH_SHORT,
                  backgroundColor: 'green',
                });
              }
            })
            .catch(error => {
              Snackbar.show({
                text: 'Invalid Coupon',
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: '#DB3239',
              });
            });
        });
      });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.boxone}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
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
                Regular Charges
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: Color.black,
                  fontFamily: Manrope.Bold,
                  marginLeft: 20,
                }}>
                {`Rs : ${selectedvehcilelist?.estimatedFare}`}
              </Text>
            </View>

            <View
              style={{
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
                {`Rs : ${selectedvehcilelist?.estimatedFare}`}
              </Text>
            </View>
          </View>

          <View style={styles.boxone}>
            {couponapplied ? (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  margin: 10,
                }}>
                <View>
                  <View style={styles.actioncheckou}>
                    <H3>{couponcode}</H3>
                  </View>
                </View>
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      handleremove();
                    }}>
                    <H5
                      style={{
                        fontSize: 14,
                        color: '#DB3239',
                        paddingLeft: 10,
                        paddingRight: 10,
                        marginTop: 10,
                      }}>
                      Remove
                    </H5>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginLeft: 10,
                  marginTop: 10,
                  marginRight: 10,
                }}>
                <View style={{backgroundColor: '#fff'}}>
                  <View style={styles.action}>
                    <TextInput
                      placeholder="Enter Coupon Code"
                      placeholderTextColor="#666666"
                      style={[styles.textInput]}
                      autoCapitalize="none"
                      onChangeText={val => handleValidUser(val)}
                      onEndEditing={e => handleValidUser(e.nativeEvent.text)}
                    />
                  </View>
                </View>
                <View>
                  <Button
                    style={{backgroundColor: '#85388d', borderColor: '#DB3239'}}
                    onPress={() => {
                      couponhandle();
                    }}>
                    <Text style={{color: '#fff'}}>Apply</Text>
                  </Button>
                </View>
              </View>
            )}
          </View>

          <View
            style={{
              flex: 1,
              width: '95%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{width: '100%', alignItems: 'center', marginVertical: 30}}>
              <TouchableOpacity
                style={{
                  width: '100%',
                  height: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: Color.primary,
                  borderRadius: 10,
                }}
                onPress={() => {
                  booknow();
                }}>
                <Text style={{fontSize: 16, color: Color.white}}>Continue </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default OfferScreen;

const styles = StyleSheet.create({
  container: {
    width: width,
    flex: 1,
    alignItems: 'center',
  },
  action: {
    flexDirection: 'row',
    borderWidth: 1,
    width: '90%',
    height: 46,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxone: {
    width: '100%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginTop: 20,
    margin: 10,
  },
  nextfoot: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 0.5,
    paddingHorizontal: 16,
  },
  text: {
    marginTop: 5,
    marginLeft: 24,
  },
  textInput: {
    fontSize: 14,
    paddingLeft: 10,
    color: '#05375a',
  },
  signIn: {
    width: '95%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#DB3239',
    borderColor: '#DB3239',
  },
});
