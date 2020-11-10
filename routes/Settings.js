import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Link } from 'react-router-native';

const Settings = () => {
  return (
    <View>
      <Text>This is Settings</Text>
      <Link to='/'><Text>Home</Text></Link>
    </View>
  );
}

export default Settings;