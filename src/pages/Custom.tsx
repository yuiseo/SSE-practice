import { useEffect, useState } from 'react';

type PriceUpdate = { symbol: string; price: string; time: string };
type Notice = { level: string; text: string; time: string };

export default function MultiPage() {
  const [connected, setConnected] = useState(false);
  const [prices, setPrices] = useState<PriceUpdate[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const es = new EventSource('http://localhost:5000/events-custom');

    const onOpen = () => setConnected(true);
    const onError = () => {
      setConnected(false);
      setError('SSE 연결 에러');
    };
    const onPrice = (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data) as PriceUpdate;
        setPrices((prev) => [...prev, data]);
      } catch (error) {
        console.error(error);
      }
    };
    const onNotice = (e: MessageEvent) => {
      try {
        const data = JSON.parse(e.data) as Notice;
        setNotices((prev) => [...prev, data]);
      } catch (error) {
        console.error(error);
      }
    };

    es.addEventListener('open', onOpen);
    es.addEventListener('error', onError);
    es.addEventListener('price-update', onPrice as EventListener);
    es.addEventListener('notice', onNotice as EventListener);

    return () => {
      es.removeEventListener('open', onOpen);
      es.removeEventListener('error', onError);
      es.removeEventListener('price-update', onPrice as EventListener);
      es.removeEventListener('notice', onNotice as EventListener);
      es.close();
    };
  }, []);

  return (
    <div>
      <h2>/multi - addEventListener 사용</h2>
      <p>연결 상태: {connected ? '연결됨' : '연결 안 됨'}</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <h3>price-update</h3>
      <ul>
        {prices.map((p, i) => (
          <li key={i}>{p.symbol}: {p.price} ({p.time})</li>
        ))}
      </ul>

      <h3>notice</h3>
      <ul>
        {notices.map((n, i) => (
          <li key={i}>[{n.level}] {n.text} ({n.time})</li>
        ))}
      </ul>
    </div>
  );
}
