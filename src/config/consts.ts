export const WEI_PER_UNIT = '1000000000000000000' // 1 Celo or Ether
export const STANDARD_TOKEN_DECIMALS = 18
export const NULL_ADDRESS = '0x0000000000000000000000000000000000000000'
export const AVG_BLOCK_TIMES = 5000 // 5 seconds
export const STALE_BLOCK_TIME = 25000 // 25 seconds
export const EXCHANGE_RATE_STALE_TIME = 5000 // 5 second
export const BALANCE_STALE_TIME = 5000 // 5 seconds
export const STATUS_POLLER_DELAY = 5000 // 5 seconds
export const SWAP_QUOTE_REFETCH_INTERVAL = 5000 // 5 seconds
export const SIGN_OPERATION_TIMEOUT = 90000 // 90 seconds

export const STALE_TOKEN_PRICE_TIME = 900000 // 15 minutes
export const MAX_TOKEN_PRICE_NUM_DAYS = 14 // 14 days

export const MAX_FEE_SIZE = '1000000000000000000' // 1 Token
export const MAX_GAS_PRICE = '5000000000' // 5 Gwei
export const MAX_GAS_LIMIT = '10000000' // 10 million

export const MIN_ROUNDED_VALUE = 0.0001
export const DISPLAY_DECIMALS = 4
export const MAX_EXCHANGE_SPREAD = 0.1 // 10%

export const ERC20_ABI = [
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
]

export const BROKER_ABI = [
  'function getRateFeedId(string fromSymbol, string toSymbol) pure returns (bytes32)',
  'function getRate(bytes32 rateFeedId) view returns (uint256 numerator, uint256 denominator)',
  'function getAmountOut(address from, address to, uint256 amountIn) view returns (uint256)',
  'function getAmountIn(address from, address to, uint256 amountOut) view returns (uint256)',
  'function swapCollateral(address to, uint256 amountIn) returns (uint256)',
  'function swap(address from, address to, uint256 amountIn) returns (uint256)',
]