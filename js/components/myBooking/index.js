import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Dimensions , TouchableOpacity , Alert , TextInput} from 'react-native'
import { openDrawer , closeDrawer } from '../../actions/drawer'
import { pushNewRoute } from '../../actions/route'
import { setJobId , fetchMyBookingRequest , fetchMyBookingError , fetchMyBookingSuccess , getMoreMyBooking , resetPageMyBooking} from '../../actions/job'
import { Container, Header , Content, View, Text, Title ,Button,  InputGroup, Input , Icon , Thumbnail , Footer , List, ListItem  , Spinner} from 'native-base'
import { Grid, Col, Row } from 'react-native-easy-grid'
import myTheme from '../../themes/base-theme'
import styles from './styles'
import moment from 'moment'
import { loading , loaded } from '../../actions/loading'
import * as Config from '../../config'

class MyBooking extends Component {
    constructor(props){
        super(props)
    }   

    componentDidMount(){
        setTimeout(()=>this.props.loading(),33)
        setTimeout(()=>{
            this.props.resetPageMyBooking()
            this._getMyBooking()
        },1000)
    }     

    navigateTo(route) {
        this.props.closeDrawer() 
        this.props.pushNewRoute(route)
    }
    
    _goToStepTwo(jobId){
        this.props.setJobId(jobId)
        this.navigateTo('myBookingStepTwo')
    }

    _preRenderSuccess(){
        this.setState({preRender:true})
    }

    _onRefresh() {
        this.setState({refreshing:true})
        setTimeout(()=>{
            this.setState({refreshing:false})
        })
    }

    _getMyBooking(){
        setTimeout(async ()=>{
            this.props.fetchMyBookingRequest() 
            this.props.loading()
            let options = {
                method: 'GET',
                headers: {  
                    "cache-control": "no-cache",
                    "x-access-key" : Config.apiKey[Config.api],
                    "x-access-token": this.props.userState.token
                }
            } 
            let response = await fetch(`http://${Config.apiServer[Config.server]}/api/omc/job/getMyBooking/${this.props.jobState.fetchMyBooking.page}`, options)
            let responseJson = await response.json()
            let responseStatus = await response.status
            if(responseStatus === 200){
                this.props.fetchMyBookingSuccess(responseJson.results)
            }else if(responseStatus === 404){
                this.props.fetchMyBookingError(responseJson.text)
            }
            this.props.loaded()
        },1500)
    }

    _renderRow(rowData){
        return (
            <ListItem button
                onPress={()=>this._goToStepTwo(rowData.quote_id)}
            >
                <View>
                    <Text textStyle={{color:'#fff'}}>{rowData.quote_id}</Text>
                    <Text numberOfLines={1}>{rowData.col_address}</Text>
                    <Text>{moment(rowData.date_out,"YYYY-MM-DD HH:mm").format('ddd Do MMM YY hh:mm A')}</Text>
                    <Text>{(rowData.date_back !== '0000-00-00 00:00:00') ? moment(rowData.date_back,"YYYY-MM-DD HH:mm").format('ddd Do MMM YY hh:mm A') : '-'}</Text>
                    <Text>{`${rowData.pax} PAX`}</Text>
                </View>
            </ListItem> 
        )
    }

    getMoreMyBooking(){
        this.props.getMoreMyBooking()
        this._getMyBooking()
    }

    _renderFooter(){
        return(
            <View style={styles.footerContainer}>
                <TouchableOpacity style={styles.footerButton} onPress={this.getMoreMyBooking.bind(this)}>
                    <Text style={styles.footerText}>Load More</Text>
                </TouchableOpacity>
            </View>
        )
    }

    _renderHeader(){
        return(
                <Header searchBar rounded >
                    <InputGroup>
                        <Icon name='search' />
                        <Input placeholder='Search Quote' />
                    </InputGroup>
                    <Button>
                        Search
                    </Button>
                </Header>
        )
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
                <View
                    style={styles.list}
                >
                    <List 
                        dataArray={this.props.jobState.fetchMyBooking.data}
                        renderRow={this._renderRow.bind(this)}
                        renderFooter={this._renderFooter.bind(this)}
                        renderHeader={this._renderHeader.bind(this)}
                    >
                    </List>
                </View>
            )
        }
    }

    render(){
        return(
             <Container theme={myTheme} style={{backgroundColor: '#0F2145'}}>
                <Header style={{backgroundColor: '#021535'}}>
                    <Button transparent onPress={this.props.openDrawer}>
                        <Icon name='bars' />
                    </Button>
                    <Title>View My Booking</Title>
                </Header>
                <Content 
                    onScroll={(e)=>{
                        var windowHeight = Dimensions.get('window').height,
                            height = e.nativeEvent.contentSize.height,
                            offset = e.nativeEvent.contentOffset.y;
                        if( windowHeight + offset >= height ){
                            // Trigger loadmore when scroll end 
                            console.log(windowHeight , offset , height)
                        }
                    }}
                >
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
        openDrawer: () => dispatch(openDrawer()),
        pushNewRoute: (route) => dispatch(pushNewRoute(route)),
        closeDrawer: () => dispatch(closeDrawer()),
        loading:()=>dispatch(loading()),
        loaded:()=>dispatch(loaded()),
        setJobId:(jobId)=>dispatch(setJobId(jobId)),
        fetchMyBookingRequest:()=>dispatch(fetchMyBookingRequest()),
        fetchMyBookingError: (error) => dispatch(fetchMyBookingError(error)),
        fetchMyBookingSuccess: (data) => dispatch(fetchMyBookingSuccess(data)),
        getMoreMyBooking: () => dispatch(getMoreMyBooking()),
        resetPageMyBooking: ()=> dispatch(resetPageMyBooking())
    }
}

function mapStateToProps(state){
    return {
        drawer: state.drawer.drawerState,
        load: state.load.loadingState,
        userState: state.user.userState,
        jobState: state.job.jobState
    }
}

export default connect(mapStateToProps, bindAction)(MyBooking)