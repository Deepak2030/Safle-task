# Ethereum Transaction Batching SDK

## Overview

This SDK facilitates Ethereum transactions in batches using an open-source batching contract. It supports both native ETH and various ERC-20 tokens, and includes functionality for gas estimation to optimize transaction costs. The SDK leverages Uniswap's V3 multicall contract for efficient transaction batching.

**Note:** This SDK does not support swaps for USDC and USDT due to their 6 decimal places.

## Features

- **Batch Transactions:** Efficiently process multiple transactions in a single batch.
- **ETH and ERC-20 Token Support:** Handles transactions involving native ETH and ERC-20 tokens.
- **Gas Estimation:** Estimates gas requirements to optimize transaction costs.
- **Uniswap V3 Integration:** Utilizes Uniswap's V3 Swap Router and multicall contract.

## Requirements

- Node.js (v14 or later)
- TypeScript
- ethers.js
- dotenv
