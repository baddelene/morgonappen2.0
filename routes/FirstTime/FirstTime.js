import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { Redirect } from "react-router-native";
import AsyncStorage from "@react-native-community/async-storage";

import * as Permissions from "expo-permissions";
import * as Notifications from "expo-notifications";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";

import firebase from "../../config/firebase";
import logo from "../../assets/logo.png";
import { TimePicker } from "./TimePicker.js";

const FirstTime = () => {
  const db = firebase.firestore();
  const [redirectTo, setRedirectTo] = useState(false);
  const [expoShareToken, setExpoShareToken] = useState("");

  const [showTimePicker, setShowTimePicker] = useState(false);
  const [mySelectedTime, setMySelectedTime] = useState();
  const [time, setTime] = useState(new Date(Date.now()));

  const isAndroid = Platform.OS === "android";

  const onChange = async (event, selectedTime) => {
    if (isAndroid) {
      setShowTimePicker(false);
    }
    if (selectedTime) {
      const hours = selectedTime.getHours();
      const minutes = selectedTime.getMinutes();
      const getHours = () => {
        return hours < 10 ? `0${hours}` : hours;
      };
      const getMinutes = () => {
        return minutes < 10 ? `0${minutes}` : minutes;
      };
      setMySelectedTime(`${getHours()}:${getMinutes()}`);
    }
    const currentDate = selectedTime || time;
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

    if (existingStatus !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.error("Permissions was not granted, status: ", finalStatus);
      Alert.alert("You need to give permission in order to use the app.");
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      return;
    }

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
      await AsyncStorage.multiSet([
        ["timeToReceiveCard", JSON.stringify(unixedDate)], 
        ["userId", id], 
        ["isFirstTime", "false"]])
        setRedirectTo("card");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <View style={styles.container}>
        {redirectTo === "card" && <Redirect to="/card" />}
        <View>
          <Image source={logo} style={styles.logo} />
          <Text style={styles.header}>Välkommen!</Text>
          <Text style={styles.text}>
            Vänligen välj den tid du önskar få din dagliga notis
          </Text>
          <TimePicker
            isAndroid={isAndroid}
            openTimePicker={openTimePicker}
            mySelectedTime={mySelectedTime}
            time={time}
            onChange={onChange}
            showTimePicker={showTimePicker}
          />
        </View>

        {mySelectedTime && (
          <LinearGradient
            colors={["#FF5C00", "#E4862F"]}
            style={styles.buttonContainer}
          >
            <TouchableOpacity onPress={onClick}>
              <Text style={styles.buttonText}>Spara</Text>
            </TouchableOpacity>
          </LinearGradient>
        )}
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
    fontSize: 22,
    paddingBottom: 20,
    textAlign: "center",
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
