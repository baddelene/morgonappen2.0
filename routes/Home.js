import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Link } from 'react-router-native';

const Home = () => {
  return (
    <View>
      <Text>This is home</Text>
      <Link to='/settings'><Text>Start</Text></Link>
      <Link to='/settings'><Text>Settings</Text></Link>
    </View>
  );
}

export default Home;