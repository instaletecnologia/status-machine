import { create } from 'apisauce';

const configUrl = window.STATUS_MACHINE_BASE_URL.split('?');

export const baseUrl = configUrl[0];
export const paramsUrl = configUrl[1];

const api = create({
  baseURL: baseUrl,
});

export default api;
