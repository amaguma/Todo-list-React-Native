import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';

import { THEME } from '../theme';
import { AppTextBold } from './ui/AppTextBold';

export const Navbar = ({ title }) => {

    
    return (
        <View style={{
            ...styles.navbar,
            ...Platform.select({
                ios: styles.navbarIos,
                android: styles.navbarAndroid
            })
        }}>
            <AppTextBold style={{
                ...styles.text,
                ...Platform.select({
                    ios: styles.textIos,
                    android: styles.textAndroid
                })
            }}>
                {title}
            </AppTextBold>
        </View>
    );
}

const styles = StyleSheet.create({
    navbar: {
        height: 70,
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: 10
    },
    navbarAndroid: {
        backgroundColor: THEME.MAIN_COLOR
    },
    navbarIos: {
        borderBottomColor: THEME.MAIN_COLOR,
        borderBottomWidth: 1
    },
    text: {
        color: 'white',
        fontSize: 20
    },
    textIos: {
        color: THEME.MAIN_COLOR
    },
    textAndroid: {
        color: 'white'
    }
});