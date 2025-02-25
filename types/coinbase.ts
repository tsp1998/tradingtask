export type Token = "BTC" | "ETH" | "XRP" | "LTC"

/**
 * Represents a WebSocket subscription request to Coinbase API.
 */
export type SubscriptionRequest = {
  type: "subscribe" | "unsubscribe"; // Message type (always "subscribe")
  product_ids: string[]; // List of trading pairs to subscribe to (e.g., ["BTC-USD", "ETH-USD"])
  channels: (string | { name: string; product_ids?: string[] })[]; // List of channels to subscribe to
};

/**
 * Represents real-time ticker data for a cryptocurrency pair.
 */
export type TickerData = {
  type: "ticker"; // Message type (always "ticker")
  sequence: number; // Unique sequence number of the event
  product_id: string; // Trading pair (e.g., "BTC-USD")
  price: string; // Last traded price
  open_24h: string; // Open price in the last 24 hours
  volume_24h: string; // Trading volume in the last 24 hours
  low_24h: string; // Lowest price in the last 24 hours
  high_24h: string; // Highest price in the last 24 hours
  volume_30d: string; // Trading volume in the last 30 days
  best_bid: string; // Highest bid price currently available
  best_bid_size: string; // Size of the highest bid order
  best_ask: string; // Lowest ask price currently available
  best_ask_size: string; // Size of the lowest ask order
  side: "buy" | "sell"; // Side of the last trade ("buy" or "sell")
  time: string; // Timestamp of the last trade in ISO 8601 format
  trade_id: number; // Unique identifier of the last trade
  last_size: string; // Size of the last trade
};

/**
 * Represents a real-time trade match (executed order) in the market.
 */
export type MatchData = {
  type: "match"; // Message type (always "match")
  trade_id: number; // Unique trade identifier
  maker_order_id: string; // ID of the maker order
  taker_order_id: string; // ID of the taker order
  side: "buy" | "sell"; // Trade direction ("buy" or "sell")
  size: string; // Size of the trade in the base currency
  price: string; // Trade execution price
  product_id: string; // Trading pair (e.g., "BTC-USD")
  sequence: number; // Unique sequence number of the event
  time: string; // Timestamp of the trade in ISO 8601 format
};