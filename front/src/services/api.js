
import axios from 'axios'; import { useAuthStore } from '../store/auth';
const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8088', timeout: 10000 });
api.interceptors.request.use(cfg=>{ const t = useAuthStore.getState().token; if(t) cfg.headers.Authorization = 'Bearer '+t; return cfg; });
export default api;
