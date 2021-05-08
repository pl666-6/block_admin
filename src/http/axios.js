import axios from 'axios';
import qs from 'qs'
import { getToken } from '@/utils/auth';

axios.defaults.baseURL = 'http://10.0.7.57:8002/'
axios.defaults.headers.post['Content-Type']='application/x-www-form-urlencoded;charset=UTF-8'
axios.defaults.headers.common['Authorization'] = getToken()
axios.interceptors.request.use((config)=>{
	if(config.method == 'post'){
		config.data = qs.stringify(config.data,{arrayFormat:'repeat'});
	}
	return config;
})

export default axios;