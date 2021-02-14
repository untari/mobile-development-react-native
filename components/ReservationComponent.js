import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, Picker, Switch, Button, Modal, Alert } from 'react-native';
import { Card } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import * as Animatable from 'react-native-animatable';

class Reservation extends Component {
    static navigationOptions = {
        guest: 1,
        smoking: false,
        date: '',
    }
    this.state = Reservation.defaultState();
    
    resetForm() {
        this.setState(Reservation.defaultState());
    }
    
    confirmReservation() {
        this.resetForm();
    }
    
    handleReservation() {
        const { date, guest, smoking } = this.state;
        
        Alert.alert(
            ' Your Reservation OK?',
            `Number of guests: ${guests}\nSmoking? ${smoking ? 'Yes' : 'No'}\nDate and Time:${date}`,
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                    onPress: () => this.resetForm();
                },
                {
                    text: 'OK',
                    onPress: () => this.confirmReservation(),
                },
            ],
            { canceable: false },
        );
    }
    
    
    render() {
        const todayDate = new Date().toISOString().split('T')[0];
        const { date, guests, smoking } = this.state;
        return(
            <Animatable.View animation="zoomIn" duration={2000}>
                    <ScrollView>
                        <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Number of Guests</Text>
                        <Picker
                            style={styles.formItem}
                            selectedValue={ guests }
                            onValueChange={(itemValue => this.setState({guests: itemValue})}>
                            <Picker.Item label="1" value="1" />
                            <Picker.Item label="2" value="2" />
                            <Picker.Item label="3" value="3" />
                            <Picker.Item label="4" value="4" />
                            <Picker.Item label="5" value="5" />
                            <Picker.Item label="6" value="6" />
                        </Picker>
                        </View>
                        <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Smoking/Non-Smoking?</Text>
                        <Switch
                            style={styles.formItem}
                            value={ smoking }
                            onTintColor='#512DA8'
                            onValueChange={(value) => this.setState({smoking: value})}>
                        </Switch>
                        </View>
                        <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Date and Time</Text>
                        <DatePicker
                            style={{flex: 2, marginRight: 20}}
                            date={ date }
                            format=''
                            mode="datetime"
                            placeholder="select date and Time"
                            minDate="2017-01-01"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            customStyles={{
                            dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                marginLeft: 0
                            },
                            dateInput: {
                                marginLeft: 36
                            }
                            }}
                            onDateChange={(newDate) => {this.setState({date: newDate})}}
                        />
                        </View>
                        
                        <View style={styles.formRow}>
                            <Button
                                onPress={() => this.handleReservation()}
                                title="Reserve"
                                color="#512DA8"
                                accessibilityLabel="Learn more about this purple button"
                                />
                        </View>
               </ScrollView>
            </Animatable.View>
        );
    }
};

const styles= StyleSheet.create({
    formRow: {
        alignItem: 'center,
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row',
        margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1
    },
    modal: {
       justifyContent: 'center',
       margin: 20
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#512DA8',
        textAlign: 'center',
        color: 'white',
        marginBottom: 20
    },
    modalText: {
        fontSize: 18,
        margin: 10
    }
});
 
export default Reservation;
