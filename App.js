import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Accelerometer } from 'expo';

let col = '#7FFF94';
let txt = " ";
//const soundObject = new Expo.Audio.Sound();


export default class App extends React.Component {
  state = {
    accelerometerData: {},
  }
  
  componentDidMount() {
    this._toggle();
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  _toggle = () => {
    if (this._subscription) {
      this._unsubscribe();
    } else {
      this._subscribe();
    }
  }

  _slow = () => {
    Accelerometer.setUpdateInterval(1000); 
  }

  _fast = () => {
    Accelerometer.setUpdateInterval(100);
  }

  _subscribe = () => {
    this._subscription = Accelerometer.addListener(accelerometerData => {
      this.setState({ accelerometerData });
    });
  }

  _unsubscribe = () => {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  }

  render() {

    // Speed calculation
    let { x, y, z } = this.state.accelerometerData;
    let acc_tot_filtered = 0;
    let a_tot_changes = 0;
    let abs_avg = 0;
    let iir_filter = 0.05;
    let acc_tot = Math.sqrt((Math.pow(x, 2)) + (Math.pow(y, 2)) + (Math.pow(z, 2)));

    acc_tot_filtered = acc_tot_filtered * (1 - iir_filter) + (acc_tot * iir_filter);
    a_tot_changes = acc_tot - acc_tot_filtered;

    if (a_tot_changes < 0){
      a_tot_changes *= -1;
    }

    abs_avg = abs_avg * (1 - iir_filter) + (a_tot_changes * iir_filter);

    if(abs_avg > 0.07) {
      col = 'red';
      txt = abs_avg;
      console.log(abs_avg);
    } else{
      col = '#7FFF94';
    }


    return (
      <View style={StyleSheet.flatten([styles.container,{backgroundColor: col}])}>
        <Text> ACCELEROMETER:</Text>
        <Text> x: {x}</Text>
        <Text> y: {y}</Text>
        <Text> z: {z}</Text>
        <Text> ----------------------------------------------------------</Text>
        <Text> acc_tot: {acc_tot}</Text>
        <Text> acc_tot_filtered: {acc_tot_filtered}</Text>
        <Text> speed: {abs_avg}</Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={this._toggle} style={styles.button}>
          <Text>Stop/Go</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.text}> PEAK: {txt}</Text>
      </View>


    );
  }
}

function round(n) {
  if (!n) {
    return 0;
  }

  return Math.floor(n * 100) / 100;
}

let styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#7FFF94"
  },

  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    marginTop: 15,
  },
  button: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 10,
  },
  middleButton: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  sensor: {
    marginTop: 15,
    paddingHorizontal: 10,
  },
  text: {
    marginTop: 20,
    fontSize:20
  }
});

/*
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={this._toggle} style={styles.button}>
            <Text>Toggle</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._slow} style={[styles.button, styles.middleButton]}>
            <Text>Slow</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this._fast} style={styles.button}>
            <Text>Fast</Text>
          </TouchableOpacity>
        </View>
        */