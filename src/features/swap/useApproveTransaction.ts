import { useQuery } from '@tanstack/react-query'
import BigNumber from 'bignumber.js'
import { Contract } from 'ethers'
import { useEffect } from 'react'
import { toast } from 'react-toastify'
import { ERC20_ABI } from 'src/config/consts'
import { TokenId, getTokenAddress } from 'src/config/tokens'
import { getProvider } from 'src/features/providers'
import { logger } from 'src/utils/logger'
import { usePrepareSendTransaction, useSendTransaction } from 'wagmi'

export function useApproveTransaction(
  chainId: number,
  tokenId: TokenId,
  amountInWei: string,
  accountAddress?: Address
) {
  const { error: txPrepError, data: txRequest } = useQuery(
    ['useApproveTransaction', chainId, tokenId, amountInWei, accountAddress],
    async () => {
      if (!accountAddress || new BigNumber(amountInWei).lte(0)) return null

      const brokerAddress = '0x6AD4e21FD3a17932CbCB3Ad1b566C6bACc94EF2F'
      const tokenAddr = getTokenAddress(tokenId, chainId)
      const provider = getProvider(chainId)

      const tokenContract = new Contract(tokenAddr, ERC20_ABI, provider)
      const txRequest = await tokenContract.populateTransaction.approve(brokerAddress, amountInWei)
      return { ...txRequest, to: tokenAddr }
    },
    {
      retry: false,
    }
  )

  const { config, error: sendPrepError } = usePrepareSendTransaction(
    txRequest ? { request: txRequest } : undefined
  )
  const {
    data: txResult,
    isLoading,
    isSuccess,
    error: txSendError,
    sendTransactionAsync,
  } = useSendTransaction(config)

  useEffect(() => {
    if (txPrepError || sendPrepError?.message) {
      toast.error('Unable to prepare approval transaction')
      logger.error(txPrepError || sendPrepError?.message)
    } else if (txSendError) {
      toast.error('Unable to execute approval transaction')
      logger.error(txSendError)
    }
  }, [txPrepError, sendPrepError, txSendError])

  return {
    sendApproveTx: sendTransactionAsync,
    approveTxResult: txResult,
    isApproveTxLoading: isLoading,
    isApproveTxSuccess: isSuccess,
  }
}
