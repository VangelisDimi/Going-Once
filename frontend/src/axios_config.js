import axios from 'axios'

// Global axios settings
const instance = axios.create({
    baseURL: 'http://localhost:8000/'
});

export default instance