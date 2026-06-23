import axios from 'axios';

const crudClient = axios.create({
  baseURL: process.env.CRUD_SERVICE_URL ?? 'http://localhost:4017',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

crudClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message ?? error.message;
    const status = error.response?.status ?? 500;

    const serviceError = new Error(message) as Error & { statusCode: number };
    serviceError.statusCode = status;
    return Promise.reject(serviceError);
  }
);

export default crudClient;
