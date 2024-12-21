const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello World');
});
app.get('/page/policy', (req, res) => {
  res.send('개인정보 처리방침');
});
app.get('/page/terms', (req, res) => {
  res.send('이용 약관');
});
app.get('/api/user/my', (req, res) => {
  res.send('마이페이지');
});
app.put('/api/user/my', (req, res) => {
  res.send('마이페이지 수정');
});
app.get('/api/feed', (req, res) => {
  res.send('피드 목록');
});

// 중략 ...
app.listen(port, () => {
  console.log(`웹서버 구동... ${port}`);
});