import React, { useEffect, useState } from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import * as Permissions from "expo-permissions";
import * as Notifications from "expo-notifications";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-community/async-storage";
import firebase from "../config/firebase";
import moment from "moment";
import { Redirect } from "react-router-native";
import { LinearGradient } from "expo-linear-gradient";
import logo from "./../assets/logo.png";

const FirstTime = () => {
  const db = firebase.firestore();
  const [redirectTo, setRedirectTo] = useState(false);
  const [expoShareToken, setExpoShareToken] = useState("");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [mySelectedTime, setMySelectedTime] = useState("My time");
  //DatePicker
  const [time, setTime] = useState(new Date(Date.now()));

  const onChange = async (event, selectedTime) => {
    const isAndroid = event.type ? true : false;

    if (isAndroid) {
      setShowTimePicker(false);
    }
    const currentDate = selectedTime || time;

    // const hours = selectedTime.getHours();
    // const minutes = selectedTime.getMinutes();
    // console.log(hours, ":", minutes);

    // const todaysDate = new Date();
    // const selectedTimes = `${todaysDate.getHours()}:${todaysDate.getMinutes()}`;
    // console.log(selectedTimes, "selectedtime");
    // setShow(Platform.OS === 'ios');
    const item = await AsyncStorage.getItem("isFirstTime");
    setTime(currentDate);
  };

  useEffect(() => {
    registerForPushNotifications();
  }, []);

  const registerForPushNotifications = async () => {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    // if (existingStatus !== "granted") {
    //   const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    //   finalStatus = status;
    // }

    // if (finalStatus !== "granted") {
    //   console.error("Permissions was not granted, status: ", finalStatus);
    //   Alert.alert("You need to give permission in order to use the app.");
    //   const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    //   return;
    // }

    let token = await Notifications.getExpoPushTokenAsync();
    setExpoShareToken(token);
  };

  const openTimePicker = () => {
    setShowTimePicker((prevState) => !prevState);
  };

  const onClick = async () => {
    const unixedDate = moment(time).add(1, "hour").unix();

    const data = {
      time: unixedDate,
      expoShareToken,
      usedCards: [],
    };
    try {
      const response = await db.collection("users").add(data);
      const id = response.id;
      try {
        await AsyncStorage.setItem("userId", id);
        await AsyncStorage.setItem("isFirstTime", "false");
        const item = await AsyncStorage.getItem("isFirstTime");
        setRedirectTo("card");
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <View style={styles.container}>
        {/* {redirectTo === 'card' && <Redirect to="/card"/>} */}
        <View>
          <Image source={logo} style={styles.logo} />
          <Text style={styles.header}>Welcome!</Text>
          <Text style={styles.text}>
            Please tell us when you want us to enlighten your day
          </Text>

          <TouchableOpacity
            onPress={openTimePicker}
            style={styles.setTimeContainer}
          >
            <Text style={styles.setTimeText}>Choose time</Text>

            <Text></Text>

            {showTimePicker && (
              <DateTimePicker
                style={styles.timePicker}
                testID="timePicker"
                value={time}
                mode={"time"}
                is24Hour={true}
                display="spinner"
                onChange={onChange}
              />
            )}
          </TouchableOpacity>
        </View>

        <LinearGradient
          colors={["#FF5C00", "#E4862F"]}
          style={styles.buttonContainer}
        >
          <TouchableOpacity onPress={onClick}>
            <Text style={styles.buttonText}>{mySelectedTime}!</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  logo: {
    alignSelf: "center",
    marginTop: 70,
  },
  container: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    display: "flex",
    flex: 1,
    justifyContent: "space-between",
  },
  header: {
    fontSize: 52,
    textAlign: "center",
    paddingTop: 40,
    paddingBottom: 20,
  },
  text: {
    fontSize: 24,
    paddingBottom: 20,
    textAlign: "center",
  },
  setTimeContainer: {
    paddingHorizontal: 10,
    paddingVertical: 40,
  },
  setTimeText: {
    textAlign: "center",
    fontSize: 20,
    color: "#FF5C00",
    fontWeight: "600",
  },
  timePicker: {
    position: "relative",
  },
  buttonContainer: {
    borderRadius: 10,
    display: "flex",
    paddingVertical: 14,
    paddingHorizontal: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 24,
    textAlign: "center",
  },
});

export default FirstTime;
