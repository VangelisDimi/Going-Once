import axios from 'axios'

// Global axios settings
const axios_ins = axios.create({
    baseURL: 'http://localhost:8000/'
});

function login(event) {
    const data = new FormData();
    data.append("username",event.target.username.value)
    data.append("password",event.target.password.value)

    axios_ins.post(`users/token/`,data
    )
    .then(res => {
        localStorage.setItem('authTokens', JSON.stringify(res.data));
    })
    .catch(function (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
        } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }
        console.log(error.config);
    });
};

function signup(event) {
    const data = new FormData();
    data.append("username",event.target.username.value)
    data.append("password",event.target.password.value)
    data.append("first_name",event.target.first_name.value)
    data.append("last_name",event.target.last_name.value)
    data.append("email",event.target.email.value)
    data.append("phone_number",event.target.phone.value)
    data.append("street_name",event.target.street_name.value)
    data.append("street_number",event.target.street_number.value)
    data.append("postal_code",event.target.postal_code.value)
    data.append("country",event.target.country.value)
    data.append("location",event.target.location.value)
    data.append("tin",event.target.tin.value)

    axios_ins.post(`users/register/`,data
    )
    .then(res => {
        console.log(res);
    })
    .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
        console.log(error.config);
    });
}

export {login,signup};