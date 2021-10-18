import axios, { Method } from "axios";

const rest = (method: Method) => {
  return async (url: string, { body = {}, header = {}, token = "" } = {}) => {
    try {
      let response: any;
      if (method === "GET") {
        response = await axios.get(url, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            ...header,
          },
        });
      } else {
        response = await axios(url, {
          method: method,
          data: body,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            ...header,
          },
        });
      }
      const { data } = response;
      return {
        code: 200,
        data: data,
      };
    } catch (err) {
      const { response } = err;

      return {
        code: response.status,
        data: null,
      };
    }
  };
};

const api = {
  get: rest("GET"),
  post: rest("POST"),
  put: rest("PUT"),
  delete: rest("DELETE"),
};

export default api;
