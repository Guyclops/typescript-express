### Typescript Express

- nodejs, typescript, express, mysql, sequelize

- yarn workspace

- CI/CD: github action + AWS Elastic Beanstalk

### 구조

```
├── .github: github action 설정
├── .platform: ElasticBeanstalk 설정
├── config: ElasticBeanstalk back 실행 명령어 구분
├── packages
│   ├── api: axios 모듈
│   ├── back: 앱 서버
│   ├── database: db 모듈
│   ├── fcm: fcm 모듈
│   ├── iap: 인앱결제 검증 모듈
│   ├── sns: SNS 로그인 검증 모듈
│   ├── translate: AWS 번역 모듈
│   └── webhook: slack webhook 모듈
└── resize: 이미지 리사이징 Lambda
```

### .env

```
DATABASE_DATABASE=DB 스키마
DATABASE_HOST=DB 주소
DATABASE_USERNAME=DB 접속 아이디
DATABASE_PASSWORD=DB 접속 비밀번호
PASS_AUTH_SALT=비밀번호 생성시 SALT값
JWT_AUTH_SECRET=Auth JWT 암호화
JWT_REFRESH_SECRET=Refresh JWT 암호화
AWS_ACCESSKEY=AWS ACCESSKEY
AWS_SECRETKEY=AWS SECRETKEY
AWS_BUCKET=AWS Bucket
PASS_RESET_EMAIL=이메일
PASS_RESET_PASSWORD=이메일 비밀번호
REDIS_HOST=Redis 주소
REDIS_PORT=Redis 포트
REDIS_PASSWORD=Redis 비밀번호
NODE_ENV=환경(local: 로컬, development: 개발, production: 실서버)
WEB_HOOK_URL=SLACK webhook URL
FIREBASE_API_KEY=Firebase API key
```

### 실행 스크립트

```
yarn start: 앱 서버 실행
yarn run dev-back: 개발 앱 서버 실행
yarn run build-back: 앱 서버 빌드
yarn run build-test: 빌드 앱 서버 테스트
yarn run build-rm: 빌드파일 삭제
```

### 서버

1. 앱 서버(./packages/back)

   - Install: yarn(root path)

   - DEV 서버 시작: yarn dev-back

   - 배포 branch: deploy-dev(DEV 서버), deploy-prod(PROD 서버)

2. axios 모듈(./packages/api)

   - axios로 API 호출시 사용

3. databse 모듈(./packages/database)

   - sequelize-typescript 사용

   - MySQL

4. FCM 모듈(./packages/fcm)

   - 타입별 FCM 전송 모듈

5. SNS 모듈(./packages/sns)

   - SNS 로그인 검증 모듈

6. 번역 모듈(./packages/translate)

   - AWS Translate 사용 번역 모듈

7. webhook 모듈(./packages/webhook)

   - slack 알림 전송 모듈

8. 이미지 리사이징(./resize)

   - Lambda@Edge(us-east-1)에 zip으로 배포

   - CloudFront + S3 + Lambda@Edge으로 이미지 요청시 리사이징
