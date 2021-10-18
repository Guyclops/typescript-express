import redis from "redis";
import envConfig from "../config/env.config";
import { promisify } from "util";

let client: any = null;
// 서버 타입별 redis client 생성
if (envConfig.TYPE == "production") {
  client = redis.createClient({
    host: envConfig.REDIS.HOST,
  });
} else {
  client = redis.createClient({
    host: envConfig.REDIS.HOST,
    password: envConfig.REDIS.PASSWORD,
  });
}

const getAsync = promisify(client.get).bind(client);
const deleteAsync = promisify(client.del).bind(client);

// 만료 데이터 저장
const setExpData = (key: string, value: string, time: number = 60 * 3) => {
  try {
    client.set(key, value, "EX", time, () => {});
  } catch (e) {
    throw e;
  }
};
// 데이터 저장
const setData = (key: string, value: string) => {
  try {
    client.set(key, value);
  } catch (e) {
    throw e;
  }
};
// 데이터 조회
const getData = async (key: string) => {
  try {
    const response = await getAsync(key);
    return response;
  } catch (e) {
    return null;
  }
};
// 데이터 삭제
const removeData = async (key: string) => {
  try {
    await deleteAsync(key);
    return true;
  } catch (e) {
    return false;
  }
};

export default { setExpData, setData, getData, removeData };
