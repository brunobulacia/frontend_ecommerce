import axios from 'axios';

export const API_URL = 'http://localhost:8000/tasks/api/v1/';

export const getTasks = async () => axios.get(`${API_URL}tasks/`)
