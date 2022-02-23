// https://www.npmjs.com/package/express
// node.js는 html에서가 아니라 js파일에서 실행 가능 : 터미널에 npm (run) start 입력
// require : setting.json에다가 https://stackoverflow.com/questions/49582984/how-do-i-disable-js-file-is-a-commonjs-module-it-may-be-converted-to-an-es6  에있는 코드 추가해서 해결


const express = require("express");

const app = express();

// API Key를 별도로 관리해야한다 : dot(.)env 활용, .env라는 파일에 key를 보관하고, dotenv가 .env파일을 활용해서 
const dotenv = requrie('dotenv');
dotenv.config();

// 변수명 camelcase로 작성
const clientId = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET

// nodejs 서버가 또 다른 client가 되어 Naver 서버에 요청을 보내기 위해 사용
const request = require("request");

// express의 static 미들웨어 활용
app.use(express.static('public'))














