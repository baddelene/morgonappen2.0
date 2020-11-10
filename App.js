import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeRouter, Route, Switch } from "react-router-native";
import { Start, Home, Settings } from './routes';

export default function App() {
  return (
    <View style={styles.container}>
    <NativeRouter>
      <Route exact path="/" component={Start} />
      <Route path="/home" component={Home} />
      <Route path="/settings" component={Settings} />
    </NativeRouter>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    backgroundColor: "#D5B8F8",
  },
});

