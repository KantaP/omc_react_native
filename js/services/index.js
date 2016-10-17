import * as Config from '../config'
import moment from 'moment'
import { getQuoteParams } from '../params'

export function _geolocationService ({latitude,longitude}){
    return new Promise((resolve,reject)=>{
        try {
            fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${Config.googleApiKey}`)
            .then((data)=>data.json())
            .then((response)=>resolve(response))
        } catch(error) {
            reject(error)
        }
    })
}

export function distanceMatrixService (origins,destinations){
    console.log(origins, destinations)
    return new Promise((resolve,reject)=>{
        try{
            fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${origins}&destinations=${destinations}&key=${Config.googleApiKey}`)
            .then((data)=>data.json())
            .then((response)=>resolve(response))
        }catch(error){
            reject(error)
        }
    })
} 

function reset(prototypeParams){
    prototypeParams.movement_tab = []
    prototypeParams.movement_uname = []
    prototypeParams.is_start = {}
    prototypeParams.stay_price = {}
    prototypeParams.collection_date = []
    prototypeParams.collection_address = []
    prototypeParams.collection_lat = [] 
    prototypeParams.collection_lng = []
    prototypeParams.destination_address = []
    prototypeParams.destination_lat = []
    prototypeParams.destination_lng = []
    prototypeParams.count_drop = []
    prototypeParams.mileages = []
    prototypeParams.durations = []
    return prototypeParams
}


export async function _compareParams(params,userData){
    try{
        let prototypeParams = {} 
        let { origin , destination } = ''
        let result = null 
        prototypeParams = Object.assign({},  prototypeParams , getQuoteParams)
        prototypeParams = reset(prototypeParams)
        if(params.pickup !== '') {
            prototypeParams.movement_tab.push(1)
            let key = Math.random().toString(36).substr(1, 5)
            prototypeParams.movement_uname.push(key)
            prototypeParams.is_start[key] = 1
            prototypeParams.stay_price[key] = 3
            prototypeParams.collection_date.push(params.pickup)
            prototypeParams.single = 1
            if(params.collection.value !== '') {
                prototypeParams.collection_address.push(params.collection.value)
                if(typeof params.collection.region == 'object'){
                    prototypeParams.collection_lat.push(params.collection.region.latitude)
                    prototypeParams.collection_lng.push(params.collection.region.longitude)
                }else{
                    throw new TypeError('Problem about data')
                }
                origin = params.collection.value.replace(/(,)|( )/g,"+")
            }
            if(params.extra.length > 0){
                for(let index in params.extra){
                    let data = params.extra[index]
                    let previousData = params.extra[index-1]
                    if(typeof data !== 'undefined'){
                        if(data.drop == 1 || data.drop == 3){
                            if(index == 0 ){
                                prototypeParams.count_drop.push(1)
                                prototypeParams.destination_address.push(data.value)
                                if(typeof data.region == 'object'){
                                    prototypeParams.destination_lat.push(data.region.latitude)
                                    prototypeParams.destination_lng.push(data.region.longitude)
                                }else{
                                    throw new TypeError('Problem about data')
                                }
                                destination = data.value.replace(/(,)|( )/g,"+")
                                result = await distanceMatrixService(origin,destination) 
                                await prototypeParams.mileages.push(result.rows[0].elements[0].distance.text.split(' ')[0])
                                await prototypeParams.durations.push((result.rows[0].elements[0].duration.value * 0.00027778).toFixed(2))
                            }else{
                                origin = previousData.value.replace(/(,)|( )/g,"+")
                                prototypeParams.collection_address.push(previousData.value)
                                if(typeof previousData.region == 'object'){
                                    prototypeParams.collection_lat.push(previousData.region.latitude)
                                    prototypeParams.collection_lng.push(previousData.region.longitude)
                                }else{
                                    throw new TypeError('Problem about data')
                                }
                                prototypeParams.collection_date.push(moment().format('YYYY-MM-DD HH:mm'))
                                prototypeParams.movement_tab.push(1)
                                let key = Math.random().toString(36).substr(2, 5)
                                prototypeParams.movement_uname.push(key)
                                prototypeParams.is_start[key] = 0
                                prototypeParams.stay_price[key] = 3
                                prototypeParams.count_drop.push(1)
                                prototypeParams.destination_address.push(data.value)
                                if(typeof data.region == 'object'){
                                    prototypeParams.destination_lat.push(data.region.latitude)
                                    prototypeParams.destination_lng.push(data.region.longitude)
                                }else{
                                    throw new TypeError('Problem about data')
                                }
                                destination = data.value.replace(/(,)|( )/g,"+")
                                result = await distanceMatrixService(origin,destination) 
                                await prototypeParams.mileages.push(result.rows[0].elements[0].distance.text.split(' ')[0])
                                await prototypeParams.durations.push((result.rows[0].elements[0].duration.value * 0.00027778).toFixed(2))
                            }

                            if(index == (params.extra.length-1)){
                                origin = data.value.replace(/(,)|( )/g,"+")
                                prototypeParams.collection_address.push(data.value)
                                if(typeof data.region == 'object'){
                                    prototypeParams.collection_lat.push(data.region.latitude)
                                    prototypeParams.collection_lng.push(data.region.longitude)
                                }
                                prototypeParams.collection_date.push(moment().format('YYYY-MM-DD HH:mm'))
                                prototypeParams.movement_tab.push(1)
                                let key = Math.random().toString(36).substr(2, 5)
                                prototypeParams.movement_uname.push(key)
                                prototypeParams.is_start[key] = 0
                                prototypeParams.stay_price[key] = 3
                            }
                        }
                    }else{
                        throw new TypeError('Problem about data')
                    }
                }
            }
            if(params.destination.value !== '') {
                destination = params.destination.value.replace(/(,)|( )/g,"+")
                prototypeParams.destination_address.push(params.destination.value)
                if(typeof params.destination.region == 'object'){
                    prototypeParams.destination_lat.push(params.destination.region.latitude)
                    prototypeParams.destination_lng.push(params.destination.region.longitude)
                }
                result = await distanceMatrixService(origin,destination) 
                prototypeParams.mileages.push(result.rows[0].elements[0].distance.text.split(' ')[0])
                prototypeParams.durations.push((result.rows[0].elements[0].duration.value * 0.00027778).toFixed(2))
            }else{
                throw new TypeError('Problem about data')
            }
        }
        if(params.return !== '') {
            prototypeParams.movement_tab.push(1)
            let key = Math.random().toString(36).substr(2, 5)
            prototypeParams.movement_uname.push(key)
            prototypeParams.is_start[key] = 1
            prototypeParams.stay_price[key] = 3
            prototypeParams.collection_date.push(params.return)
            prototypeParams.single = 2
            if(params.destination.value !== '') {
                prototypeParams.collection_address.push(params.destination.value)
                if(typeof params.collection.region == 'object'){
                    prototypeParams.collection_lat.push(params.destination.region.latitude)
                    prototypeParams.collection_lng.push(params.destination.region.longitude)
                }
                origin = params.destination.value.replace(/(,)|( )/g,"+")
            }else{
                throw new TypeError('Problem about data')
            }
            if(params.extra.length > 0){
                params.extra = params.extra.reverse()
                for(let index in params.extra){
                    let data = params.extra[index]
                    let previousData = params.extra[index-1]
                    if(typeof data !== 'undefined'){
                        if(data.drop == 1 || data.drop == 3){
                            if(index == 0 ){
                                prototypeParams.count_drop.push(1)
                                prototypeParams.destination_address.push(data.value)
                                if(typeof data.region == 'object'){
                                    prototypeParams.destination_lat.push(data.region.latitude)
                                    prototypeParams.destination_lng.push(data.region.longitude)
                                }else{
                                    throw new TypeError('Problem about data')
                                }
                                destination = data.value.replace(/(,)|( )/g,"+")
                                result = await distanceMatrixService(origin,destination) 
                                await prototypeParams.mileages.push(result.rows[0].elements[0].distance.text.split(' ')[0])
                                await prototypeParams.durations.push((result.rows[0].elements[0].duration.value * 0.00027778).toFixed(2))
                            }else{
                                origin = previousData.value.replace(/(,)|( )/g,"+")
                                prototypeParams.collection_address.push(previousData.value)
                                if(typeof previousData.region == 'object'){
                                    prototypeParams.collection_lat.push(previousData.region.latitude)
                                    prototypeParams.collection_lng.push(previousData.region.longitude)
                                }else{
                                    throw new TypeError('Problem about data')
                                }
                                prototypeParams.collection_date.push(moment().format('YYYY-MM-DD HH:mm'))
                                prototypeParams.movement_tab.push(1)
                                let key = Math.random().toString(36).substr(2, 5)
                                prototypeParams.movement_uname.push(key)
                                prototypeParams.is_start[key] = 0
                                prototypeParams.stay_price[key] = 3
                                prototypeParams.count_drop.push(1)
                                prototypeParams.destination_address.push(data.value)
                                if(typeof data.region == 'object'){
                                    prototypeParams.destination_lat.push(data.region.latitude)
                                    prototypeParams.destination_lng.push(data.region.longitude)
                                }else{
                                    throw new TypeError('Problem about data')
                                }
                                destination = data.value.replace(/(,)|( )/g,"+")
                                result = await distanceMatrixService(origin,destination) 
                                await prototypeParams.mileages.push(result.rows[0].elements[0].distance.text.split(' ')[0])
                                await prototypeParams.durations.push((result.rows[0].elements[0].duration.value * 0.00027778).toFixed(2))
                            }

                            if(index == (params.extra.length-1)){
                                origin = data.value.replace(/(,)|( )/g,"+")
                                prototypeParams.collection_address.push(data.value)
                                if(typeof data.region == 'object'){
                                    prototypeParams.collection_lat.push(data.region.latitude)
                                    prototypeParams.collection_lng.push(data.region.longitude)
                                }
                                prototypeParams.collection_date.push(moment().format('YYYY-MM-DD HH:mm'))
                                prototypeParams.movement_tab.push(1)
                                let key = Math.random().toString(36).substr(2, 5)
                                prototypeParams.movement_uname.push(key)
                                prototypeParams.is_start[key] = 0
                                prototypeParams.stay_price[key] = 3
                            }
                        }
                    }else{
                        throw new TypeError('Problem about data')
                    }
                }
            }
            if(params.collection.value !== '') {
                destination = params.collection.value.replace(/(,)|( )/g,"+")
                prototypeParams.destination_address.push(params.collection.value)
                if(typeof params.collection.region == 'object'){
                    prototypeParams.destination_lat.push(params.collection.region.latitude)
                    prototypeParams.destination_lng.push(params.collection.region.longitude)
                }else{
                    throw new TypeError('Problem about data')
                }
                result = await distanceMatrixService(origin,destination) 
                prototypeParams.mileages.push(result.rows[0].elements[0].distance.text.split(' ')[0])
                prototypeParams.durations.push((result.rows[0].elements[0].duration.value * 0.00027778).toFixed(2))
            }
        }

        prototypeParams.date_require = moment().format('YYYY-MM-DD HH:mm')
        prototypeParams.list2 = params.pax
        prototypeParams.list1 = params.vehicle
        prototypeParams.list3 = params.luggage
        prototypeParams.default_journey_id = params.journeyType
        prototypeParams.site_id = Config.siteId
        prototypeParams.name = userData.name
        prototypeParams.email = userData.username
        prototypeParams.phone_m = userData.phone_m
        prototypeParams.car_id = params.vehicle
        prototypeParams.num_id = params.pax
        prototypeParams.bag_id = params.luggage
        prototypeParams.ext_ref = params.ext_ref
        return prototypeParams

    }catch(error){
        Alert.alert(``,`${error}`)
    }
}

export function _buildQueryMileDuration({mileages,durations},movements){
    return new Promise((resolve,reject)=>{
        let queryString = ''
        movements.forEach((data , index)=>{
            queryString += `&mileage[${data.movement_id.toString()}]=${mileages[index]}&mileage_n[${data.movement_id.toString()}]=${mileages[index]}`
            queryString += `&duration[${data.movement_id.toString()}]=${durations[index]}&duration_n[${data.movement_id.toString()}]=${durations[index]}`
        })
        resolve(queryString)
    })
    
}