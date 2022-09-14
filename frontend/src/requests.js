import {useEffect,createContext,useState} from 'react';
import  AxiosPrivate,{axios} from './axios_config'

const RequestContext = createContext();

const RequestInfo = ({children}) => {
    const axios = AxiosPrivate();

    const contextData = {
        getUserList: getUserList,
        createAuction: createAuction
    };

    return(
        <RequestContext.Provider value={contextData}>
            {children}
        </RequestContext.Provider>
    );

    function getUserList(){
        return axios.get('/users/admin/getuserslist/')
        // .then(res => {
        //     return res;
        // })
    }

    function createAuction(event,categories){
        const data = new FormData();
        data.append("name",event.target.name.value)
        for(const category of categories){
            data.append("category",category);
        }
        data.append("first_bid",event.target.start_bid.value)
        data.append("location",event.target.location.value)
        data.append("country",event.target.country.value)
        data.append("started",event.target.start_date.value)
        data.append("ends",event.target.end_date.value)
        data.append("description",event.target.description.value)
        data.append("latitude",event.target.lat.value)
        data.append("longitude",event.target.lng.value)
        //Images
        for(const file of event.target.images.files){
            data.append("image",file)
        }

        return axios.post('/auctions/create/',data);
    }
}

export default RequestContext;
export {RequestInfo};