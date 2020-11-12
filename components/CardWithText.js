import React, { useEffect, useRef, useState } from 'react';
import { ImageBackground, StyleSheet, Text, View, Animated, TouchableOpacity, Easing, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { useFonts, Nunito_400Regular } from '@expo-google-fonts/nunito';

const CardWithText = ({uri, text}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnimText = useRef(new Animated.Value(0)).current;
  const shrinkCard = useRef(new Animated.Value(0)).current;
  const [scaleGoal, setScaleGoal] = useState('small');
  const [background, setBackground] = useState(true);

  const ScreenHeight = Dimensions.get("window").height;

  const [fontsLoaded] = useFonts({
    Nunito_400Regular
  });

  const handleShrink = () => {
    if (scaleGoal === 'small') {
      setBackground(false);
      Animated.timing(
        shrinkCard, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true
        }).start(() => {
          setScaleGoal('large')
        })
    } else {
      Animated.timing(
        shrinkCard, {
        toValue: 0,
        duration: 1000,
        easing: Easing.ease,
        useNativeDriver: true
      }).start(() => {
        setScaleGoal('small')
        setBackground(true);
      })
    }
    }
    
    
    useEffect(() => {
      Animated.sequence([
        Animated.timing(
          fadeAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true
          }),
          Animated.timing(
            fadeAnimText, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true
            }
            )
          ]).start()
        },[fadeAnim])
          
  if (!fontsLoaded) {
      return <Text>LOADING!</Text>
  }
  
  const styles = StyleSheet.create({
    container: {
      fontSize: 40
    },
    shrinkContainer: {
      position: "absolute",
      top: 0,
      bottom: 0,
      width: '100%',
      height: ScreenHeight,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 8
      },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 9,
      transform: [
        {
          translateY: shrinkCard.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 100]
          }),
          scaleY: shrinkCard.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0.7]
          }),
          scaleX: shrinkCard.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0.7]
          }),
        },
      ]
    },
    image: { 
      flex: 1,
    },
    text: {
      fontSize: 40,
      textAlign: "center",
      marginTop: "50%",
      color: "#fefefe",
      paddingLeft: 10,
      paddingRight: 10,
      fontFamily: "Nunito_400Regular",
      textTransform: "uppercase",
    }
  });

  return (
    <View style={[{ flex: 1 }, { backgroundColor: background ? '#fff' : 'transparent' }]}>
    <TouchableWithoutFeedback style={{position: 'relative'}} onPress={handleShrink}>
        <Animated.View style={{...styles.shrinkContainer, opacity: fadeAnim}}>
          <ImageBackground imageStyle={{ borderRadius: 20, backgroundColor: '#fff' }} style={styles.image} source={{ uri: uri }}>
            <Animated.View style={{ opacity: fadeAnimText }}>
              <Text style={styles.text}>{text}</Text>
            </Animated.View>
          </ImageBackground>
      </Animated.View>
    </TouchableWithoutFeedback>
  </View>
  );
}

export default CardWithText;