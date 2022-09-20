import {useEffect,createContext,useState} from 'react';
import  AxiosPrivate,{axios} from './axios_config'
import moment from 'moment'

const RequestContext = createContext();

const RequestInfo = ({children}) => {
    const axios = AxiosPrivate();

    const contextData = {
        getUserList: getUserList,
        createAuction: createAuction,
        getAuctionList: getAuctionList,
        getAuction: getAuction
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
        data.append("started",moment(event.target.start_date.value).toISOString())
        data.append("ends",moment(event.target.end_date.value).toISOString())
        data.append("description",event.target.description.value)
        data.append("latitude",event.target.lat.value)
        data.append("longitude",event.target.lng.value)
        //Images
        for(const file of event.target.images.files){
            data.append("image",file)
        }

        return axios.post('/auctions/create/',data);
    }

    function getAuctionList(page,items){
        return axios.get('/auctions/getlist/',{
            params: {
                page: page,
                items: items
            }
        })
    }

    function getAuction(id){
        return axios.get('/auctions/get/',{
            params: {
                id:id
            }
        });
    }
}

export default RequestContext;
export {RequestInfo};