'use strict'

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { replaceRoute } from '../../actions/route'
 
import { Text , Image , Alert  , AsyncStorage} from 'react-native'
import { Container, Content, InputGroup, Input, Button, Icon, View , Footer , Spinner } from 'native-base'
import { Grid , Row , Col } from "react-native-easy-grid"
import myTheme from '../../themes/base-theme'
import styles from './styles'
import * as Config from '../../config'

class Otp extends Component {
    constructor(props) {
        super(props)
        this.state = {
            otp: ['','','','']
        }
        this.timer = null
        this.ref = ""
    }

    resetStateOtp(){
        let newState = {}
        newState['otp'] = ['','','','']
        this.setState(newState)
    }

    async requestOtp(){
        let options = {  
            method: 'GET',
            headers: {  
                "cache-control": "no-cache",
                "x-access-key" : Config.apiKey[Config.api],
                "x-access-token": this.props.userState.token
            }
        }
        let response = await fetch(`http://${Config.apiServer[Config.server]}/api/omc/otp/request`, options)
        let responseJson = await response.json()
        let responseStatus = await response.status
        if(responseStatus === 200){
            this.ref = responseJson.ref
        }else if(responseStatus === 404){
            this.requestOtp()
            console.log(responseJson.text) 
        }
    }

    async checkOtp(){
        let options = {  
            method: 'POST',
            headers: {  
                "cache-control": "no-cache",
                'Accept'      : 'application/json',
                'Content-Type': 'application/json',
                "x-access-key" : Config.apiKey[Config.api],
                "x-access-token": this.props.userState.token
            },
            body: JSON.stringify({
                ref: this.ref,
                otp: this.state.otp.join('')
            })
        }
        console.log(this.ref)
        let response = await fetch(`http://${Config.apiServer[Config.server]}/api/omc/otp/check`, options)
        let responseJson = await response.json()
        let responseStatus = await response.status
        if(responseStatus === 200){
            await AsyncStorage.setItem('@user:token', this.props.userState.token)
            this.replaceRoute('home')
        }else{
            this.resetStateOtp()
            this.timer = setInterval(()=>this._validate(),1000)
        }
    }

    componentDidMount(){
        this.requestOtp()
        
        this.timer = setInterval(()=>this._validate(),1000) 
    }

    replaceRoute(route) {
        this.props.replaceRoute(route)
    }  

    _validate(){
        let check = true
        for(let num of this.state.otp){
            if(num == '') check = false
        }
        if(check) {
            clearInterval(this.timer)
            this.checkOtp() 
        }
    } 

    render(){  
        return ( 
            <Container theme={myTheme}> 
                <View style={styles.container}>
                    <Content>
                        <Image source={require('../../../images/shadow.png')} style={styles.shadow}>
                            <View style={styles.bg}>
                                <Grid>
                                    <Row style={{  justifyContent:'flex-start' }} > 
                                        <Col style={{
                                            alignItems:'center'
                                        }}>
                                            <Text style={{fontSize:24 , color:'#fff'}}>Enter 4 Digit</Text>
                                            <Text style={{fontSize:24 , color:'#fff'}}>Passcode From SMS</Text>
                                            <Text></Text>
                                            <Row style={{alignItems:'center'}}>
                                                <Col style={{borderWidth:1, width:80}}>
                                                    <InputGroup style={styles.input}>
                                                        <Input 
                                                        style={styles.inputText} 
                                                        secureTextEntry={true} 
                                                        maxLength={1} 
                                                        keyboardType={'numeric'}
                                                        value={this.state.otp[0]}
                                                        onChangeText={(num) => {
                                                            let newState = {}
                                                            newState['otp'] = this.state.otp
                                                            newState['otp'][0] = num
                                                            this.setState(newState)
                                                        }}  />
                                                    </InputGroup>
                                                </Col>
                                                <Col style={{borderWidth:1, width:80}}> 
                                                    <InputGroup style={styles.input}>
                                                        <Input 
                                                        style={styles.inputText} 
                                                        secureTextEntry={true} 
                                                        maxLength={1} 
                                                        keyboardType={'numeric'}
                                                        value={this.state.otp[1]}
                                                        onChangeText={(num) => {
                                                            let newState = {}
                                                            newState['otp'] = this.state.otp
                                                            newState['otp'][1] = num
                                                            this.setState(newState)
                                                        }}  
                                                        />
                                                    </InputGroup>
                                                </Col>
                                                <Col style={{borderWidth:1, width:80}}>
                                                    <InputGroup style={styles.input}>
                                                        <Input 
                                                        style={styles.inputText} 
                                                        secureTextEntry={true} 
                                                        maxLength={1} 
                                                        keyboardType={'numeric'}
                                                        value={this.state.otp[2]}
                                                        onChangeText={(num) => {
                                                            let newState = {}
                                                            newState['otp'] = this.state.otp
                                                            newState['otp'][2] = num
                                                            this.setState(newState)
                                                        }}  />
                                                    </InputGroup>
                                                </Col>
                                                <Col style={{borderWidth:1, width:80}}>
                                                    <InputGroup style={styles.input}>
                                                        <Input 
                                                        style={styles.inputText} 
                                                        secureTextEntry={true} 
                                                        maxLength={1} 
                                                        keyboardType={'numeric'}
                                                        value={this.state.otp[3]}
                                                        onChangeText={(num) => {
                                                            let newState = {}
                                                            newState['otp'] = this.state.otp
                                                            newState['otp'][3] = num
                                                            this.setState(newState)
                                                        }}  />
                                                    </InputGroup>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Grid>
                            </View>
                        </Image>
                    </Content>
                    <Footer style={{
                        height: 10
                    }}> 
                        <Grid>
                            <Row>
                                <Col style={{backgroundColor:myTheme.footerHilightBarColors[0],height:10}}></Col>
                                <Col style={{backgroundColor:myTheme.footerHilightBarColors[1],height:10}}></Col>
                                <Col style={{backgroundColor:myTheme.footerHilightBarColors[2],height:10}}></Col>
                                <Col style={{backgroundColor:myTheme.footerHilightBarColors[3],height:10}}></Col>
                            </Row>
                        </Grid>
                    </Footer>
                </View>
                
            </Container>
        )
        
    }
}

function bindActions(dispatch) {
    return {
        replaceRoute: (route) => dispatch(replaceRoute(route)),
    }
}

function mapStateToProps(state) {
    return {
        userState: state.user.userState
    }
}

export default connect(mapStateToProps, bindActions)(Otp)