import React from 'react';

export default function StockRow({ ticker, price, subscribed, onSubscribe, onUnsubscribe }) {
  return (
    <div className={`stock-row-card ${subscribed ? 'stock-row-subscribed' : ''}`}>
      <div className="stock-row-main">
        <div className="stock-ticker">{ticker}</div>
        <div className="stock-price">
          {price !== undefined ? price.toFixed ? price.toFixed(2) : price : '—'}
        </div>
      </div>
      <div className="stock-row-footer">
        <div className="stock-row-label">
          {subscribed ? 'Currently subscribed' : 'Not subscribed'}
        </div>
        {subscribed ? (
          <button className="danger-button" onClick={onUnsubscribe}>
            Unsubscribe
          </button>
        ) : (
          <button className="primary-button" onClick={onSubscribe}>
            Subscribe
          </button>
        )}
      </div>
    </div>
  );
}
