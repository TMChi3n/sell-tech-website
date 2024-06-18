import axios from 'axios';

const url = axios.create({
  baseURL: 'http://localhost:8080/api/v1',
});

export default url;
