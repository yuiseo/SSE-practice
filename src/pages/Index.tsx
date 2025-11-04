import { useEffect, useState } from 'react';

export default function IndexPage() {
  const [messages, setMessages] = useState<string[]>([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const es = new EventSource('http://localhost:5000/events-onmessage');

    es.onopen = () => setConnected(true);
    es.onmessage = (e) => setMessages((prev) => [...prev, e.data]);
    es.onerror = () => {
      setConnected(false);
      setError('SSE 연결 에러');
    };

    return () => {
      es.onopen = null;
      es.onmessage = null;
      es.onerror = null;
      es.close();
    };
  }, []);

  return (
    <div>
      <h2>/index - onmessage 사용</h2>
      <p>연결 상태: {connected ? '연결됨' : '연결 안 됨'}</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {messages.map((m, i) => (
          <li key={i}>{m}</li>
        ))}
      </ul>
    </div>
  );
}
