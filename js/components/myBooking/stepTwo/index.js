import React, { Component } from 'react'
import { connect } from 'react-redux'
import { openDrawer } from '../../../actions/drawer'
import { popRoute } from '../../../actions/route'
import { Container, Header , Content, View, Text, Title ,Button, Icon , Thumbnail , Footer , Spinner } from 'native-base'
import { Grid, Col, Row } from 'react-native-easy-grid'
import myTheme from '../../../themes/base-theme'
import styles from './styles'
import moment from 'moment'
import { Alert , Modal } from 'react-native'
import { loading , loaded } from '../../../actions/loading'
import * as Config from '../../../config'
import MapView from 'react-native-maps';
import { openModal , closeModal , categoryModal } from '../../../actions/modal'


class MyQuotesStepTwo extends Component {
    constructor(props){
        super(props)
        this.state = {
            detail: {},
            routes: [] 
        }
        
    }

    shouldComponentUpdate(nextProps, nextState){
        if(this.state.routes !== nextState.routes) {
            return true
        }else if(this.state.detail !== nextState.detail){
            return true
        }else if(this.props.load !== nextProps.load){
            return true
        }else if(this.props.modalState !== nextProps.modalState){
            return true
        }else if(this.props.jobId !== nextProps.jobId){
            return true
        }else if(this.props.userState !== nextProps.userState){
            return true
        }else{
            return false
        }
    }

    async _getRoutes(){
        let options = {
            method: 'GET',
            headers: {
                'Accept'      : 'application/json',
                'Content-Type': 'application/json',
                "x-access-key" : Config.apiKey[Config.api],
                "x-access-token": this.props.userState.token
            }
        }
        let response = await fetch(`http://${Config.apiServer[Config.server]}/api/omc/job/getRoutes/${this.props.jobId}`, options)
        let responseJson = await response.json()
        this.setState({
            routes: responseJson
        })
    }

    replaceToMyBooking(){
        let navigator = this.props.navigator
        navigator.replace({
            id: 'MyBooking',
        })
    }

    componentDidMount(){
        this.props.loading()
        this._loadDetail() 
        this._getRoutes()
    }

    popRoute(){ 
        this.props.popRoute()
    }

    _loadDetail(){
        setTimeout(async ()=>{
            this.props.loading()
            let options = {
                method: 'GET',
                headers: {  
                    "cache-control": "no-cache",
                    "x-access-key" : Config.apiKey[Config.api],
                    "x-access-token": this.props.userState.token
                }
            }
            let response = await fetch(`http://${Config.apiServer[Config.server]}/api/omc/job/getJobDetail/${this.props.jobId}`, options)
            let responseJson = await response.json()
            let responseStatus = await response.status
            if(responseStatus === 200){
                this.setState({detail: Object.assign({},this.state.detail,responseJson.result[0])})
            }else if(responseStatus === 404){
                this.setState({detail: {}})
                Alert.alert(``,`${responseJson.text}`)
            }
            this.props.loaded()
        },100)
    }

    _setModalVisible(visible){
        if(!visible){
            this.props.closeModal()
        }else{
            this.props.openModal()
            this.props.categoryModal('googlemap')
        }
    }

    _checkLoading(){
        
        if(this.props.load){
            return (
                <View style={styles.spinner}>
                    <Spinner color={myTheme.defaultSpinnerColor} />
                </View>
            )
        }else{
            return (
                <View style={styles.symbolBar}>
                    <View style={styles.viewDetail}>
                        <Grid>
                            <Row style={styles.row}>
                                <Col size={1}>
                                    <Text>Quote</Text>
                                </Col> 
                                <Col size={3}>
                                    <Text>{`${this.state.detail.quote_id}`}</Text>
                                </Col>
                            </Row>
                            <Row style={styles.rowAlternate}>
                                <Col size={1}>
                                    <Text>Start</Text>
                                </Col> 
                                <Col size={3}>
                                    <Text  numberOfLines={1}>{this.state.detail.col_address}</Text>
                                </Col>
                            </Row>
                            <Row style={styles.row}>
                                <Col size={1}>
                                    <Text>End</Text>
                                </Col> 
                                <Col size={3}>
                                    <Text  numberOfLines={1}>{this.state.detail.des_address}</Text>
                                </Col>
                            </Row>
                            <Row style={styles.rowAlternate}>
                                <Col size={1}>
                                    <Text>Pickup</Text>
                                </Col> 
                                <Col size={3}>
                                    <Text>{moment(this.state.detail.date_out,'YYYY-MM-DD HH:mm').format('ddd Do MMM YY hh:mm A')}</Text>
                                </Col>
                            </Row>
                            <Row style={styles.row}>
                                <Col size={1}>
                                    <Text>Return</Text>
                                </Col> 
                                <Col size={3}>
                                    <Text>{(this.state.detail.date_back !== '0000-00-00 00:00:00') ? moment(this.state.detail.date_back,'YYYY-MM-DD HH:mm').format('ddd Do MMM YY hh:mm A') : '-'}</Text>
                                </Col>
                            </Row>
                            <Row style={styles.rowAlternate}>
                                <Col size={1}>
                                    <Text>Vehicle</Text>
                                </Col> 
                                <Col size={3}>
                                    <Text numberOfLines={1}>{this.state.detail.car_name}</Text>
                                </Col>
                            </Row>
                            <Row style={styles.row}>
                                <Col size={1}>
                                    <Text>Pax</Text>
                                </Col> 
                                <Col size={3}>
                                    <Text>{this.state.detail.pax} PAX</Text>
                                </Col>
                            </Row>
                            <Row style={styles.rowAlternate}>
                                <Col size={1}>
                                    <Text>Luggage</Text>
                                </Col> 
                                <Col size={3}>
                                    <Text numberOfLines={1}>{this.state.detail.bag_des}</Text>
                                </Col>
                            </Row>
                        </Grid>
                    </View>
                    <View style={styles.viewCustomerNote}>
                        <Text style={{fontWeight:'400'}}>Customer Note: {this.state.detail.comment || '-' }</Text>
                    </View>
                    <View style={styles.viewMapButton}>
                        <Button 
                            block
                            style={{backgroundColor:'#1BBBCF',marginVertical:20}}
                            textStyle={{color: '#fff', fontSize: 20}}
                            onPress={()=>this._setModalVisible(true)}
                        >
                        <Icon name="map-marker" iconSet={'FontAwesome'} 
                        style={{
                                color: '#FFF',
                                fontSize: 20
                        }} />
                        </Button>
                    </View>
                    <Modal
                        animationType={'slide'}
                        transparent={false}
                        visible={(this.props.modalState.category === 'googlemap')?this.props.modalState.status:false}
                        onRequestClose={() => {this._setModalVisible(false)}}
                    >
                        <View>
                            <View style={styles.mapContainer}>
                                <MapView 
                                    initialRegion={{
                                        latitude: (this.state.detail.col_latlng) ? parseFloat(this.state.detail.col_latlng.split(',')[0]) : 0, 
                                        longitude: (this.state.detail.col_latlng) ?  parseFloat(this.state.detail.col_latlng.split(',')[1]) : 0,
                                        latitudeDelta: Config.LATITUDE_DELTA, 
                                        longitudeDelta: Config.LATITUDE_DELTA * Config.ASPECT_RATIO
                                    }}
                                    style={styles.map} 
                                    >
                                    { 
                                        (this.state.routes.length > 0) 
                                        ? this.state.routes.map((route,index) => (
                                            <MapView.Marker 
                                                key={index}
                                                coordinate={{latitude: parseFloat(route.add_lat),longitude: parseFloat(route.add_lng)}}
                                                title={route.collection_address}
                                            />
                                        ))
                                        : <MapView.Marker coordinate={{latitude: 0 , 
                                                                    longitude: 0}}/>
                                    }
                                </MapView>
                            </View>
                            <Button block onPress={()=>this._setModalVisible(false)}>CLOSE</Button>
                        </View>
                    </Modal>
                </View>
            )
        }
    }

    render() {
        return(
            <Container theme={myTheme} style={{backgroundColor: '#0F2145'}}>
                <Header style={{backgroundColor: '#021535'}}>
                    <Button transparent onPress={()=>this.popRoute()}>
                        <Icon name='angle-left' />
                    </Button>
                    <Title>View My Booking</Title>
                    <Button transparent onPress={this.props.openDrawer}>
                        <Icon name='bars' />
                    </Button>
                </Header>
                <Content style={styles.mainContainer}>
                    { this._checkLoading() }
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
             </Container>
        )
    }
}

function bindAction(dispatch) {
    return {
        popRoute: ()=> dispatch(popRoute()),
        openDrawer: ()=> dispatch(openDrawer()),
        loading: ()=> dispatch(loading()),
        loaded: ()=> dispatch(loaded()),
        closeModal: ()=> dispatch(closeModal()),
        openModal: ()=> dispatch(openModal()),
        categoryModal: (category)=>dispatch(categoryModal(category))
    }
}

function mapStateToProps(state){
    return {
        modalState: state.modal.modalState,
        load: state.load.loadingState,
        jobId: state.job.jobState.jobId,
        userState: state.user.userState
    }
}

export default connect(mapStateToProps, bindAction)(MyQuotesStepTwo)