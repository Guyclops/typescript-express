import axios, { Method } from "axios";

const rest = (method: Method) => {
  return async (url: string, { body = {}, header = {}, token = "" } = {}) => {
    try {
      let response;
      if (method === "GET") {
        response = await axios.get(`${url}`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "x-access-token": token,
            ...header,
          },
        });
      } else {
        response = await axios(`${url}`, {
          method: method,
          data: body,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "x-access-token": token,
            ...header,
          },
        });
      }
      const { data } = response;
      return data;
    } catch (err) {
      const { response } = err;
      // 403: token이 인증되지 않을경우 로그인 화면으로 네비게이팅
      if (response.status === 403) {
      }
      return response;
    }
  };
};

class Api {
  get: Function;
  post: Function;
  put: Function;
  delete: Function;

  constructor() {
    this.get = rest("GET");
    this.post = rest("POST");
    this.put = rest("PUT");
    this.delete = rest("DELETE");
  }
}

export default new Api();
