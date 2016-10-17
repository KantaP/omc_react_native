'use strict'

import type { Action } from '../actions/types'
import { 
    SET_JOB_ID , 
    FETCH_MY_QUOTES_REQUEST , 
    FETCH_MY_QUOTES_SUCCESS , 
    FETCH_MY_QUOTES_ERROR ,
    SET_QUOTE_FORM_PART_1 ,
    SET_QUOTE_FORM_PART_2 , 
    FETCH_MORE_MY_QUOTES , 
    FETCH_MY_BOOKING_ERROR,
    FETCH_MY_BOOKING_REQUEST,
    FETCH_MY_BOOKING_SUCCESS ,
    RESET_PAGE_MY_QUOTES ,
    FETCH_MORE_MY_BOOKING ,
    RESET_PAGE_MY_BOOKING
} from '../actions/job'

export type State = {
    jobState: Object
}

const initialState = {
    jobState: {
        jobId: 0,
        fetchMyQuotes: {
            isFetch: false,
            data: [],
            error: {},
            page: 1
        },
        fetchMyBooking: {
            isFetch: false,
            data: [],
            error: {},
            page: 1
        },
        createJob:{
            partOne: null,
            partTwo: null,
            creating: false
        }
    }
}

export default function(state:State = initialState , action:Action):State{
    if(action.type === SET_JOB_ID){
        return Object.assign(
            {},
            state,
            {
                jobState: Object.assign(
                    {},
                    state.jobState,
                    {
                        jobId: action.jobId
                    }
                )
            }
        )
    }else if(action.type === FETCH_MY_QUOTES_REQUEST){
        return Object.assign(
            {},
            state,
            {
                jobState: Object.assign(
                    {},
                    state.jobState,
                    {
                        fetchMyQuotes: Object.assign(
                            {},
                            state.jobState.fetchMyQuotes,
                            {
                                isFetch: true,
                                error: {}
                            }
                        )
                    }
                )
            }
        )
    }else if(action.type === FETCH_MY_QUOTES_SUCCESS){
        return Object.assign(
            {},
            state,
            {
                jobState: Object.assign(
                    {},
                    state.jobState,
                    {
                        fetchMyQuotes: Object.assign(
                            {},
                            state.jobState.fetchMyQuotes,
                            {
                                isFetch: false,
                                data: action.data,
                                error: {}
                            }
                        )
                    }
                )
            }
        )
    }else if(action.type === FETCH_MY_QUOTES_ERROR){
        return Object.assign(
            {},
            state,
            {
                jobState: Object.assign(
                    {},
                    state.jobState,
                    {
                        fetchMyQuotes: Object.assign(
                            {},
                            state.jobState.fetchMyQuotes,
                            {
                                isFetch: false,
                                data: [],
                                error: action.error
                            }
                        )
                    }
                )
            }
        )
    }else if(action.type === FETCH_MY_BOOKING_REQUEST){
        return Object.assign(
            {},
            state,
            {
                jobState: Object.assign(
                    {},
                    state.jobState,
                    {
                        fetchMyBooking: Object.assign(
                            {},
                            state.jobState.fetchMyBooking,
                            {
                                isFetch: true,
                                error: {}
                            }
                        )
                    }
                )
            }
        )
    }else if(action.type === FETCH_MY_BOOKING_SUCCESS){
        return Object.assign(
            {},
            state,
            {
                jobState: Object.assign(
                    {},
                    state.jobState,
                    {
                        fetchMyBooking: Object.assign(
                            {},
                            state.jobState.fetchMyBooking,
                            {
                                isFetch: false,
                                data: action.data ,
                                error: {}
                            }
                        )
                    }
                )
            }
        )
    }else if(action.type === FETCH_MY_BOOKING_ERROR){
        return Object.assign(
            {},
            state,
            {
                jobState: Object.assign(
                    {},
                    state.jobState,
                    {
                        fetchMyBooking: Object.assign(
                            {},
                            state.jobState.fetchMyBooking,
                            {
                                isFetch: false,
                                data: [],
                                error: action.error
                            }
                        )
                    }
                )
            }
        )
    }else if(action.type === SET_QUOTE_FORM_PART_1){
        return Object.assign(
            {},
            state,
            { 
                jobState: Object.assign(
                    {},
                    state.jobState,
                    {
                        createJob: Object.assign(
                            {},
                            state.jobState.createJob,
                            {
                                partOne: action.data
                            }
                        )
                    }
                )
            }
        )
    }else if(action.type === SET_QUOTE_FORM_PART_2){
        return Object.assign(
            {},
            state,
            {
                jobState: Object.assign(
                    {},
                    state.jobState,
                    {
                        createJob: Object.assign(
                            {},
                            state.jobState.createJob,
                            {
                                partTwo: action.data
                            }
                        )
                    }
                )
            }
        )
    }else if(action.type === FETCH_MORE_MY_QUOTES){
        return Object.assign(
            {},
            state,
            {
                jobState: Object.assign(
                    {},
                    state.jobState,
                    {
                        fetchMyQuotes: Object.assign(
                            {},
                            state.jobState.fetchMyQuotes,
                            {
                                page: state.jobState.fetchMyQuotes.page + 1
                            }
                        )
                    }
                )
            }
        )
    }else if(action.type === RESET_PAGE_MY_QUOTES){
        return Object.assign(
            {},
            state,
            {
                jobState: Object.assign(
                    {},
                    state.jobState,
                    {
                        fetchMyQuotes: Object.assign(
                            {},
                            state.jobState.fetchMyQuotes,
                            {
                                page: 1
                            }
                        )
                    }
                )
            }
        )
    }else if(action.type === FETCH_MORE_MY_BOOKING){
        return Object.assign(
            {},
            state,
            {
                jobState: Object.assign(
                    {},
                    state.jobState,
                    {
                        fetchMyBooking: Object.assign(
                            {},
                            state.jobState.fetchMyBooking,
                            {
                                page: state.jobState.fetchMyBooking.page + 1
                            }
                        )
                    }
                )
            }
        )
    }else if(action.type === RESET_PAGE_MY_BOOKING){
        return Object.assign(
            {},
            state,
            {
                jobState: Object.assign(
                    {},
                    state.jobState,
                    {
                        fetchMyBooking: Object.assign(
                            {},
                            state.jobState.fetchMyBooking,
                            {
                                page: 1
                            }
                        )
                    }
                )
            }
        )
    }
    else{
        return state
    }
}