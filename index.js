require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const router = require('./src/router');
const bodyParser = require('body-parser');
const http = require('http'); // HTTP 서버 모듈 추가
const WebSocket = require('ws');
const chatController = require('./src/api/chat/controller')
const jwt = require('jsonwebtoken');

// JSON 형식의 데이터 처리
app.use(bodyParser.json());
// URL 인코딩된 데이터 처리
app.use(bodyParser.urlencoded({ extended: true }));

// 라우터를 애플리케이션에 등록
app.use('/', router);

// HTTP 서버 생성
const server = http.createServer(app);

// WebSocket 서버 생성 및 설정
const wss = new WebSocket.Server({ server });

// WebSocket 서버 설정을 controller에 전달
chatController.setWss(wss);

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const parsedMessage = JSON.parse(message);
    jwt.verify(parsedMessage.token, process.env.JWT_KEY, (err, decoded) => {
      if (err) {
          ws.close();
      } else {
        chatController.handleMessage(ws, decoded, parsedMessage);
      }
    });
  });
});

// 서버 시작
server.listen(port, () => {
  console.log(`웹서버 구동... ${port}`);
});