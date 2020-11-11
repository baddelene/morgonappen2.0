import AsyncStorage from '@react-native-community/async-storage';
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { Link } from 'react-router-native';
import firebase from './../config/firebase';

const Card = () => {

  const onPress = async () => {
    await AsyncStorage.setItem('isFirstTime', 'true');
  }

  return (
    <View>
      <Text>AMAZING START</Text>
      <Link to='/home'><Text>AMAZING CARD</Text></Link>
      <Button onPress={onPress} title='hej' />
    </View>
  );
}

export default Card;