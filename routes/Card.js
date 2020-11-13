import AsyncStorage from '@react-native-community/async-storage';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Animated } from 'react-native';

import CardWithText from './../components/CardWithText';
import firebase from './../config/firebase';

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

  const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
  };

  const connected = async () => {
    // await AsyncStorage.setItem('isFirstTime', 'true');
    const userId = await AsyncStorage.getItem('userId');
    const usedCards = await getUsedCards(userId);
    const allCards = await getAllCards();

    const filteredCards = allCards.filter(
      (card) => !usedCards.includes(card.id)
    );

    const chosenCard = filteredCards[getRandomInt(filteredCards.length)];
    console.log('chosenCard', chosenCard);
    setSelectedCard(chosenCard);

    // const finishedCards = [...usedCards, selectedCard.id];
    // await db.collection("users").doc(userId).set({
    //   usedCards: finishedCards
    // }, {merge: true})
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
