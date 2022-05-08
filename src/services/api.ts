import axios from 'axios'

const api = axios.create({
  baseURL: 'https://agromarket-app.herokuapp.com'
})

export default api;