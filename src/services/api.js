import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:8080'
});

// Har request mein token automatically add karo
API.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

// Auth APIs
export const registerUser = (data) =>
    API.post('/api/auth/register', data);

export const loginUser = (data) =>
    API.post('/api/auth/login', data);

// Donor APIs — email parameter hata diya!
export const saveDonorProfile = (data) =>
    API.post('/api/donors/profile', data);

export const getMyProfile = () =>
    API.get('/api/donors/profile');

export const toggleAvailability = () =>
    API.patch('/api/donors/availability');

export const searchDonors = (city, bloodGroup) =>
    API.get(`/api/donors/search?city=${city}&bloodGroup=${bloodGroup}`);

// Request APIs — email parameter hata diya!
export const sendRequest = (data) =>
    API.post('/api/requests', data);

export const getSentRequests = () =>
    API.get('/api/requests/sent');

export const getReceivedRequests = () =>
    API.get('/api/requests/received');

export const updateRequestStatus = (id, status) =>
    API.patch(`/api/requests/${id}/status?status=${status}`);