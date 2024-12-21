const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Hello World');
});
router.get('/page/policy', (req, res) => {
  res.send('개인정보 처리방침');
});
router.get('/page/terms', (req, res) => {
  res.send('이용 약관');
});
router.get('/api/user/my', (req, res) => {
  res.send('마이페이지');
});
router.post('/api/user/my', (req, res) => {
  res.send('마이페이지 수정');
});
router.get('/api/feed', (req, res) => {
  res.send('피드 목록');
});

// 중략 ...

module.exports = router;