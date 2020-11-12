import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

export const TimePicker = (props) => {
  const {
    isAndroid,
    openTimePicker,
    mySelectedTime,
    time,
    onChange,
    showTimePicker,
  } = props;

  if (isAndroid) {
    return (
      <>
        <TouchableOpacity
          onPress={openTimePicker}
          style={styles.setTimeContainer}
        >
          <Text style={styles.setTimeText}>
            {" "}
            {!mySelectedTime ? "Välj tid" : "Ändra tid"}
          </Text>
        </TouchableOpacity>

        {showTimePicker && (
          <DateTimePicker
            style={styles.timePicker}
            testID="timePicker"
            value={time}
            mode={"time"}
            is24Hour={true}
            display="spinner"
            onChange={onChange}
          />
        )}

        {mySelectedTime && (
          <Text style={styles.mySelectedTime}>{mySelectedTime}</Text>
        )}
      </>
    );
  }
  return (
    <DateTimePicker
      style={styles.timePicker}
      testID="timePicker"
      value={time}
      mode={"time"}
      is24Hour={true}
      display="spinner"
      onChange={onChange}
    />
  );
};

const styles = StyleSheet.create({
  setTimeContainer: {
    paddingHorizontal: 10,
    paddingVertical: 40,
  },
  setTimeText: {
    textAlign: "center",
    fontSize: 20,
    color: "#FF5C00",
    fontWeight: "600",
  },
  timePicker: {
    position: "relative",
  },
  mySelectedTime: {
    fontSize: 32,
    textAlign: "center",
    color: "#000",
  },
});
