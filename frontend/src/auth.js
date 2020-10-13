import ls from 'local-storage'
import axios from 'axios'

class Auth{
    constructor() {
        this.authenticated = false;
        this.accessToken = null;
        this.authAxios = axios.create({baseURL: 'http://localhost:9000'})
    }


    
    createAxiosResponseInterceptor = () => {
    const interceptor = this.authAxios.interceptors.response.use(response => response, err => {
      if(err.response.status!==401) {
        return Promise.reject(err);
      }
      this.authAxios.interceptors.response.eject(interceptor);
     
      return axios.post('http://localhost:9000/auth/accesstokenrenewal', {withCredentials: true, headers: {
        'Access-Control-Allow-Origin': 'http://localhost:9000',
        'Access-Control-Allow-Credentials': true
      }}).then((response) => {
        if(response.data.accessToken) {
          ls.set('accessToken', response.data.accessToken);
          response.status = 200;
        }
        return response 
      }).catch((err) => {console.log(err)}).finally(this.createAxiosResponseInterceptor); 
     
      

      })
    }
    

    login(accessToken){
        this.accessToken = accessToken;
        ls.set('accessToken', accessToken);
        this.authenticated = true;
       
        
        
    }
    logout(cb){
        this.accessToken = null;
        ls.set('accessToken', null);
        this.authenticated = false;
        
        

    }
    isAuthenticated(){
        return this.authenticated;
        
    }


}

export default new Auth(); 