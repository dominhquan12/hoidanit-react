import axios from "axios";

const instance = axios.create({
  baseURL: 'https://reqres.in',
});
instance.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response.data ? response.data : { statusCode: response.status };
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  let res = {}
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    res.data = error.response.data
    res.status = error.response.status
    res.headers = error.response.headers
  } else if (error.request) {
    console.log(error.request);
  } else {
    console.log('Error', error.message);
  }
  return res
  // return Promise.reject(error);
});
export default instance