import React from 'react'
import { View, Text, Slider, StyleSheet } from 'react-native'

export default function UdacitySlider({ max, value, onChange, unit, step }) {
  return (
    <View style={styles.row}>
      <Slider
        style={{flex: 1}}
        minimumValue={0}
        maximumValue={max}
        value={value}
        step={step}
        onValueChange={onChange}
      />
      <View style={styles.metricCounter}>
        <Text style={{fontSize: 24, textAlign: 'center'}}>{value}</Text>
        <Text style={{fontSize: 18, color: 'gray'}}>{unit}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  metricCounter: {
    width: 85,
    justifyContent: 'center',
    alignItems: 'center'
  }
})