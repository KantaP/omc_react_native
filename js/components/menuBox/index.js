import React , { Component } from 'react'
import { TouchableOpacity , View , Text } from 'react-native'
import { Content , Icon } from 'native-base'
import { Grid , Row , Col } from "react-native-easy-grid"

export default class MenuBox extends Component {
    
    propTypes: {
        width: React.PropTypes.number,
        height: React.PropTypes.number,
        boxColor: React.PropTypes.string,
        icon: React.PropTypes.string,
        text: React.PropTypes.string,
        iconColor: React.PropTypes.string,
        textColor: React.PropTypes.string,
        onPress: React.PropTypes.func
    }

    constructor(props){
        super(props)
    }

    render(){

        return(
            <View 
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 10
            }}
            >
            <TouchableOpacity onPress = {this.props.onPress}>
                    <Content style={{
                        width: this.props.width,
                        height: this.props.height,
                        backgroundColor: this.props.boxColor,
                    }}>
                        <Grid style={
                            {
                                width: this.props.width,
                                height: this.props.height, 
                                alignItems:'center' , 
                                justifyContent:'center'
                            }
                        }>
                            <Row size={2} style={{marginTop:this.props.height / 5}}>
                                <Icon name={this.props.icon} style={{fontSize:72,color:this.props.iconColor}} />
                            </Row>
                            <Row size={2}>
                                <Text style={{color:(this.props.textColor) ? this.props.textColor : '#fff'}}>{this.props.text}</Text>
                            </Row>
                        </Grid>
                    </Content>
                </TouchableOpacity>
            </View>
        )
    }
}


