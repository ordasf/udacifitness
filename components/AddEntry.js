import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { getMetricMetaInfo, timeToString, getDailyRemider } from '../utils/helpers'
import UdacitySlider from '../components/UdacitySlider'
import UdacitySteppers from '../components/UdacitySteppers'
import DateHeader from '../components/DateHeader'
import TextButton from './TextButton'
import { Ionicons } from '@expo/vector-icons'
import { submitEntry, removeEntry } from '../utils/api'
import { addEntry } from '../actions'
import { purple, white } from '../utils/colors';
import { NavigationActions } from 'react-navigation'

function SubmitButton({ onPress }) {
  return (
    <TouchableOpacity
      style={Platform.OS === 'ios' ? styles.submitBtnIOS : styles.submitBtnAndroid}
      onPress={onPress}>
      <Text style={styles.submitBtnText}>
        SUBMIT
      </Text>
    </TouchableOpacity>
  )
}

class AddEntry extends Component {

  state = {
    run: 0,
    bike: 0,
    swim: 0,
    sleep: 0,
    eat: 0
  }

  increment = (metric) => {
    const { max, step } = getMetricMetaInfo(metric)

    this.setState(state => {
      const count = state[metric] + step
      return {
        ...state,
        [metric]: count > max ? max : count
      }
    })
  }

  decrement = (metric) => {
    this.setState(state => {
      const count = state[metric] - getMetricMetaInfo(metric).step
      return {
        ...state,
        [metric]: count < 0 ? 0 : count
      }
    })
  }

  slide = (metric, value) => {
    this.setState(state => {
      return {
        ...state,
        [metric]: value
      }
    })
  }

  submit = () => {
    const key = timeToString()
    const entry = this.state

    this.props.dispatch(addEntry({
      [key]: entry
    }))

    this.setState(
      {
        run: 0,
        bike: 0,
        swim: 0,
        sleep: 0,
        eat: 0
      }
    )

    this.toHome()

    // Clear local notifications

    submitEntry(key, entry)
  }

  reset = () => {
    const key = timeToString()

    this.props.dispatch(addEntry({
      [key]: getDailyRemider()
    }))

    this.toHome()

    removeEntry(key)

  }

  toHome = () => {
    this.props.navigation.dispatch(NavigationActions.back({
      key: 'AddEntry'
    }))
  }

  render() {
    const metaInfo = getMetricMetaInfo()

    if (this.props.alreadyLogged) {
      return (
        <View style={styles.center}>
          <Ionicons
            name={Platform.OS === 'ios' ? 'ios-happy-outline' : 'md-happy'}
            size={100}
          />
          <Text>Information for this day already logged</Text>
          <TextButton style={{ padding: 10 }} onPress={this.reset}>
            Reset
          </TextButton>
        </View>
      )
    }

    return (
      <View style={styles.container}>
        <DateHeader date={(new Date().toLocaleDateString())}/>
        {
          Object.keys(metaInfo).map(key => {
            const { getIcon, type, ...rest} = metaInfo[key]
            const value = this.state[key]

            return (
              <View key={key} style={styles.row}>
                {getIcon()}
                {type === 'slider'
                  ? <UdacitySlider
                      value={value}
                      onChange={(value) => this.slide(key, value)}
                      {...rest}
                    />
                  : <UdacitySteppers
                      value={value}
                      onIncrement={() => this.increment(key)}
                      onDecrement={() => this.decrement(key)}
                      {...rest}
                    />
                }
              </View>
            )
          })
        }
        <SubmitButton onPress={this.submit}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center'
  },
  submitBtnIOS: {
    backgroundColor: purple,
    borderRadius: 7,
    padding: 10,
    height: 45,
    marginLeft: 40,
    marginRight: 40
  },
  submitBtnAndroid: {
    backgroundColor: purple,
    borderRadius: 2,
    padding: 10,
    paddingLeft: 30,
    paddingRight: 30,
    height: 45,
    marginLeft: 40,
    marginRight: 40,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center'
  },
  submitBtnText: {
    textAlign: 'center',
    fontSize: 22,
    color: white
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 30,
    marginRight: 30
  }
})

function mapStateToProps(state) {
  const key = timeToString()

  return {
    alreadyLogged: state[key] && typeof state[key].today === 'undefined'
  }
}

export default connect(mapStateToProps)(AddEntry)
