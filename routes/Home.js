import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Link } from 'react-router-native';
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';

const Home = () => {
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
    }

    let token = await Notifications.getExpoPushTokenAsync();
    Notifications.scheduleNotificationAsync({
      content: {
        title: 'Remember to drink water!,',
      },
      trigger: {
        seconds: 5,
        repeats: false,
      },
    });
    console.log(token);
    setTimeout(async () => {
      console.log('sent');
      await sendPushNotification(token);
    }, 4000);
  };

  // Can use this function below, OR use Expo's Push Notification Tool-> https://expo.io/notifications
  async function sendPushNotification(expoPushToken) {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: 'Original Title',
      body: 'And here is the body!',
      data: { data: 'goes here' },
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  }

  useEffect(() => {
    registerForPushNotifications();
    Notifications.addNotificationReceivedListener(() => {
      console.log('HELLO');
    });
  }, []);

  return (
    <View>
      <Text>This is home</Text>
      <Link to="/settings">
        <Text>Settings</Text>
      </Link>
    </View>
  );
};

export default Home;
