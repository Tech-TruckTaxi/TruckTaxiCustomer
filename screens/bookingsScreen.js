import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Linking,
  LogBox,
  Modal,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icon1 from 'react-native-vector-icons/FontAwesome5';
import Icon2 from 'react-native-vector-icons/FontAwesome6';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Radio from 'react-native-vector-icons/Fontisto';
import StepIndicator from 'react-native-step-indicator';
import StarRating from 'react-native-star-rating-widget';
import {useSelector} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import Color from '../Global/Color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Manrope} from '../Global/FontFamily';

LogBox.ignoreAllLogs();

const Upcoming = ({
  Data,
  navigation,
  index,
  setModel,
  currentStatus,
  customStyles,
  // currentStatus,
  handleButtonPress,
  token,
  customerid,
}) => {
  const [bookingData, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setBookingData();
  }, [token]);

  const setBookingData = async () => {
    try {
      setLoading(true);
      AsyncStorage.getItem('user').then(mobile => {
        AsyncStorage.getItem('userToken').then(value => {
          var myHeaders = new Headers();
          myHeaders.append('Authorization', 'Bearer ' + value);

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
              console.log(id, 'pppp');

              fetch(
                'https://trucktaxi.co.in/api/customer/getmybookings?customerid=' +
                  id +
                  '&type=Upcoming',
                requestOptions,
              )
                .then(response => response.json())
                .then(result => {
                  console.log('LIVEEEEEEEEEEEEEEEEEEEE', result.data);
                  const sortedData = result?.data?.sort((a, b) => {
                    const dateA = new Date(a.bookedtime);
                    const dateB = new Date(b.bookedtime);
                    return dateB - dateA;
                  });
                  setData(sortedData);
                  console.log('bookingData', sortedData);

                  setLoading(false);
                })
                .catch(error => console.log('error', error));
            })
            .catch(error => console.log('error', error));
        });
      });
    } catch (error) {
      console.log('error', error);
    }
  };

  const onRefresh = () => {
    //set isRefreshing to true
    setIsRefreshing(true);
    setBookingData();
    // and set isRefreshing to false at the end of your callApiMethod()
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Color.white}}>
      {!loading ? (
        <FlatList
          // data={bookingData}
          data={bookingData.filter(
            item =>
              item?.statuscode === 2 ||
              item?.statuscode === 6 ||
              item?.statuscode === 9,
          )}
          renderItem={({item, index}) => {
            console.log('====================================');
            console.log('rr', item);
            console.log('====================================');
            if (
              item?.statuscode != 2 &&
              item?.statuscode != 6 &&
              item?.statuscode !== 9
            ) {
              return null;
            }
            return (
              // <View key={index} style={styles.container}>
              //   <View style={styles.container1}>
              //     <View style={styles.container2}>
              //       <Text style={styles.type}>ID :</Text>
              //       <Text style={styles.type}>Vehicle :</Text>
              //       <Text style={styles.type}>Goods Details:</Text>
              //       <Text style={styles.type}>Pickup :</Text>
              //       <Text style={styles.type}>Drop :</Text>
              //     </View>
              //     <View style={styles.container2}>
              //       <Text style={styles.value}>{item?.id}</Text>
              //       <Text style={styles.value}>{item?.vehicletype}</Text>
              //       <Text style={styles.value}>{item?.goods}</Text>
              //       <View style={styles.container3}>
              //         <Icon2
              //           name="location-dot"
              //           size={13}
              //           color="#000"
              //           style={{marginTop: 10}}
              //         />
              //         <Text style={styles.value} numberOfLines={1}>
              //           {item?.fromloc}
              //         </Text>
              //       </View>
              //       <View style={styles.container3}>
              //         <Icon2
              //           name="location-dot"
              //           size={13}
              //           color="#000"
              //           style={{marginTop: 10}}
              //         />
              //         <Text style={styles.value} numberOfLines={1}>
              //           {item?.toloc}
              //         </Text>
              //       </View>
              //     </View>
              //   </View>
              //   <View style={styles.line} />
              //   <Text style={styles.type}>Status:</Text>
              //   <StepIndicator
              //     customStyles={customStyles}
              //     currentPosition={
              //       item?.statuscode == 2 ? 1 : item?.statuscode == 6 ? 2 : 0
              //     }
              //     stepCount={2}
              //     labels={['Booked', 'Vehicle on the way']}
              //   />
              //   <View style={styles.buttonView}>
              //     <TouchableOpacity onPress={() => setModel(true)}>
              //       <Text style={styles.help}>Need Help ?</Text>
              //     </TouchableOpacity>
              //     <TouchableOpacity
              //       onPress={() => {
              //         handleButtonPress({
              //           from: {
              //             latitude: item?.fromloclat,
              //             longitude: item?.fromloclong,
              //           },
              //           to: {
              //             latitude: item?.toloclat,
              //             longitude: item?.toloclong,
              //           },
              //           item,
              //         });
              //       }}>
              //       <Text style={styles.track}>
              //         {currentStatus == 0
              //           ? 'Details'
              //           : currentStatus == 1
              //           ? 'Track'
              //           : currentStatus == 2
              //           ? 'Pay'
              //           : currentStatus == 3
              //           ? 'Review'
              //           : 'Completed'}
              //       </Text>
              //     </TouchableOpacity>
              //   </View>
              // </View>

              <View
                style={{
                  margin: 20,
                  padding: 20,
                  backgroundColor: Color?.white,
                  borderWidth: 1,
                  borderColor: '#EEEEEE',
                  borderRadius: 5,
                  gap: 10,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      color: '#333333',
                      fontSize: 15,
                      fontFamily: Manrope?.Regular,
                    }}>
                    {`ID : ${item?.id}`}{' '}
                  </Text>
                  <Text
                    style={{
                      color: Color?.black,
                      fontFamily: Manrope?.Regular,
                      fontSize: 14,
                    }}>
                    {item?.bookedtime}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      color: Color?.black,
                      fontSize: 15,
                      fontFamily: Manrope?.Regular,
                    }}>
                    Vehcile :
                  </Text>
                  <Text
                    style={{
                      color: Color?.black,
                      fontSize: 12,
                      fontFamily: Manrope?.Medium,
                    }}>
                    {item?.vehicletype}
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      color: Color?.primary,
                      fontSize: 16,
                      fontFamily: Manrope?.SemiBold,
                    }}>
                    Location Details
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      color: '#333333',
                      fontSize: 15,
                      fontFamily: Manrope?.Regular,
                    }}>
                    Pickup :
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 3,
                    }}>
                    <Icon2 name="location-dot" size={13} color="#000" />
                    <Text
                      style={{
                        color: Color?.black,
                        fontFamily: Manrope?.Regular,
                        fontSize: 14,
                      }}>
                      {item?.fromloc?.length > 20
                        ? `${item?.fromloc?.substring(0, 20)}...`
                        : item?.fromloc}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      color: '#333333',
                      fontSize: 15,
                      fontFamily: Manrope?.Regular,
                    }}>
                    Drop :
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 3,
                    }}>
                    <Icon2 name="location-dot" size={13} color="#000" />
                    <Text
                      style={{
                        color: Color?.black,
                        fontFamily: Manrope?.Regular,
                        fontSize: 14,
                      }}>
                      {item?.toloc?.length > 20
                        ? `${item?.toloc?.substring(0, 20)}...`
                        : item?.toloc}
                    </Text>
                  </View>
                </View>
                <View style={styles.line} />

                {item?.statuscode == 6 ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        fontSize: 15,
                        color: '#333333',
                        fontFamily: Manrope?.Regular,
                      }}>
                      Status
                    </Text>
                    <View
                      style={{
                        backgroundColor: '#F0B504',
                        borderRadius: 129,
                        width: width / 4.85,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          color: Color?.white,
                          fontSize: 13,
                          fontFamily: Manrope?.Medium,
                        }}>
                        Enquired
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View style={{gap: 10}}>
                    <Text
                      style={{
                        color: Color?.primary,
                        fontSize: 16,
                        fontFamily: Manrope?.SemiBold,
                      }}>
                      Status
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <View style={{width: width / 2}}>
                        <StepIndicator
                          customStyles={customStyles}
                          currentPosition={item?.statuscode == 2 ? 1 : 0}
                          stepCount={2}
                          labels={['Booked', 'Vehicle on the way']}
                        />
                      </View>
                      <View
                        style={{
                          backgroundColor: '#884190',
                          width: width / 3.8,
                          height: height / 20,
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderRadius: 5,
                        }}>
                        <Text
                          style={{
                            color: Color?.white,
                            fontFamily: Manrope?.Medium,
                            fontSize: 14,
                          }}>
                          Track Now
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            );
          }}
          ListEmptyComponent={() => (
            <View
              style={{
                height: height * 0.8,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: Manrope?.Regular,
                  color: '#884190',
                }}>
                No Upcoming Bookings
              </Text>
            </View>
          )}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              // refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor="#F8852D"
            />
          }
        />
      ) : (
        // <View>
        //   <Text>Liveeeeeeeeeeeeeee</Text>
        // </View>
        <View style={styles.load}>
          <ActivityIndicator size="large" color={Color.primary} />
        </View>
      )}
    </SafeAreaView>
  );
};

const Completed = ({
  Data,
  navigation,
  index,
  setModel,
  currentStatus,
  customStyles,
  labels,
  handleButtonPress,
  token,
  customerid,
}) => {
  const [bookingData, setData] = useState([]);
  const Token = useSelector(state => state.token);

  useEffect(() => {
    setBookingData();
  }, [token]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const setBookingData = async () => {
    try {
      setLoading(true);
      AsyncStorage.getItem('user').then(mobile => {
        AsyncStorage.getItem('userToken').then(value => {
          var myHeaders = new Headers();
          myHeaders.append('Authorization', 'Bearer ' + value);

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
              const valueeee =
                'https://trucktaxi.co.in/api/customer/getmybookings?customerid=' +
                id +
                '&type=Completed';
              console.log('valueeee', valueeee);

              fetch(
                'https://trucktaxi.co.in/api/customer/getmybookings?customerid=' +
                  id +
                  '&type=Completed',
                requestOptions,
              )
                .then(response => response.json())
                .then(result => {
                  // console.log('resultsssssssssss', result?.data);
                  if (result?.message == 'Records Not found') {
                    console.log('no Records ');
                  } else {
                    setData(result.data);
                  }
                  setLoading(false);
                })
                .catch(error => console.log('error', error));
            })
            .catch(error => console.log('error', error));
        });
      });
    } catch (error) {
      console.log('error', error);
    }
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    setBookingData();
  };

  const getinvoice = data => {
    try {
      console.log(':dddddddddddd', data);

      AsyncStorage.getItem('userToken').then(value => {
        console.log('tokennnn', value);
        const myHeaders = new Headers();
        myHeaders.append('Authorization', `Bearer ${value}`);
        const requestOptions = {
          method: 'GET',
          headers: myHeaders,
          redirect: 'follow',
        };
        fetch(
          `https://trucktaxi.co.in/api/customer/getinvoice?bookingid=${data?.id}`,
          requestOptions,
        )
          .then(response => response.json())
          .then(async result => {
            if (result?.status === 200) {
              const invoiceUrl = result.data[0].Invoiceurl;
              console.log('invoice================ : ', invoiceUrl);
              Linking.openURL(invoiceUrl);
            }
          })
          .catch(error => console.error('catch in getinvoice_api:', error));
      });
    } catch (error) {
      console.log('CATCH IN GETINVOICE', error);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Color.white}}>
      {!loading ? (
        <FlatList
          data={bookingData.filter(
            item => item?.statuscode === 3 || item?.statuscode === 5,
          )}
          renderItem={({item, index}) => {
            if (item?.statuscode !== 3 && item?.statuscode !== 5) {
              return null;
            }
            return (
              <View
                style={{
                  margin: 20,
                  padding: 20,
                  backgroundColor: Color?.white,
                  borderWidth: 1,
                  borderColor: '#EEEEEE',
                  borderRadius: 5,
                  gap: 10,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      color: '#333333',
                      fontSize: 15,
                      fontFamily: Manrope?.Regular,
                    }}>
                    {`ID : ${item?.id}`}{' '}
                  </Text>
                  <Text
                    style={{
                      color: Color?.black,
                      fontFamily: Manrope?.Regular,
                      fontSize: 14,
                    }}>
                    {item?.bookedtime}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      color: Color?.black,
                      fontSize: 15,
                      fontFamily: Manrope?.Regular,
                    }}>
                    Vehcile :
                  </Text>
                  <Text
                    style={{
                      color: Color?.black,
                      fontSize: 12,
                      fontFamily: Manrope?.Medium,
                    }}>
                    {item?.vehicletype}
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      color: Color?.primary,
                      fontSize: 16,
                      fontFamily: Manrope?.SemiBold,
                    }}>
                    Location Details
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      color: '#333333',
                      fontSize: 15,
                      fontFamily: Manrope?.Regular,
                    }}>
                    Pickup :
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 3,
                    }}>
                    <Icon2 name="location-dot" size={13} color="#000" />
                    <Text
                      style={{
                        color: Color?.black,
                        fontFamily: Manrope?.Regular,
                        fontSize: 14,
                      }}>
                      {item?.fromloc?.length > 20
                        ? `${item?.fromloc?.substring(0, 20)}...`
                        : item?.fromloc}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      color: '#333333',
                      fontSize: 15,
                      fontFamily: Manrope?.Regular,
                    }}>
                    Drop :
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 3,
                    }}>
                    <Icon2 name="location-dot" size={13} color="#000" />
                    <Text
                      style={{
                        color: Color?.black,
                        fontFamily: Manrope?.Regular,
                        fontSize: 14,
                      }}>
                      {item?.toloc?.length > 20
                        ? `${item?.toloc?.substring(0, 20)}...`
                        : item?.toloc}
                    </Text>
                  </View>
                </View>
                <View style={styles.line} />

                {item?.statuscode == 5 ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        fontSize: 15,
                        color: '#333333',
                        fontFamily: Manrope?.Regular,
                      }}>
                      Status
                    </Text>
                    <View
                      style={{
                        backgroundColor: '#DC3545',
                        borderRadius: 129,
                        width: width / 4.85,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          color: Color?.white,
                          fontSize: 13,
                          fontFamily: Manrope?.Medium,
                        }}>
                        Cancelled
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}>
                      <Text
                        style={{
                          fontSize: 15,
                          color: '#333333',
                          fontFamily: Manrope?.Regular,
                        }}>
                        Status
                      </Text>
                      <View
                        style={{
                          backgroundColor: '#27AE60',
                          borderRadius: 129,
                          width: width / 4.66,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            color: Color?.white,
                            fontSize: 13,
                            fontFamily: Manrope?.Medium,
                          }}>
                          Completed
                        </Text>
                      </View>
                    </View>
                    <View style={styles.line} />
                    <TouchableOpacity
                      style={{
                        backgroundColor: Color?.primary,
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 10,
                        borderRadius: 5,
                      }}
                      onPress={() => {
                        getinvoice(item);
                      }}>
                      <View
                        style={{
                          alignItems: 'center',
                          gap: 5,
                          flexDirection: 'row',
                          justifyContent: 'center',
                        }}>
                        <Ionicons
                          name="cloud-download-outline"
                          size={13}
                          color="#fff"
                        />
                        <Text
                          style={{
                            fontSize: 14,
                            color: Color?.white,
                            fontFamily: Manrope?.Medium,
                          }}>
                          Download Invoice
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            );
          }}
          ListEmptyComponent={() => (
            <View
              style={{
                height: height * 0.8,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: Manrope?.Regular,
                  color: '#884190',
                }}>
                No Trip History
              </Text>
            </View>
          )}
          refreshControl={
            <RefreshControl onRefresh={onRefresh} tintColor="#F8852D" />
          }
        />
      ) : (
        <View style={styles.load}>
          <ActivityIndicator size="large" color={Color.primary} />
        </View>
      )}
    </SafeAreaView>
  );
};

const BookingScreen = ({route, navigation}) => {
  const [date, setDate] = useState('');
  const token = useSelector(state => state.token);
  const mobileNumber = useSelector(state => state.mobileNumber);
  const [time, setTime] = useState('');
  const [pickAddress, setPickAddress] = useState('');
  const [dropAddress, setDropAddress] = useState('');
  const [vehicle, setVehicle] = useState('');

  const [model, setModel] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(1);
  const [detailsModal, setDetailsModal] = useState(false);
  const [paymentView, setPaymentView] = useState(false);
  const [reviewModal, setReviewModal] = useState(false);
  const [payCash, setPayCash] = useState(false);
  const [payOnline, setPayOnline] = useState(false);
  const [rating, setRating] = useState(0);
  const [customerid, setCustomerId] = useState('');
  const [Data, setData] = useState([]);
  const [index, setIndex] = React.useState(0);

  const [loading, setLoading] = useState(true);
  const [routes] = React.useState([
    {key: 'upcoming', title: 'UpComing'},
    {key: 'completed', title: 'Trip History'},
  ]);

  useEffect(() => {
    fetchCustomerDetails();
  }, [token]);

  const fetchCustomerDetails = async () => {
    try {
      setLoading(true);
      const myHeaders = new Headers();
      myHeaders.append('Authorization', 'Bearer ' + token);

      const requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
      };

      fetch(
        `https://trucktaxi.co.in/api/customer/getprofiledetails?mobileno=+91${mobileNumber}`,
        requestOptions,
      )
        .then(response => response.json())
        .then(result => {
          setCustomerId(result?.data?.[0]?.customerid);
          setLoading(false);
        })
        .catch(error => console.error(error));
    } catch (error) {
      console.error('Error fetching customer details:', error);
    }
  };
  console.log('customerid', customerid);
  useEffect(() => {
    try {
      setDate(route.params.datetosend);
      setTime(route.params.time);
      setPickAddress(route.params.address.pickup);
      setDropAddress(route.params.address.drop);
      setVehicle(route.params.selectedvehcilelist);
    } catch (error) {
      console.log('catch in use_Effect mybooking:', error);
    }
  }, []);

  const labels = ['Booked', 'Vehicle on the way', 'Enquiry'];

  const customStyles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize: 30,
    separatorStrokeWidth: 3,
    currentStepStrokeWidth: 5,
    stepStrokeCurrentColor: Color.Green,
    stepStrokeWidth: 2,
    stepStrokeFinishedColor: Color.Green,
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorFinishedColor: Color.Green,
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: Color.Green,
    stepIndicatorUnFinishedColor: '#aaaaaa',
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: 0,
    currentStepIndicatorLabelFontSize: 0,
    stepIndicatorLabelCurrentColor: Color.Green,
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#aaaaaa',
    labelColor: '#999999',
    labelSize: 10,
    labelAlign: 'center',
    currentStepLabelColor: Color.Green,
  };

  const handleButtonPress = item => {
    console.log('item', item);
    if (currentStatus == 0) {
      setDetailsModal(true);
    } else if (currentStatus == 1) {
      navigation.navigate('Track', {item});
    } else if (currentStatus == 2) {
      setPaymentView(true);
    } else if (currentStatus == 3) {
      setReviewModal(true);
    }
  };

  const selectPayment = value => {
    if (value == 'payCash') {
      setPayCash(true);
      setPayOnline(false);
    } else if (value == 'payOnline') {
      setPayOnline(true);
      setPayCash(false);
    }
  };

  const layout = useWindowDimensions();

  const renderScene = SceneMap({
    upcoming: () => (
      <Upcoming
        Data={Data}
        index={index}
        navigation={navigation}
        setModel={setModel}
        currentStatus={currentStatus}
        customStyles={customStyles}
        labels={labels}
        handleButtonPress={handleButtonPress}
        token={token}
        customerid={customerid}
      />
    ),
    completed: () => (
      <Completed
        Data={Data}
        index={index}
        navigation={navigation}
        setModel={setModel}
        currentStatus={currentStatus}
        customStyles={customStyles}
        labels={labels}
        handleButtonPress={handleButtonPress}
        token={token}
        customerid={customerid}
      />
    ),
  });

  return (
    <>
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{width: layout.width}}
        renderTabBar={props => (
          <TabBar
            {...props}
            style={{backgroundColor: Color.white, height: 60}}
            indicatorStyle={{backgroundColor: Color.primary, height: '100%'}}
            renderLabel={({route, focused}) => (
              <Text
                style={{
                  color: !focused ? Color.black : '#FFFFFF',
                  fontSize: 18,
                  fontFamily: 'Poppins-Bold',
                  textTransform: 'capitalize',
                }}>
                {route.title}
              </Text>
            )}
          />
        )}
      />

      {/* Help modal */}
      <Modal visible={model} onRequestClose={() => setModel(false)} transparent>
        <View style={styles.modelBg}>
          <View style={styles.modal}>
            <View style={styles.modalHeaderView}>
              <Text style={styles.modalHeader}>Need Help</Text>
              <TouchableOpacity onPress={() => setModel(false)}>
                <Icon name="window-close" size={25} color="#000" />
              </TouchableOpacity>
            </View>
            <View style={styles.modalView}>
              <Icon1 name="handshake" size={125} color={Color.litePrimaryBg} />
              <TouchableOpacity onPress={() => navigation.navigate('chat')}>
                <Text style={styles.chat}>Chat Support</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('cancel', {id: '0'})}>
                <Text style={styles.cancelBooking}>Cancel Booking</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        visible={paymentView}
        onRequestClose={() => setPaymentView(false)}
        transparent>
        <View style={styles.modelBg}>
          <View style={styles.payment}>
            <Text style={styles.paymentHeader}>Select Payment</Text>
            <View style={styles.paymentView}>
              <TouchableOpacity
                style={styles.paymentView2}
                onPress={() => selectPayment('payCash')}>
                <Text style={styles.paymentText}>Pay in Cash</Text>
                {payCash ? (
                  <Icon name="check-circle" size={23} color={Color.Green} />
                ) : (
                  <Radio
                    name="radio-btn-passive"
                    size={20}
                    color={Color.shadow}
                  />
                )}
              </TouchableOpacity>
              <View style={styles.line} />
              <TouchableOpacity
                style={styles.paymentView2}
                onPress={() => selectPayment('payOnline')}>
                <Text style={styles.paymentText}>Online Payment</Text>
                {payOnline ? (
                  <Icon name="check-circle" size={23} color={Color.Green} />
                ) : (
                  <Radio
                    name="radio-btn-passive"
                    size={20}
                    color={Color.shadow}
                  />
                )}
              </TouchableOpacity>
            </View>
            <View style={styles.buttonView}>
              <TouchableOpacity onPress={() => setPaymentView(false)}>
                <Text style={styles.cancel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Text style={styles.submit}>Sumbit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Review Modal */}
      <Modal
        visible={reviewModal}
        onRequestClose={() => setReviewModal(false)}
        transparent>
        <View style={styles.modelBg}>
          <View style={styles.reviewModal}>
            <Text style={styles.reviewHeader}>
              Your feedback helps us to improve our service
            </Text>
            <Text style={styles.reviewText}>
              How was your booking experience
            </Text>
            <StarRating
              color={Color.primary}
              style={styles.starComponent}
              rating={rating}
              onChange={setRating}
            />
            <Text style={styles.reviewText}>How could we improve ?</Text>
            <TextInput
              style={styles.reviewInput}
              multiline={true}
              rows={3}
              maxLength={100}
            />
            <TouchableOpacity>
              <Text style={styles.submit}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default BookingScreen;

const {width, height} = Dimensions.get('screen');

const styles = StyleSheet.create({
  headerView: {
    flexDirection: 'row',
  },
  upcoming: {
    color: Color.black,
    backgroundColor: Color.litePrimaryBg,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.17,
  },
  completed: {
    color: Color.black,
    backgroundColor: Color.steel,
    paddingVertical: height * 0.02,
    paddingHorizontal: width * 0.17,
  },
  container: {
    padding: 10,
    margin: 10,
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Color.black3,
  },
  container1: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  container2: {
    flex: 1,
  },
  container3: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  type: {
    color: Color.shadow,
    fontSize: 13,
    marginTop: 10,
  },
  value: {
    color: Color.shadow,
    color: Color.black2,
    fontSize: 13,
    fontWeight: '500',
    marginTop: 10,
  },
  line: {
    marginVertical: height * 0.02,
    borderBottomColor: '#cccccc',
    borderBottomWidth: 1,
    width: '100%',
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: height * 0.01,
  },
  help: {
    color: Color.black2,
    backgroundColor: Color.steel,
    paddingHorizontal: width * 0.08,
    paddingVertical: height * 0.008,
    borderRadius: width * 0.01,
  },
  track: {
    color: Color.white,
    backgroundColor: Color.primary,
    paddingHorizontal: width * 0.13,
    paddingVertical: height * 0.008,
    borderRadius: width * 0.01,
  },
  modelBg: {
    flex: 1,
    backgroundColor: Color.black3,
  },
  modal: {
    backgroundColor: Color.white,
    justifyContent: 'center',
    padding: width * 0.04,
    marginTop: height * 0.25,
    marginHorizontal: width * 0.15,
    borderRadius: width * 0.02,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeaderView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalHeader: {
    color: Color.black3,
    fontSize: 20,
    fontWeight: '700',
  },
  modalView: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: height * 0.01,
    gap: height * 0.02,
  },
  chat: {
    color: Color.white,
    fontSize: 18,
    fontWeight: '500',
    backgroundColor: Color.primary,
    paddingHorizontal: width * 0.12,
    paddingVertical: height * 0.01,
    borderRadius: width * 0.015,
  },
  cancelBooking: {
    color: Color.black,
    fontSize: 18,
    fontWeight: '500',
    backgroundColor: Color.steel,
    paddingHorizontal: width * 0.1,
    paddingVertical: height * 0.01,
    borderRadius: width * 0.015,
  },

  payment: {
    backgroundColor: Color.white,
    justifyContent: 'center',
    padding: width * 0.04,
    paddingVertical: height * 0.04,
    marginTop: height * 0.25,
    marginHorizontal: width * 0.08,
    borderRadius: width * 0.02,
    gap: height * 0.02,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  paymentHeader: {
    color: Color.black,
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: height * 0.01,
  },
  paymentView: {
    borderWidth: 1,
    padding: width * 0.04,
    borderRadius: width * 0.02,
  },
  paymentView2: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentText: {
    color: Color.black,
    fontSize: 16,
    fontWeight: '500',
  },
  submit: {
    color: Color.white,
    fontSize: 18,
    backgroundColor: Color.primary,
    alignSelf: 'center',
    paddingHorizontal: width * 0.06,
    paddingVertical: height * 0.01,
    borderRadius: width * 0.01,
    marginTop: height * 0.02,
  },
  cancel: {
    color: Color.black,
    fontSize: 18,
    backgroundColor: Color.steel,
    alignSelf: 'center',
    paddingHorizontal: width * 0.06,
    paddingVertical: height * 0.01,
    borderRadius: width * 0.01,
    marginTop: height * 0.02,
  },
  reviewModal: {
    backgroundColor: Color.white,
    justifyContent: 'center',
    padding: width * 0.06,
    marginTop: height * 0.22,
    marginHorizontal: width * 0.1,
    borderRadius: width * 0.02,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  reviewHeader: {
    color: Color.black,
    fontSize: 16,
  },
  reviewText: {
    color: Color.black,
    fontSize: 14,
  },
  starComponent: {
    alignSelf: 'center',
    paddingVertical: height * 0.01,
  },
  reviewInput: {
    color: Color.black,
    borderWidth: 1,
    paddingHorizontal: width * 0.015,
    borderColor: Color.black,
    borderRadius: width * 0.01,
  },
  load: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center',
  },
});
