import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, Picker, Switch, Button, Modal, Alert } from 'react-native';
import { Card } from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import { Permission, Notification, Calendar } from 'expo';
import * as Animatable from 'react-native-animatable';

class Reservation extends Component {
    constructor(props) {
        super(props);
        this.state = {
                guest: 1,
                smoking: false,
                date: ''
        }
    }
    static navigationOptions = {
        title: 'Reserve Table'
    }
    
    handleReservation() {
       console.log(JSON.stringfy(this.state));
       let message = 'Number of Guests: ' + this.state.guests +
                                '\nSmoking? ' + ( this.state.smoking ? 'YES' : 'NO' ) + 
                                '\nDate and Time: ' + this.state.date
        
        Alert.alert(
            ' Your Reservation OK?',
            message,
            [
                {
                    text: 'Cancel',
                    onPress: () => {
                        console.log('Reservation Cancelled');
                        this.resetForm();
                    }, style: 'cancel'
                },
                { 
                    text: 'OK',
                    onPress: () => {
                        this.presentLocalNotification(this.state.date);
                        this.resetForm();
                    }
                }
            ],
            { canceable: false }
        );
    }
    
    resetForm() {
        this.setState({
            guests: 1,
            smoking: false,
            date: ''
        });
    }
     asyn obtainNotificationPermission() {
         let permission = await Permission.getAsync(Permission.USER_FACING_NOTIFICATIONS)
         if ( permission.status !== 'granted') {
             permission = await Permission.askAsync(Permission.USER_FACING_NOTIFICATIONS);
            if (permission.status !== 'granted') {
                Alert.alert('Permission mnot granted to show notifications');
            }
        }
        return permission;
    }
    
    async obtainCalendarPermission() {
        let permission = await Permissions.getAsync(Permissions.CALENDAR);
        if (permission.status !== 'granted') {
            permission = await Permissions.askAsync(Permissions.CALENDAR);
            if (permission.status !== 'granted') {
                Alert.alert('Permission not granted to calendar');
            }
        }
        return permission;
    }

    async addReservationToCalendar(date) {
        await this.obtainCalendarPermission();
        let startDate = new Date(Date.parse(data));
        let endDate = new Date(Date.parse(date) + 2 * 60 * 60 * 1000);

        Calendar.createEventAsync(Calendar.DEFAULT, {
            title: 'Con Fusion Table Reservation',
            startDate: startDate,
            endDate: endDate,
            timeZone: 'Asia/Hong_Kong',
            location: '121, Clear Water Bay Road, Clear Water Bay, Kowloon, Hong Kong'
        },
      );
      Alert.alert('Reservation has been added to your calender');
    }
    
    async presentLocalNotification(date) {
        await this.obtainNotificationPermission();
        Notifications.presentLocalNotification({
            title: 'Your Reservation',
            body: 'Reservation for ' + date + 'requested',
            ios: {
                sound: true
            },
            android; {
                sound: true,
                vibrate: true,
                color: '#512DA8'
            }
        });
    }
    
    render() {
        return(
            <Animatable.View animation="zoomIn" duration={2000}>
                        <View style={styles.formRow}>
                        <Text style={styles.formLabel}>Number of Guests</Text>
                        <Picker
                            style={styles.formItem}
                            selectedValue={ this.state.guests }
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
                            value={ this.state.smoking }
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
                            onDateChange={(date) => {this.setState({date: date})}}
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
