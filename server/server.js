const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

const SUPPORTED = ['GOOG','TSLA','AMZN','META','NVDA'];

// Keep simulated prices in memory
const prices = {};
SUPPORTED.forEach(t => prices[t] = Number((100 + Math.random() * 900).toFixed(2)));

// Utility: slightly random walk for a ticker
function nextPrice(ticker) {
  const cur = prices[ticker];
  // small random walk percent
  const change = (Math.random() - 0.5) * 0.02 * cur; // ±1% approx
  const next = Math.max(1, cur + change);
  prices[ticker] = Number(next.toFixed(2));
  return prices[ticker];
}

// When a client connects
io.on('connection', (socket) => {
  console.log('socket connected', socket.id);

  // join rooms when client requests subscribe/unsubscribe
  socket.on('subscribe', (ticker) => {
    if (!SUPPORTED.includes(ticker)) return;
    socket.join(ticker);
    // immediately send current price
    socket.emit('price_update', { ticker, price: prices[ticker] });
    console.log(`${socket.id} subscribed to ${ticker}`);
  });

  socket.on('unsubscribe', (ticker) => {
    socket.leave(ticker);
    console.log(`${socket.id} unsubscribed from ${ticker}`);
  });

  socket.on('disconnect', () => {
    console.log('socket disconnected', socket.id);
  });
});

// Simulate price updates every 1 second
setInterval(() => {
  SUPPORTED.forEach(ticker => {
    const price = nextPrice(ticker);
    // broadcast to room for that ticker
    io.to(ticker).emit('price_update', { ticker, price, ts: Date.now() });
  });
}, 1000);

// a small endpoint to get supported tickers and current prices
app.get('/tickers', (req, res) => {
  res.json({ supported: SUPPORTED, prices });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server listening on ${PORT}`));
