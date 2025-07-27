import axios from 'axios'

const instance = axios.create({
    baseURL:"http://localhost:3010"
    // baseURL:"https://01wt8cb9-3010.inc1.devtunnels.ms/"

})

instance.interceptors.request.use((config)=>{
    const token = localStorage.getItem('token');
    // console.log(token)
    if(token){
        config.headers['Authorization']= `Bearer ${token}`;
    }
    return config
})

export default instance
