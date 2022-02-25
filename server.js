// https://www.npmjs.com/package/express
// node.js는 html에서가 아니라 js파일에서 실행 가능 : 터미널에 npm (run) start 입력
// require : setting.json에다가 https://stackoverflow.com/questions/49582984/how-do-i-disable-js-file-is-a-commonjs-module-it-may-be-converted-to-an-es6  에있는 코드 추가해서 해결


const express = require("express");

const app = express();

// API Key를 별도로 관리해야한다 : dot(.)env 활용, .env라는 파일에 key를 보관하고, dotenv가 .env파일을 활용해서 
const dotenv = require('dotenv');
dotenv.config();

// 변수명 camelcase로 작성
const clientId = process.env.CLIENT_ID
const clientSecret = process.env.CLIENT_SECRET

// nodejs 서버가 또 다른 client가 되어 Naver 서버에 요청을 보내기 위해 사용
const request = require("request");

// express의 static 미들웨어 활용
app.use(express.static('public'));

// express의 json 미들웨어 사용
app.use(express.json());

// root url : localhost:3000/ == localhost:3000
// 해당 경로로 요청이 들어왔을 때 호출될 함수
// 두 인자값(arguments)를 받는다 : request(req), response(res)
app.get("/",(req,res)=>{
  // root url, 즉 메인 페이지로 접속했을 때 papago의 메인 페이지가 나와야한다.

  // 파일 경로를 확인하기 위함
  // console.log(`현재 파일명 : ${__filename}`);
  // console.log(`index.html의 파일 경로: ${__dirname}`);


  res.sendFile( __dirname,'index.html');
});

// detectLangs 경로로 요청했을 때
app.post("/detectLangs", (req,res) =>{

  console.log(req.body);  
  console.log(typeof req.body); // Object

  const{text : query ,targetLanguage } = req.body;

  const url = "https://openapi.naver.com/v1/papago/detectLangs";
  const options = {
    url,
    form : { query : query },
    headers:{
      "X-Naver-Client-Id" : clientId,
      "X-Naver-Client-Secret" : clientSecret,

    }
  }

  // options에 요청에 필요한 데이터 동봉
  // () => {} : 요청에 따른 응답 정보를 확인한다.
  request.post(options, (error,response,body) =>{
    if(!error && response.statusCode ==200 ){
      console.log(body);
      console.log(typeof body); // string

      // parse() : string -> object 변환
      const parsedBody = JSON.parse(body); 
      console.log(typeof parsedBody, parsedBody);  // object { langCode: 'ko' }
      
      // papago 번역 url로 redirect(재요청)
      res.redirect(`translate?lang=${parsedBody['langCode']}&targetLanguage=${targetLanguage}&query=${query}`);
      // query string으로 데이터 전송(GET 요청)
      // ex) localhost:3000/translate?lang=ko&targetLanguage=en&query=안녕(%2D%G5~~~ , 퍼센트인코딩, 한글의 경우 의미)

    }else{
      console.log(`error = ${response.statusCode}`);
    }
  });
});

// papago 번역 요청 부분
app.get("/translate", (req,res) =>{
  const url = "https://openapi.naver.com/v1/papago/n2mt";
  // console.log(req.query, typeof req.query);
  const options = {
    url,
    form : {
      // query string으로 받은 값들을 mapping or bidning한다
      source : req.query['lang'],
      target : req.query['targetLanguage'],
      text : req.query['query'],
     },

    headers:{
      "X-Naver-Client-Id" : clientId,
      "X-Naver-Client-Secret" : clientSecret,
  },
}
  request.post(options, (error,response,body) =>{
    if(!error && response.statusCode ==200 ){
      console.log(body);
      /*
      {"message":{"@type":"response","@service":"naverservice.nmt.proxy","@version":"1.0.0","result":{"srcLangType":"ko","tarLangType":"en","translatedText":"Yes.","engineType":"N2MT","pivot":null}}}
      */
      console.log(typeof body); //string -> object로 변경해야함

      // front에 해당하는 script.js에 응답 데이터(json) 전송하기
      res.json(body);

    }else{

    }
  });
});


app.listen(3001, ()=>{
  console.log('http://127.0.0.1:3001/ app listening on port 3001!');
});















