
import { create } from 'zustand'; import api from '../services/api';
export const useAuthStore = create((set,get)=>({
  token: localStorage.getItem('token')||null, me:null,
  async login(phone,password){ const {data}=await api.post('/api/auth/login',{phone,password}); localStorage.setItem('token',data.token); set({token:data.token}); await get().loadMe(); },
  async register(phone,password,name){ const {data}=await api.post('/api/auth/register',{phone,password,name}); localStorage.setItem('token',data.token); set({token:data.token, me:data.user}); },
  logout(){ localStorage.removeItem('token'); set({token:null,me:null}); },
  async loadMe(){ const {data}=await api.get('/api/me'); set({me:data}); }
}));
