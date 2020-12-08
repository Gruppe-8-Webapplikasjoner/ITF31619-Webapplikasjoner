import http from './http';
import {getCsrfToken} from './loginService';

const API_URL = '/articles';

export const list = async (filter, limit, page, searchTerm) => {
  try {
    if (filter === null) {
      return await http.get(
        `${API_URL}?limit=${limit}&page=${page}&q=${searchTerm}`
      );
    }
    return await http.get(
      `${API_URL}?category=${filter}&limit=${limit}&page=${page}&q=${searchTerm}`
    );
  } catch (err) {
    return err.response;
  }
};

export const get = async (id) => {
  try {
    return await http.get(`${API_URL}/${id}`);
  } catch (err) {
    return err.response;
  }
};

export const create = async (data) => {
  await getCsrfToken();
  try {
    return await http.post(`${API_URL}`, data);
  } catch (err) {
    return err.response;
  }
};

export const updateArticle = async (id, data) => {
  try {
    return await http.put(`${API_URL}/${id}`, data);
  } catch (err) {
    return err.response;
  }
};

export const deleteArticle = async (id) => {
  try {
    return await http.delete(`${API_URL}/${id}`);
  } catch (err) {
    return err.response;
  }
};

export default {
  create,
  list,
  get,
};
