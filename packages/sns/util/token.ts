import jwt from "jsonwebtoken";

export const encodeToken = (payload: any, privateKey: string, option?: any) => {
  try {
    const res = jwt.sign(payload, privateKey, option);
    return res;
  } catch (e) {
    throw e;
  }
};

export const verifyToken = (token: string, key: string, options = {}) => {
  try {
    const decode = jwt.verify(token, key, options);
    return decode;
  } catch (e) {
    throw e;
  }
};

export const decodeToken = (token: string) => {
  try {
    const decode = jwt.decode(token, { complete: true });
    return decode;
  } catch (e) {
    throw e;
  }
};
