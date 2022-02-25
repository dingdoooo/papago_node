const textAreaArray = document.querySelectorAll('textarea');

console.log(textAreaArray);

// **1) 변수 네이밍 컨벤션, 도메닝과 관련된 용어 정의
// source : 번역할 텍스트와 관련된 명칭
// target : 번역된 결과와 관련된 명칭

const [sourceTextArea, targetTextArea] = textAreaArray;

// console.log(sourceTextArea);
// console.log(targetTextArea);

const [sourceSelect,targetSelect] = document.querySelectorAll('select');
console.log(sourceSelect, targetSelect);

// 번역할 언어의 타입(ko, en, ja)
let targetLanguage = 'en';

// 어떤 언어로 번역할지 선택하는 target selectbox의 선택지 값이 바뀔 때마다 이벤트 발생
targetSelect.addEventListener('change', ()=>{
  const selectedIndex = targetSelect.selectedIndex;
  // console.log(selectedIndex);

  targetLanguage = targetSelect.options[selectedIndex].value;
  // console.log(targetLanguage);
})

// 사용자가 입력을 끝낸 후 번역될 수 있도록 컴퓨터보고 기다리라고 하는 기능 : 디바운싱(Debouncing) 
// setTimeout() : 일정 시간이 지난 후 callback함수를 실행하도록 (함수가 파라미터(인자)로 들어가는 것을 callback함수라고 한다)
let debouncer;

sourceTextArea.addEventListener('input', (event) =>{
  
  // debouncer에 값이 있다면(true) = clearTimeout() : 반환된 timer를 초기화 한다.
  // 즉, 사용자가 3초 이내에 추가적으로 입력한다면, 0초로 초기화 하여 다시 3초간 사용자의 응답을 기다린다.
  // 이후, 사용자가 3초간 입력을 하지 않으면 번역이 이루어지게 한다. 
  if(debouncer){
    clearTimeout(debouncer);
  }

  // debouncer 변수 할당, setTimeout() 함수 사용 (맨 끝에 3000 = 3초)
  debouncer = setTimeout(() => {
    // textArea에 입력한 값
    const text = event.target.value;

    if(text){

      // 1. 어떤 이벤트인가?  : input
      // 2. textArea에 입력한 값은 어떻게 가져올 수 있을까?
      // 3. 생활코딩 동기, 비동기 : https://opentutorials.org/course/2136/11884
      // 4. 동기 비동기 : https://dev.to/marek/are-callbacks-always-asynchronous-bah
      // console.dir(event); : InputEvent
      
      // **2) sourceTextAread에 입력한 값(value)를 text 변수에 넣는다.
      const text = event.target.value; 
      // console.log(text);
      // console.log(text); : 한 글자를 쓸 때마다 console에 나타나기 때문에 동기, 비동기의 개념을 사용하기 위해 설명해주셨다!
    
    
      // **3) 이름이 XML일 뿐, XML에 국한되지 않는다!
      const xhr = new XMLHttpRequest();
      const url = "/detectLangs"; // node 서버로 요청해야한다.
    
      xhr.onreadystatechange = () =>{
        if(xhr.readyState == 4 && xhr.status ==200){
          // 서버 응답 결과 확인 (responseText : 응답에 포함된 텍스트)
          console.log(typeof xhr.responseText); // json은 string타입이므로,  string -> Object로 파싱해줘야함!
          console.log(xhr.responseText);
    
          // **4) getAllResponseHeaders : 응답의 헤더(header) 확인 , 몇 가지 메타 정보를 보내줌
          console.log(`응답 헤더 : ${xhr.getAllResponseHeaders}` );
    
          const responseData = xhr.responseText;
          console.log(`responseData : ${responseData}, type :${typeof responseData}`);
    
          // *** parsing을 2번해야하는 이유??? :
          const parseJsonToObject = JSON.parse(JSON.parse(responseData));
          console.log(typeof parseJsonToObject, parseJsonToObject);
    
          // srcLangType, translatedText 사용하기
          const result = parseJsonToObject['message']['result'];
          const options = sourceSelect.options;
    
          for(let i = 0; i< options.length; i++){
            if(options[i].value === reesult['srcLangType'])
            sourceSelect.selectedIndex = i;
          }

          // 번역된 텍스트를 targetTextArea(결과화면)에 집어넣기
          targetTextArea.value = result['translatedText'];
    
        }
      }
      // 브라우저에서 데이터를 가져옴
      xhr.open("POST",url);
      xhr.setRequestHeader("Content-type", "application/json")
      
      
      /* [결과값]
        {
          "userId": 1,
          "id": 1,
          "title": "delectus aut autem",
          "completed": false
        }
        - javascript의 객체처럼 출력되지만, string tyepe이다.
        - 이런 type을 json 타입이라고 한다
        - JSON(Javascript Object Notation)경량의 data 교환 방식  
      */
      
      const requestData = {
        text,               // text : text 와 동일
        targetLanguage      // targetLanguage : targetLanguage 와 동일
      };
    
      // JSON의 타입은 string이므로 Object를 JSON타입으로 변경해야한다.
      // 직렬화(SerialiZation) : 서버에 보낼 때, Object를 string으로 변경한 후, 바이트 배열로 바꿔줘야한다. 
    
      // 내장 모듈인 JSON 활용하여 string(문자열)로 변경하겠다
      // requestData라는 Object타입을 문자화(stringfy) 하겠다
      jsonToString = JSON.stringify(requestData);
      console.log(typeof jsonToString);
    
      xhr.send(jsonToString);  // text, targetLanguage 보내기
    
    }else{
      console.log("번역할 텍스트를 입력하세요!");
    }
  },3000);


}
)























