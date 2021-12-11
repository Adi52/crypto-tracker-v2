const MAIN_API_ROUTE =
  "https://crypto-portfolio-7f3ec-default-rtdb.firebaseio.com";

const API_ACCOUNTS = `${MAIN_API_ROUTE}/accounts.json`;
const API_TRANSACTIONS = `${MAIN_API_ROUTE}/transactions.json`;
const CRYPTO_API_ROUTE = "https://api.coingecko.com/api/v3/";
const COINS_LIST_ROUTE = `${CRYPTO_API_ROUTE}coins/list`;
const COIN_PRICE_ROUTE = (coinId) =>
  `${CRYPTO_API_ROUTE}simple/price?ids=${coinId}&vs_currencies=usd`;
const COIN_INFO_ROUTE = (coinId) => `${CRYPTO_API_ROUTE}/coins/${coinId}`

export {
  MAIN_API_ROUTE,
  API_ACCOUNTS,
  API_TRANSACTIONS,
  CRYPTO_API_ROUTE,
  COINS_LIST_ROUTE,
  COIN_PRICE_ROUTE,
  COIN_INFO_ROUTE,
};
