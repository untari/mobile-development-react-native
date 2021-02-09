import React from 'react';
import  { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

const style = StyleSgeet.create({
    loadingView: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    loadingText: {
        color: '#512DA8',
        fontSize: 14,
        fontweight: 'bold'
    }
});

export const Loading = () => {
    return(
        <View style={styles.loadingView}>
            <ActivityIndicator size="large" color='#512DA8' />
            <Text style={styles.loadingText}>Loading ...</Text>
        </View>
    )
}
