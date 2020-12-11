import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Redirect } from 'react-router-native';
import * as Permissions from 'expo-permissions';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import firebase from '../../config/firebase';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';

const Settings = () => {
  const db = firebase.firestore();
  const isAndroid = Platform.OS === 'android';

  const [userId, setUserId] = useState('');
  const [redirectTo, setRedirectTo] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [mySelectedTime, setMySelectedTime] = useState('');
  const [initialTime, setInitialTime] = useState('');
  const [timeFromPicker, setTimeFromPicker] = useState(new Date(Date.now()));

  const connected = async () => {
    const id = await AsyncStorage.getItem('userId');
    setUserId(id);

    const users = db.collection('users').doc(id);
    const user = await users.get();
    const userTime = user.data() ? user.data().time : false;
    const realTime = moment.unix(userTime);

    // setTimeFromPicker(realTime);

    const hours = realTime.hours();
    const minutes = realTime.minutes();

    const getHours = () => {
      return hours < 10 ? `0${hours}` : hours;
    };
    const getMinutes = () => {
      return minutes < 10 ? `0${minutes}` : minutes;
    };
    setInitialTime(`${getHours()}:${getMinutes()}`);
  };

  useEffect(() => {
    connected();
  }, []);

  const openTimePicker = () => {
    setShowTimePicker((prevState) => !prevState);
  };

  const onChange = async (event, selectedTime) => {
    if (isAndroid) {
      setShowTimePicker(false);
    }
    if (selectedTime) {
      const hours = selectedTime.getHours();
      const minutes = selectedTime.getMinutes();
      const getHours = () => {
        return hours < 10 ? `0${hours}` : hours;
      };
      const getMinutes = () => {
        return minutes < 10 ? `0${minutes}` : minutes;
      };
      setInitialTime(null);
      setTimeFromPicker(selectedTime);
      setMySelectedTime(`${getHours()}:${getMinutes()}`);
    }
  };

  const saveSettings = async () => {
    const unixedDate = moment(timeFromPicker).add(1, 'day').unix();
    const user = db.collection('users').doc(userId);

    try {
      await user.update({ time: unixedDate });
      setRedirectTo(true);
    } catch (error) {
      console.log(error);
    }
  };

  const goBack = () => {
    setRedirectTo(true);
  };

  return (
    <View style={styles.container}>
      {redirectTo && <Redirect to="/card" />}
      <View>
        <Text style={styles.heading}>Inställningar</Text>
        <PushNotifications />
        <TimeSettings
          openTimePicker={openTimePicker}
          mySelectedTime={mySelectedTime}
          initialTime={initialTime}
          showTimePicker={showTimePicker}
          onChange={onChange}
          timeFromPicker={timeFromPicker}
        />
      </View>

      <View style={styles.buttonWrapper}>
        <LinearGradient
          colors={['#FF5C00', '#E4862F']}
          style={styles.buttonContainer}
        >
          <TouchableOpacity onPress={goBack}>
            <Text style={styles.buttonText}>Tillbaka</Text>
          </TouchableOpacity>
        </LinearGradient>

        <LinearGradient
          colors={['#FF5C00', '#E4862F']}
          style={styles.buttonContainer}
        >
          <TouchableOpacity onPress={saveSettings}>
            <Text style={styles.buttonText}>Spara</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
};

const PushNotifications = () => {
  return (
    <TouchableWithoutFeedback onPress={OpenMobileSettings}>
      <View style={styles.settingBlock}>
        <Text style={styles.settingAttribute}>Notiser</Text>
        <Text style={styles.settingValue}>Ändra</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};

const OpenMobileSettings = () => {
  Linking.openURL('app-settings:');
};

const TimeSettings = (props) => {
  const {
    openTimePicker,
    mySelectedTime,
    initialTime,
    showTimePicker,
    onChange,
    timeFromPicker,
  } = props;

  return (
    <>
      <TouchableWithoutFeedback onPress={openTimePicker}>
        <View style={styles.settingBlock}>
          <Text style={styles.settingAttribute}>Vald tid</Text>
          <Text style={styles.settingValue}>
            {mySelectedTime || initialTime}
          </Text>
        </View>
      </TouchableWithoutFeedback>

      {showTimePicker && (
        <DateTimePicker
          style={styles.timePicker}
          testID="timePicker"
          value={timeFromPicker}
          mode={'time'}
          is24Hour={true}
          display="spinner"
          onChange={onChange}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  settingBlock: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  settingAttribute: {
    fontSize: 24,
  },
  settingValue: {
    fontSize: 24,
    color: '#FF5C00',
  },
  timePicker: {
    position: 'relative',
  },
  buttonWrapper: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
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
    marginTop: 60,
    marginBottom: 40,
  },
  buttonContainer: {
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flex: 0.48,
  },
  buttonText: {
    color: '#fff',
    fontSize: 24,
    textAlign: 'center',
  },
});

export default Settings;
