import React from 'react'
import { View, Text } from 'react-native'
import { purple } from '../utils/colors';

export default function DateHeader({ date }) {
  return (
    <Text style={{ fontSize: 26, color: purple }}>
      {date}
    </Text>
  )
}
