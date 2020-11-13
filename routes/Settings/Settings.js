import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Link } from 'react-router-native';
import { LinearGradient } from 'expo-linear-gradient';

const Settings = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Inställningar</Text>

      <LinearGradient
        colors={['#FF5C00', '#E4862F']}
        style={styles.backContainer}
      >
        <Link to="/">
          <Text style={styles.backText}>Tillbaka</Text>
        </Link>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    display: 'flex',
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
    justifyContent: 'space-between',
  },
  heading: {
    fontSize: 40,
    textAlign: 'center',
    marginTop: 40,
  },
  backContainer: {
    borderRadius: 10,
    alignSelf: 'flex-start',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  backText: {
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
  },
});

export default Settings;
