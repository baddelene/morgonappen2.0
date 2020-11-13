import AsyncStorage from '@react-native-community/async-storage';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Animated, Text } from 'react-native';

import CardWithText from './../components/CardWithText';
import firebase from './../config/firebase';
import moment from 'moment';

const Card = () => {
  const db = firebase.firestore();
  const [selectedCard, setSelectedCard] = useState({});

  useEffect(() => {
    connected();
  }, []);

  //User usedCards
  const getUsedCards = async (userId) => {
    return await db
      .collection('users')
      .doc(userId)
      .get()
      .then((snapshot) => {
        return snapshot.data().usedCards;
      });
  };

  const getAllCards = async () => {
    return await db
      .collection('cards')
      .get()
      .then((querySnapshot) => {
        const cards = [];
        querySnapshot.forEach((doc) => {
          cards.push({
            id: doc.id,
            card: doc.data(),
          });
        });
        return cards;
      });
  };

  const getNewCardAndFilterOutUsedCards = async () => {
    const userId = await AsyncStorage.getItem('userId');
    const usedCards = await getUsedCards(userId);
    const allCards = await getAllCards();

    const filteredCards = allCards.filter(
      (card) => !usedCards.includes(card.id)
    );

    const chosenCard = filteredCards[getRandomInt(filteredCards.length)];
    return chosenCard;

    // const finishedCards = [...usedCards, chosenCard.id];
    // await db.collection("users").doc(userId).set({
    //   usedCards: finishedCards
    // }, {merge: true})
  }

  const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
  };

  const connected = async () => {
    const userId = await AsyncStorage.getItem('userId');
    //Check if Date.now() is same or after time in DB and if so do below, else use image object in asyncStorage.
    const now = moment().seconds(0).milliseconds(0);
    const timeForNewImageInStorage = JSON.parse(await AsyncStorage.getItem('timeToReceiveCard'));
    const time = moment.unix(timeForNewImageInStorage).seconds(0).milliseconds(0).toISOString() 
    const shouldUpdateImage = moment(now).isSameOrAfter(time);

    //Get card from AsyncStorage
    const localImageObject = JSON.parse(await AsyncStorage.getItem('localImageObject'));
    if (localImageObject === null) {
      console.log('Is null');
      const chosenCard = await getNewCardAndFilterOutUsedCards();

      //Add chosen card to Async.
      await AsyncStorage.setItem("localImageObject", JSON.stringify(chosenCard));
      setSelectedCard(chosenCard);
    } else if(shouldUpdateImage) {
      console.log('Should update image');
      const newTime = await db.collection("users").doc(userId).get().then(data => data.data().time);
      console.log(moment.unix(newTime).toISOString());
      await AsyncStorage.setItem('timeToReceiveCard', JSON.stringify(newTime));
      const chosenCard = await getNewCardAndFilterOutUsedCards()
      setSelectedCard(chosenCard);
    } else {
      console.log('Same image');
      const chosenCard = JSON.parse(await AsyncStorage.getItem("localImageObject"));
      setSelectedCard(chosenCard)
    }
    
  };

  return (
    <View style={styles.container}>
      {'card' in selectedCard && (
        <Animated.View style={styles.card}>
          <CardWithText
            uri={selectedCard.card.imageUrl}
            text={selectedCard.card.text}
          />
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 1,
    display: 'flex',
    backgroundColor: '#fff',
  },
  text: {
    textAlign: 'center',
    paddingTop: 80,
    fontSize: 40,
    color: '#fff',
  },
  card: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
    height: '100%',
  },
});

export default Card;
