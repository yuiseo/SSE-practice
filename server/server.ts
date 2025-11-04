import express from 'express';
import cors from 'cors';

const app = express();

const FRONTEND_URL = 'http://localhost:5173';

const corsOptions = {
  origin: FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
};

app.use(cors(corsOptions));

const port = 5000;
app.get('/', (req, res) => {
  res.send('Hello Express');
});
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
app.get('/hello', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

app.get('/events-custom', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // 커스텀 이벤트: price-update (addEventListener('price-update'))
  const priceInterval = setInterval(() => {
    const price = (Math.random() * 1000).toFixed(2);
    const payload = { symbol: 'ABC', price, time: new Date().toISOString() };
    res.write(`event: price-update\n`);
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  }, 3000);

  // 커스텀 이벤트: notice (addEventListener('notice'))
  const noticeInterval = setInterval(() => {
    const payload = {
      level: 'info',
      text: '공지 알림',
      time: new Date().toISOString(),
    };
    res.write(`event: notice\n`);
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
  }, 7000);
  

  req.on('close', () => {
    clearInterval(priceInterval);
    clearInterval(noticeInterval);
    res.end();
  });
});

app.get('/events-onmessage', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  // 초기 핑(선택)
  res.write(`: connected at ${new Date().toISOString()}\n\n`);

  // 기본 message 채널 (onmessage로 수신 가능)
  const defaultInterval = setInterval(() => {
    const data = {
      message: `5초 주기 기본 메시지`,
      time: new Date().toISOString(),
    };
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }, 5000);

  // 연결 종료 시 타이머 해제
  req.on('close', () => {
    clearInterval(defaultInterval);
    res.end();
  });
});
