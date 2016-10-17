import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Dimensions , TouchableOpacity , Alert  , TextInput} from 'react-native'
import { openDrawer , closeDrawer } from '../../actions/drawer'
import { pushNewRoute } from '../../actions/route'
import { setJobId , fetchMyQuotesRequest , fetchMyQuotesError , fetchMyQuotesSuccess , getMoreMyQuotes , resetPageMyQuotes } from '../../actions/job'
import { Container, Header , Content, View, Text, Title , InputGroup, Input ,Button, Icon , Thumbnail , Footer , List, ListItem  , Spinner , } from 'native-base'
import { Grid, Col, Row } from 'react-native-easy-grid'
import myTheme from '../../themes/base-theme'
import styles from './styles'
import moment from 'moment'
import { loading , loaded } from '../../actions/loading'
import * as Config from '../../config'

class MyQuotes extends Component {
    constructor(props){
        super(props)
    }

    shouldComponentUpdate(nextProps){
        if(this.props.jobState != nextProps.jobState){
            return true
        }else if(this.props.load !== nextProps.load){
            return true
        }else {
            return false
        }
    }

    componentDidMount(){
        setTimeout(()=>this.props.loading(),33)
        setTimeout(()=>{
            this.props.resetPageMyQuotes()
            this._getMyQuotes()
        },1000)
    
    } 

    navigateTo(route) {
        this.props.closeDrawer() 
        this.props.pushNewRoute(route)
    } 

    _goToStepTwo(jobId){
        this.props.setJobId(jobId)
        this.navigateTo('myQuotesStepTwo')
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

    getMoreMyQuotes(){
        this.props.getMoreMyQuotes()
        this._getMyQuotes()
    }

    async _getMyQuotes(){
        this.props.fetchMyQuotesRequest() 
        this.props.loading()
        let options = {
            method: 'GET',
            headers: {  
                "cache-control": "no-cache",
                "x-access-key" : Config.apiKey[Config.api],
                "x-access-token": this.props.userState.token
            }
        }
        let response = await fetch(`http://${Config.apiServer[Config.server]}/api/omc/job/getMyQuotes/${this.props.jobState.fetchMyQuotes.page}`, options)
        let responseJson = await response.json()
        let responseStatus = await response.status
        if(responseStatus === 200){
            this.props.fetchMyQuotesSuccess(responseJson.results)
        }else if(responseStatus === 404){
            this.props.fetchMyQuotesError(responseJson.text)
        }
        this.props.loaded()
    }

    async _getMyQuote(search){
        console.log(search)
        this.props.fetchMyQuotesRequest() 
        let options = {
            method: 'GET',
            headers: {  
                "cache-control": "no-cache",
                "x-access-key" : Config.apiKey[Config.api],
                "x-access-token": this.props.userState.token
            }
        }
        let response = await fetch(`http://${Config.apiServer[Config.server]}/api/omc/job/getMyQuote/${search}`, options)
        let responseJson = await response.json()
        let responseStatus = await response.status
        if(responseStatus === 200){
            this.props.fetchMyQuotesSuccess(responseJson.results)
        }else if(responseStatus === 404){
            this.props.fetchMyQuotesError(responseJson.text)
        }
    }

    _renderRow(rowData){

        return (
            <ListItem button onPress={()=>this._goToStepTwo(rowData.quote_id)}>
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

    _renderFooter(){
            return(
                <View style={styles.footerContainer}>
                    <TouchableOpacity style={styles.footerButton} onPress={this.getMoreMyQuotes.bind(this)}>
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
                        <Input placeholder='Search Quote' keyboardType={'numeric'} onChangeText={(text)=>this._getMyQuote.bind(this,text)}/>
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
                        dataArray={this.props.jobState.fetchMyQuotes.data}
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
                    <Title>View My Quotes</Title>
                </Header>
                <Content>
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
        fetchMyQuotesRequest:()=>dispatch(fetchMyQuotesRequest()),
        fetchMyQuotesError: (error) => dispatch(fetchMyQuotesError(error)),
        fetchMyQuotesSuccess: (data) => dispatch(fetchMyQuotesSuccess(data)),
        getMoreMyQuotes: () => dispatch(getMoreMyQuotes()),
        resetPageMyQuotes: () => dispatch(resetPageMyQuotes())
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

export default connect(mapStateToProps, bindAction)(MyQuotes)