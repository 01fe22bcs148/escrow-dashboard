import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import StockRow from './StockRow';

const SERVER = 'https://stock-dashboard-backend.onrender.com';

export default function Dashboard({ email, onLogout }) {
  const [supported, setSupported] = useState([]);
  const [prices, setPrices] = useState({});
  const [subscriptions, setSubscriptions] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const socketRef = useRef(null);

  useEffect(() => {
    // Initial fetch of supported tickers and base prices
    fetch(`${SERVER}/tickers`)
      .then((r) => r.json())
      .then((data) => {
        setSupported(data.supported || []);
        setPrices(data.prices || {});
        setLoading(false);
      })
      .catch(() => {
        setConnectionStatus('Failed to fetch initial data from server.');
        setLoading(false);
      });

    const socket = io(SERVER, { transports: ['websocket'] });
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnectionStatus('Connected to price server.');
    });

    socket.on('disconnect', () => {
      setConnectionStatus('Disconnected from price server.');
    });

    socket.on('price_update', ({ ticker, price }) => {
      setPrices((prev) => ({ ...prev, [ticker]: price }));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const subscribe = (ticker) => {
    if (!socketRef.current) return;
    socketRef.current.emit('subscribe', ticker);
    setSubscriptions((prev) => {
      const next = new Set(prev);
      next.add(ticker);
      return next;
    });
  };

  const unsubscribe = (ticker) => {
    if (!socketRef.current) return;
    socketRef.current.emit('unsubscribe', ticker);
    setSubscriptions((prev) => {
      const next = new Set(prev);
      next.delete(ticker);
      return next;
    });
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <div className="label-text">Logged in as</div>
          <div className="user-email">{email}</div>
        </div>
        <button className="secondary-button" onClick={onLogout}>
          Logout
        </button>
      </div>

      <div className="status-bar">
        <span className="status-dot" /> {connectionStatus}
      </div>

      <section className="section-card">
        <div className="section-card-header">
          <h2 className="section-title">Supported Stocks</h2>
          <p className="section-description">
            Select the stock tickers you want to monitor. Prices are simulated and updated every second.
          </p>
        </div>

        {loading ? (
          <div className="info-text">Loading stock information…</div>
        ) : (
          <div className="stock-list">
            {supported.map((ticker) => (
              <StockRow
                key={ticker}
                ticker={ticker}
                price={prices[ticker]}
                subscribed={subscriptions.has(ticker)}
                onSubscribe={() => subscribe(ticker)}
                onUnsubscribe={() => unsubscribe(ticker)}
              />
            ))}
          </div>
        )}
      </section>

      <section className="section-card">
        <h2 className="section-title">Your Subscriptions</h2>
        {subscriptions.size === 0 ? (
          <p className="info-text">
            (none) — You have not subscribed to any stocks yet. Use the Subscribe button above to start monitoring.
          </p>
        ) : (
          <ul className="subscription-list">
            {Array.from(subscriptions).map((t) => (
              <li key={t} className="subscription-item">
                <span className="subscription-ticker">{t}</span>
                <span className="subscription-price">
                  {prices[t] !== undefined ? prices[t] : '—'}
                </span>
              </li>
            ))}
          </ul>
        )}

        <p className="helper-text">
          Open another browser tab/window and log in with a different email to simulate another client. 
          Subscriptions and updates are independent for each user.
        </p>
      </section>
    </div>
  );
}
