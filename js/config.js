'use strict'
import { Dimensions } from 'react-native'

export const { width, height } = Dimensions.get('window')
export const ASPECT_RATIO = width / height
export const LATITUDE_DELTA = 0.0922

export const region = {
    latitude: 51.508530,
    longitude: -0.076132,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LATITUDE_DELTA * ASPECT_RATIO
}

export const googleApiKey = 'AIzaSyAHjTmv4N_xSZp5EMsI6-iDWFs37edVRGg'

export const server = 'dev'
export const api = 'dev'
export const apiServer = {
    dev: '192.168.1.10:3000',
    prod: 'webservice.ecoachmanager.com'
}

export const website = 'journey.local.ppcnseo.com'
    // export const website = 'booking.omc.uk.com'
export const siteId = 232
    // export const siteId = 348

export const apiKey = {
    dev: 'eyJhbGciOiJIUzI1NiJ9.Ung3OA.FtKwL5314bTX6aCA3NQD2ZqvpQ4Z7RhuTo_GwdyywYc',
    prod: 'eyJhbGciOiJIUzI1NiJ9.Ung3OA.eKhHJd9-UlK8eCybJxP8kMyJynV-3ojuG6vTaNe1isA'
}