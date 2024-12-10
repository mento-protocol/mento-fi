import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { Contract } from 'ethers'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { BROKER_ABI } from 'src/config/consts'
import { TokenId, getTokenAddress } from 'src/config/tokens'
import { getProvider } from 'src/features/providers'
import { SwapDirection } from 'src/features/swap/types'
import { logger } from 'src/utils/logger'
import { usePrepareSendTransaction, useSendTransaction } from 'wagmi'

export function useSwapTransaction(
  chainId: number,
  fromToken: TokenId,
  toToken: TokenId,
  amountInWei: string,
  thresholdAmountInWei: string,
  direction: SwapDirection,
  accountAddress?: Address,
  isApproveConfirmed?: boolean
) {
  const { error: txPrepError, data: txRequest } = useQuery(
    [
      'useSwapTransaction',
      chainId,
      fromToken,
      toToken,
      amountInWei,
      thresholdAmountInWei,
      direction,
      accountAddress,
      isApproveConfirmed,
    ],
    async () => {
      if (
        !accountAddress ||
        !isApproveConfirmed ||
        new BigNumber(amountInWei).lte(0) ||
        new BigNumber(thresholdAmountInWei).lte(0)
      ) {
        logger.debug('Skipping swap transaction')
        return null
      }

      // TODO: Set me please 🥲
      const brokerAddress = ''
      const fromTokenAddr = getTokenAddress(fromToken, chainId)
      const toTokenAddr = getTokenAddress(toToken, chainId)
      const provider = getProvider(chainId)
      const brokerV3 = new Contract(brokerAddress, BROKER_ABI, provider)

      let txRequest

      // If token in is cUSD we need to call swap collateral
      if (fromToken == TokenId.CELO) {
        txRequest = await brokerV3.populateTransaction.swapCollateral(toTokenAddr, amountInWei)
      } else {
        txRequest = await brokerV3.populateTransaction.swap(fromTokenAddr, toTokenAddr, amountInWei)
      }

      return { ...txRequest, to: brokerAddress }
    }
  )

  const { config, error: sendPrepError } = usePrepareSendTransaction(
    isApproveConfirmed && txRequest ? { request: txRequest } : undefined
  )
  const {
    data: txResult,
    isLoading,
    isSuccess,
    error: txSendError,
    sendTransactionAsync,
  } = useSendTransaction(config)

  useEffect(() => {
    if (txPrepError || (sendPrepError?.message && !isLoading && !isSuccess)) {
      toast.error('Unable to prepare swap transaction')
      logger.error(txPrepError || sendPrepError?.message)
    } else if (txSendError) {
      toast.error('Unable to execute swap transaction')
      logger.error(txSendError)
    }
  }, [txPrepError, sendPrepError, isLoading, isSuccess, txSendError])

  return {
    sendSwapTx: sendTransactionAsync,
    swapTxResult: txResult,
    isSwapTxLoading: isLoading,
    isSwapTxSuccess: isSuccess,
  }
}
