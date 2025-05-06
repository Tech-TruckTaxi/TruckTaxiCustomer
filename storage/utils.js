import { PermissionsAndroid, Platform, Alert, Linking } from "react-native";
import Geolocation from "react-native-geolocation-service";

export const requestPermission = async (retry = true) => {
  if (Platform.OS === "android") {
    try {
      console.log("==========> Requesting Location Permission <=============");

      // Check if permission is already granted
      const checkPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );

      if (checkPermission) {
        console.log("Permission already granted");
        return true;
      }

      // Request permission
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        {
          title: "Location Permission",
          message: "This app needs access to your location.",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );

      console.log("Granted:", granted);
      console.log("utils:", granted);
      
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Location permission granted.");
          console.log("Location permission granted.");
          getLocation();
        //   Linking.openSettings();
        return true;
      } else {
        console.log("Location permission denied.");
        // Alert.alert(
        //   "Location Disabled",
        //   "Please enable location services for a better experience.",
        //   [
        //     { text: "Cancel", style: "cancel" },
        //     {
        //       text: "Retry",
        //       onPress: () => {
        //         if (retry) {
        //           requestPermission(false); // Retry only once
        //         }
        //       },
        //     },
        //   ]
        // );
        return false;
      }
    } catch (err) {
      console.warn("Error requesting location permission:", err);
      return false;
    }
  } else {
    // Handle iOS permission
    const permission = await Geolocation.requestAuthorization("whenInUse");
    if (permission === "granted") {
      console.log("iOS Location permission granted.");
      return true;
    } else {
      Alert.alert(
        "Location Disabled",
        "Please enable location services for a better experience.",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Retry",
            onPress: () => {
              if (retry) {
                requestPermission(false); // Retry only once on iOS
              }
            },
          },
        ]
      );
      return false;
    }
  }
};

// Check if GPS is enabled before getting location
const checkIfLocationEnabled = async () => {
  return new Promise((resolve) => {
    Geolocation.getCurrentPosition(
      () => resolve(true),
      (error) => {
        if (error.code === 2) {
          console.s("GPS is disabled.");
          resolve(false);
        } else {
          resolve(true);
        }
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 1000 }
    );
  });
};

// Get user location
export const getLocation = async () => {
  const hasPermission = await requestPermission();
  if (!hasPermission) {
    console.log("Permission not granted.");
    return;
  }

  const isLocationEnabled = await checkIfLocationEnabled();
  if (!isLocationEnabled) {
    Alert.alert(
      "Location Services Disabled",
      "Please enable location services in your device settings.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Open Settings", onPress: () => openSettings() },
      ]
    );
    return;
  }

  Geolocation.getCurrentPosition(
    (position) => {
      console.log("User's Location:", position.coords);
    },
    (error) => {
      console.error("Error fetching location:", error);
    },
    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
  );
};

// Open device settings (Android only)
const openSettings = () => {
  if (Platform.OS === "android") {
    // console.log("vvv",);
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
  }
};
