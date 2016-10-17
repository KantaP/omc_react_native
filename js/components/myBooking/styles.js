
'use strict';

var React = require('react-native');

var { StyleSheet , Dimensions } = React;
var width = Dimensions.get('window').width
module.exports = StyleSheet.create({
    spinner:{
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: Dimensions.get('window').height
    },
    list:{
        flex: 1,
        paddingLeft: 0,
        paddingRight:20
    },
    footerContainer: {
        flex: 1,
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    footerButton: {
        borderColor: '#8E8E8E',
        borderWidth: StyleSheet.hairlineWidth,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    footerText: {
        color: '#8E8E8E',
    }
});
