import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Link } from 'react-router-native';
import firebase from './../config/firebase';

const Start = () => {
  const db = firebase.firestore();

  const retrieveCard = () => {
    //Everytime a card is picked, add time to localStorage.
    //Check if time is past 24h since that time?
      
  }

  return (
    <View>
      <Text>This is Start</Text>
      <Link to='/home'><Text>Home</Text></Link>
    </View>
  );
}

export default Start;