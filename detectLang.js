// 언어 감지
// 터미널 키기 : ctrl + ~ , 터미널 종료 : ctrl + c

// 네이버 Papago 언어감지 API 예제
const express = require("express");

const app = express();
const client_id = "JEectA7NhAjXRxX6QOIU";
const client_secret = "SGUCV3RQUV";
const query = "언어를 감지할 문장을 입력하세요.";

app.get("/detectLangs", (req, res) => {
	const api_url = "https://openapi.naver.com/v1/papago/detectLangs";
	const request = require("request");
	const options = {
		url: api_url,
		form: {"query": query},
		headers: {"X-Naver-Client-Id": client_id, "X-Naver-Client-Secret": client_secret},
	};

	request.post(options, (error, response, body) => {
		if (!error && response.statusCode == 200) {
			res.writeHead(200, {"Content-Type": "text/json;charset=utf-8"});
			res.end(body);
		} else {
			res.status(response.statusCode).end();
			console.log(`error = ${response.statusCode}`);
		}
	});
});
app.listen(3000, () => {
	console.log("http://127.0.0.1:3000/detectLangs app listening on port 3000!");
});
