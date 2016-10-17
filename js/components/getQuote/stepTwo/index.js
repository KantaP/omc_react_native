'use strict'
import React , { Component } from 'react'
import { connect } from 'react-redux'

import { 
    Container, 
    Header, 
    Title, 
    Content, 
    View , 
    Text , 
    Button , 
    Footer , 
    Input , 
    Icon , 
    InputGroup ,
    Picker , 
    Spinner
} from 'native-base'


import { Dimensions , Alert , Platform } from 'react-native'
import { Grid, Col, Row } from 'react-native-easy-grid'
import { popRoute , replaceRoute } from '../../../actions/route'
import { openDrawer , closeDrawer } from '../../../actions/drawer'
import { loading , loaded } from '../../../actions/loading'
import { setQuoteFormPartTwo , jobCreating , jobCreated } from '../../../actions/job'

import * as Config from '../../../config'
import myTheme from '../../../themes/base-theme'
import styles from './styles'
import moment from 'moment'

import { _compareParams , _buildQueryMileDuration } from '../../../services'

const PickerItem = Picker.Item

class GetQuoteStepTwo extends Component{
    constructor(props){
        super(props)
        this.state = {
            luggagesPopUp:{
                data: []
            },
            journeyTypesPopUp:{
                data:[]
            },
            vehiclesPopUp:{
                data:[]
            },
            passengerPopUp:{
                data:[]
            },
            pax: 0,
            journeyType: 0,
            vehicle: 0,
            luggage: 0,
            passengerItems: []
        }
    }

    async componentWillMount(){
        await this._prepareData()
        if(typeof this.state.passengerPopUp.data[0] == 'undefined') {
            this.state.passengerPopUp.data[0] = {}
            this.state.passengerPopUp.data[0].min_passenger = 1
            this.state.passengerPopUp.data[0].max_passenger = 100
        }
        let passengerItems = this._passengerItems(this.state.passengerPopUp.data[0])
        this.setState({
            passengerItems
        })
        this.setState({
            pax: this.state.passengerItems[0].value ,
            journeyType: this.state.journeyTypesPopUp.data[0].journey_id,
            vehicle: this.state.vehiclesPopUp.data[0].car_id,
            luggage: this.state.luggagesPopUp.data[0].bag_id
        })
    }

    async _prepareData(){
        try{
            let options = {
                method: 'GET',
                headers: {  
                    "x-access-key" : Config.apiKey[Config.api],
                    "x-access-token": this.props.userState.token
                }
            }
            let passengerRequest = await fetch(`http://${Config.apiServer[Config.server]}/api/omc/job/getMaxPassenger`, options)
            let luggagesRequest = await fetch(`http://${Config.apiServer[Config.server]}/api/omc/job/getLuggages`, options)
            let vehiclesRequest = await fetch(`http://${Config.apiServer[Config.server]}/api/omc/job/getVehicles`, options)
            let journeyTypesRequest = await fetch(`http://${Config.apiServer[Config.server]}/api/omc/job/getJourneyTypes`, options)
            
            let passengerResponse = await passengerRequest.json()
            let luggagesResponse = await luggagesRequest.json()
            let vehiclesResponse = await vehiclesRequest.json()
            let journeyTypesResponse = await journeyTypesRequest.json()
            
            this.setState({
                passengerPopUp : Object.assign(
                    {},
                    this.state.passengerPopUp,
                    {
                        data: passengerResponse.passenger
                    }
                ),
                luggagesPopUp : Object.assign(
                    {},
                    this.state.luggagesPopUp,
                    {
                        data: luggagesResponse.luggages
                    }
                ),
                journeyTypesPopUp : Object.assign(
                    {},
                    this.state.journeyTypesPopUp,
                    {
                        data: journeyTypesResponse.journeyTypes
                    }
                ),
                vehiclesPopUp : Object.assign(
                    {},
                    this.state.vehiclesPopUp,
                    {
                        data: vehiclesResponse.cars
                    }
                )
            })
            
        }catch(err){
            Alert.alert(``,`${err}`)
        }
    }

    popRoute() {
        this.props.popRoute()
    }

    navigateTo(route) {
        this.props.closeDrawer() 
        this.props.replaceRoute(route)
    }

    onValueChange(key , value){
        const newState = {};
        newState[key] = value;
        this.setState(newState);
    }

    _getUserData(){
        return new Promise(async (resolve,reject)=>{
            try{
                let options = {
                    method: 'GET',
                    headers: {  
                        "cache-control": "no-cache",
                        "x-access-key" : Config.apiKey[Config.api],
                        "x-access-token": this.props.userState.token
                    }
                }
                let response = await fetch(`http://${Config.apiServer[Config.server]}/api/omc/job/getUserData`, options)
                let responseJson = await response.json()
                resolve(responseJson)
            }catch(err){ 
                reject(err)
            }
        })
    }

    

    async _testCreate(){
        
        try{
            this.props.loading()
            let partOne = this.props.jobState.createJob.partOne
            let partTwo = this.props.jobState.createJob.partTwo
            let mergePart = Object.assign({},partOne,partTwo)
            let userData = await this._getUserData()
            // console.log(mergePart)
            let prototypeParams = await _compareParams(mergePart,userData)
            // console.log(prototypeParams)
            let data = ''
            for (let key in prototypeParams) {
                if(typeof prototypeParams[key] == 'object'){
                    for(let ind in prototypeParams[key]){
                        data += encodeURIComponent(key)+`[${ind.toString()}]=`+encodeURIComponent(prototypeParams[key][ind])+"&";
                    }
                }else{
                    data += encodeURIComponent(key)+"="+encodeURIComponent(prototypeParams[key])+"&";
                }
            }
            let options = {
                method: 'POST',
                headers: {  
                    'Accept'      : 'application/json , text/plain, */*',
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                body: data
            }
            // console.log(options)
            let response = await fetch(`http://${Config.website}/lib/perform_function.php?d=adminlib&f=update_job_mobile.php`, options)
            let responseText = await response.text()
            responseText = responseText.replace("*","")
            
            let fetchMovements = await fetch(`http://${Config.website}/lib/perform_function.php?d=adminlib&f=get_movements.php&qid=${responseText}`)
            let responseMovements = await fetchMovements.json()

            let queryString = await _buildQueryMileDuration(prototypeParams,responseMovements)
            let updateMileDuration = await fetch(`http://${Config.website}/lib/perform_function.php?d=adminlib&f=update_frontend_movement.php${queryString}`)

            options.body = encodeURIComponent('id')+"="+encodeURIComponent(responseText)+"&"+encodeURIComponent('single')+"="+encodeURIComponent(prototypeParams.single)
            let updatePrice = await fetch(`http://${Config.website}/lib/perform_function.php?d=adminlib&f=act.auto_price.php`, options)

            this.props.loaded()
            Alert.alert(``,`Your quote is ${responseText}`,[{text:'OK' , onPress: ()=> this.navigateTo('myQuotes')}])
            
        }catch(err){
            this.props.loaded()
            Alert.alert(``,`${err}`)
        }
        
    }

    async _setQuoteFormPartTwo(data){
        let validate = true
        Object.keys(data).forEach((key,index)=>{
            if(data[key] === 0) {
                validate = false
            }
        })
        if(validate){
            await this.props.setQuoteFormPartTwo(data)
            this._testCreate()
        }else{
            Alert.alert(``,`Please select all input`)
        }
        
    }

    _passengerItems({min_passenger,max_passenger}){
        let min = min_passenger
        let max = max_passenger
        let items = new Array()
        for(let i = min; i <= max ; i++){
            items.push (
                {value: i , label: `${i} pax`}
            )
        }
        return items
    }

    _checkLoadding(){
        if(this.props.load){
            return (
                <View style={styles.spinner}>
                    <Spinner color={myTheme.defaultSpinnerColor} />
                </View>
            )
        }else{
            return (
                <View style={styles.symbolBar}>
                <Grid>
                    <Row>
                        <View>
                            <Text style={{
                                fontWeight: 'bold'
                            }}>
                                Mileage Duration
                            </Text>
                        </View>
                    </Row>
                    <Row>
                        <Col>
                                <View style={styles.input}>
                                <Picker
                                selectedValue={this.state.luggage}
                                onValueChange={this.onValueChange.bind(this , 'luggage')}
                                mode="dropdown">
                                {this.state.luggagesPopUp.data.map((obj,index) => (
                                    <PickerItem
                                    key={index}
                                    value={obj.bag_id}
                                    label={obj.bag_des}
                                    /> 
                                ))}
                                </Picker>
                            </View>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <View style={styles.input}>
                                <Picker
                                selectedValue={this.state.pax}
                                onValueChange={this.onValueChange.bind(this , 'pax')}
                                mode="dropdown">
                                {this.state.passengerItems.map((item,index)=>{
                                        return (
                                            <PickerItem
                                            key={index}
                                            {...item}
                                            />
                                        )
                                })}
                                </Picker>
                            </View>
                        </Col>
                        
                    </Row>
                    <Row>
                        <Col>
                            <View style={styles.input}>
                                <Picker
                                selectedValue={this.state.vehicle}
                                onValueChange={this.onValueChange.bind(this , 'vehicle')}
                                mode="dropdown">
                                {this.state.vehiclesPopUp.data.map((obj,index) => (
                                    <PickerItem
                                    key={index}
                                    value={obj.car_id}
                                    label={obj.car_name}
                                    /> 
                                ))}
                                </Picker>
                            </View>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <View style={styles.input}>
                                <Picker
                                selectedValue={this.state.journeyType}
                                onValueChange={this.onValueChange.bind(this , 'journeyType')}
                                mode="dropdown">
                                {this.state.journeyTypesPopUp.data.map((obj,index) => (
                                    <PickerItem
                                    key={index}
                                    value={obj.journey_id}
                                    label={obj.journey_data}
                                    /> 
                                ))}
                                </Picker>
                            </View>
                        </Col>
                    </Row>
                    <Button block 
                    style={{backgroundColor:'#1BBBCF'}}
                    textStyle={{color: '#fff', fontSize: 20}}
                    onPress={()=>this._setQuoteFormPartTwo({
                        pax: this.state.pax,
                        vehicle: this.state.vehicle,
                        journeyType: this.state.journeyType,
                        luggage: this.state.luggage
                    }
                    )}>
                        GET QUOTE
                    </Button>
                </Grid>
            </View>
            )
        }
  
    }

    render(){
        return(
            <Container theme={myTheme} style={{backgroundColor: '#0F2145'}}>
                <Header style={{backgroundColor: '#021535'}}>
                    <Button transparent onPress={()=>this.popRoute()}>
                        <Icon name='angle-left' />
                    </Button>
                    <Title>Quote Form</Title>
                    <Button transparent onPress={this.props.openDrawer}>
                        <Icon name='bars' />
                    </Button>
                </Header>
                <Content>
                    { this._checkLoadding() }
                </Content>
                <Footer style={{
                    height: 10
                }}>
                    <Grid>
                        <Row style={styles.fullRow}>
                            <Col style={{backgroundColor:myTheme.footerHilightBarColors[0],height:10}}></Col>
                            <Col style={{backgroundColor:myTheme.footerHilightBarColors[1],height:10}}></Col>
                            <Col style={{backgroundColor:myTheme.footerHilightBarColors[2],height:10}}></Col>
                            <Col style={{backgroundColor:myTheme.footerHilightBarColors[3],height:10}}></Col>
                        </Row>
                    </Grid>
                </Footer>
             </Container>
        )
    }
}

function mapStateToProps(state) {
    return {
        jobState : state.job.jobState,
        userState: state.user.userState,
        load: state.load.loadingState,
    }
}

function bindAction(dispatch) {
    return {
        openDrawer: ()=>dispatch(openDrawer()),
        closeDrawer: ()=>dispatch(closeDrawer()),
        popRoute: () => dispatch(popRoute()),
        replaceRoute: (route) => dispatch(replaceRoute(route)),
        setQuoteFormPartTwo: (data) => dispatch(setQuoteFormPartTwo(data)),
        jobCreating: () => dispatch(jobCreating()),
        jobCreated: () => dispatch(jobCreated()),
        loading: ()=> dispatch(loading()),
        loaded: ()=> dispatch(loaded())
    }
}

export default connect(
    mapStateToProps,
    bindAction
)(GetQuoteStepTwo)