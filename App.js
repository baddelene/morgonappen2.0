import AsyncStorage from '@react-native-community/async-storage';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeRouter, Redirect, Route } from 'react-router-native';
import { Home, Card } from './routes';
import { FirstTime } from './routes/FirstTime';
import { Settings } from './routes/Settings';

export default function App() {
  const [redirectTo, setRedirectTo] = useState('');

  useEffect(() => {
    isFirstTime();
  }, []);

  const isFirstTime = async () => {
    setRedirectTo(
      (await AsyncStorage.getItem('isFirstTime')) === 'false'
        ? 'card'
        : 'isFirstTime'
    );
    // setRedirectTo("isFirstTime");
  };

  return (
    <View style={styles.container}>
      <NativeRouter>
        <Route exact path="/">
          {redirectTo === 'card' && <Card />}
          {redirectTo === 'isFirstTime' && <Redirect to="/firstTime" />}
        </Route>
        <Route path="/home" component={Home} />
        <Route path="/settings" component={Settings} />
        <Route path="/firstTime" component={FirstTime} />
        <Route path="/card" component={Card} />
      </NativeRouter>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#120507',
  },
});
