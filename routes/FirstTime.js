import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View, Alert } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from '../config/firebase';
import { Redirect } from 'react-router-native';

const FirstTime = () => {

  const db = firebase.firestore();
  const [redirectTo, setRedirectTo] = useState(false);
  const [expoShareToken, setExpoShareToken] = useState('');
  //DatePicker
  const [time, setTime] = useState(new Date(Date.now()));

  const onChange = async (event, selectedTime) => {
    const currentDate = selectedTime || time;
    // setShow(Platform.OS === 'ios');
    const item = await AsyncStorage.getItem('isFirstTime');
    setTime(currentDate);
  };

  useEffect(() => {
    registerForPushNotifications();
  }, [])

  const registerForPushNotifications = async () => {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.error('Permissions was not granted, status: ', finalStatus);
      Alert.alert('You need to give permission in order to use the app.')
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      return;
    }

    let token = await Notifications.getExpoPushTokenAsync();
    setExpoShareToken(token);
  }

  const onClick = async () => {
    const data = {
      time,
      expoShareToken,
      usedCards: []
    }
    try {
      const response = await db.collection("users").add(data);
      const id = response.id;
      try {
        await AsyncStorage.setItem('userId', id);
        await AsyncStorage.setItem('isFirstTime', 'false');
        const item = await AsyncStorage.getItem('isFirstTime');
       setRedirectTo('card');
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View>
      {redirectTo === 'card' && <Redirect to="/card"/>}
      <Text>Welcome to morgonAppen</Text>
      <Text>Please tell us when you want us to enlighten your day</Text>
      <DateTimePicker
        testID="timePicker"
        value={time}
        mode={'time'}
        is24Hour={true}
        display="default"
        onChange={onChange}
      />
      <Button title='Great!' onPress={onClick}/>
    </View>
  );
}

export default FirstTime;