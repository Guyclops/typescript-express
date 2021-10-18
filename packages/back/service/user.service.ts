import { User } from "@packages/database";
import redis from "../func/redis";

class UserService {
  /**
   * 회원 조회
   * @param data
   * @returns
   */
  public async getUser(data: { userSeq?: string | number; uid?: string; type?: number; status?: number }) {
    try {
      let user = await User.findOne({
        where: {
          ...data,
        },
      });
      if (user !== null) {
        user = user.toJSON() as any;
      }
      return user;
    } catch (e) {
      throw e;
    }
  }

  // 그룹 리스트
  public async getGroups() {
    try {
      let response = await redis.getData("groups");
      if (response !== undefined && response !== null) {
        return { groups: JSON.parse(response) };
      } else {
        let groups = await User.findAll({
          attributes: ["uid", "name", "enName", "thumbnail"],
          where: {
            type: 3,
            status: 1,
          },
        });
        groups = JSON.parse(JSON.stringify(groups));
        redis.setExpData("groups", JSON.stringify(groups), 600);
        return { groups };
      }
    } catch (e) {
      throw e;
    }
  }
}

export default new UserService();
