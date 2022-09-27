import {createContext} from 'react';
import  AxiosPrivate from './axios_config'
import moment from 'moment'

const RequestContext = createContext();

const RequestInfo = ({children}) => {
    const axios = AxiosPrivate();

    const contextData = {
        getUserList: getUserList,
        getAdminList: getAdminList,
        approveUser: approveUser,
        createAuction: createAuction,
        getAuctionNavigateList: getAuctionNavigateList,
        getAuctionManageList: getAuctionManageList,
        getAuction: getAuction,
        updateAuction: updateAuction,
        deleteAuction: deleteAuction,
        exportJSON: exportJSON,
        exportXML: exportXML,
        submitBid: submitBid,
        getCategoryList: getCategoryList
    };

    return(
        <RequestContext.Provider value={contextData}>
            {children}
        </RequestContext.Provider>
    );

    function getUserList(page,items){
        return axios.get('/users/admin/getuserslist/',{
            params: {
                page: page,
                items: items
            }
        });
    }

    function getAdminList(page,items){
        return axios.get('/users/admin/getadminslist/',{
            params: {
                page: page,
                items: items
            }
        });
    }

    function approveUser(user_id){
        const data = new FormData();
        data.append("user_id",user_id)
        return axios.patch('/users/admin/approveuser/',data);
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

    function getAuctionNavigateList(page,items,categories,location,description,min_price,max_price,parent_category){
        var params  = {
            page: page,
            items: items,
            location: location,
            description: description,
            min_price: min_price,
            max_price: max_price,
            parent_category: parent_category
        }
        for(let key in params){
            if(params[key]===null || params[key]===undefined) 
                delete params[key]
        }
        params= new URLSearchParams(params).toString()

        for(var category of categories){
            if(params===''){
                params = `category=${category}`
            }
            params = params + `&category=${category}`
        }
        params= '?' + params

        return axios.get('/auctions/getlistnavigate/' + params)
    }

    function getAuctionManageList(page,items){
        return axios.get('/auctions/getlistmanage/',{
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

    function updateAuction(event,categories,id){
        const data = new FormData();
        data.append("id",id)
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
        /* To-do: Add option to update auction images */

        return axios.patch('/auctions/update/',data);
    }

    function deleteAuction(id){
        const data = new FormData();
        data.append("id",id);
        return axios.delete('/auctions/delete/',{ data: data });
    }

    function exportJSON(auction_id){
        return axios.get('/auctions/exportjson/',{
            params: {
                id:auction_id
            }
        });
    }

    function exportXML(auction_id){
        return axios.get('/auctions/exportxml/',{
            params: {
                id:auction_id
            }
        });
    }

    function submitBid(event,auction_id){
        const data = new FormData();
        data.append("id",auction_id);
        data.append("amount",event.target.amount.value);

        return axios.post('/auctions/addbid/',data);
    }

    function getCategoryList(page,items){
        return axios.get('/auctions/categorylist/',{
            params: {
                page: page,
                items: items
            }
        })
    }
}

export default RequestContext;
export {RequestInfo};