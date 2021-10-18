import {
  Table,
  Column,
  Model,
  BelongsTo,
  PrimaryKey,
  AutoIncrement,
  Comment,
  AllowNull,
  Default,
  DataType,
  ForeignKey,
  HasMany,
  Scopes,
} from "sequelize-typescript";
import { fn, literal, Op } from "sequelize";

@Scopes(() => ({
  all: {},
  profile: {
    attributes: {
      exclude: ["userSeq", "agencySeq", "groupSeq", "jobSeq", "phone", "adminMemo"],
      include: [
        [
          literal(`
        (SELECT COUNT(*) FROM Follow AS f
        WHERE f.userSeq = \`User\`.\`userSeq\`)`),
          "followings",
        ],
      ],
    },
    include: [
      {
        attributes: {
          exclude: ["userSeq", "agencySeq", "groupSeq", "jobSeq", "phone", "adminMemo"],
        },
        model: User,
        as: "group",
      },
    ],
  },
}))
@Table({
  tableName: "User",
  timestamps: true,
})
export default class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Comment("회원코드")
  @Column(DataType.INTEGER)
  userSeq: number;

  @AllowNull(false)
  @Comment("식별아이디")
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  uid: string;

  @AllowNull
  @ForeignKey(() => User)
  @Comment("그룹코드")
  @Column(DataType.INTEGER)
  groupSeq: number;

  @Comment("타입")
  @Default(1)
  @Column(DataType.TINYINT({ length: 1 }))
  type: number;

  @Comment("상태")
  @Default(0)
  @Column(DataType.TINYINT({ length: 1 }))
  status: number;

  @AllowNull
  @Comment("이름")
  @Column(DataType.STRING({ length: 100 }))
  name: string;

  @AllowNull
  @Comment("회원명")
  @Column(DataType.STRING({ length: 100 }))
  username: string;

  @AllowNull
  @Comment("전화번호")
  @Column(DataType.STRING({ length: 80 }))
  phone: string;

  @AllowNull
  @Comment("생일")
  @Column(DataType.DATEONLY)
  birthday: string;

  @AllowNull
  @Comment("대표이미지")
  @Column(DataType.STRING({ length: 500 }))
  thumbnail: string;

  @Comment("성별")
  @Default(0)
  @Column(DataType.TINYINT({ length: 1 }))
  gender: number;

  @AllowNull
  @Comment("국가")
  @Column(DataType.STRING({ length: 10 }))
  country: string;

  @AllowNull
  @Comment("번역언어")
  @Column(DataType.STRING({ length: 10 }))
  language: string;

  @Comment("알림여부")
  @Default(1)
  @Column(DataType.TINYINT({ length: 1 }))
  notification: number;

  @Comment("이용약관동의")
  @Default(1)
  @Column(DataType.TINYINT({ length: 1 }))
  termsUse: number;

  @Comment("개인정보취급방침동의")
  @Default(1)
  @Column(DataType.TINYINT({ length: 1 }))
  termsPrivacy: number;

  @AllowNull
  @Comment("탈퇴일시")
  @Column(DataType.DATE)
  exitedAt: string;

  @BelongsTo(() => User, "groupSeq")
  group: User;

  @HasMany(() => User, "groupSeq")
  members: User[];
}
