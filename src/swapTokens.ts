/* 
~~~!!! NOTE: This SDK Does not support USDC and USDT swaps as they have 6 decimals !!!~~~
~~~ USED UNISWAP's MULTICALL CONTRACT FOR TRANSACTION BATCHING ~~~
*/ 

import { ethers } from "ethers";
import { config } from "dotenv";
config();
const RPC_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const WALLET_ADDRESS = process.env.WALLET_ADDRESS;
const chainId = Number(process.env.CHAIN_ID);

import V3SwapRouterABI from "../ABI/V3SwapRouterABI.json";
import ERC20_ABI  from "../ABI/ERC20ABI.json";

const V3SwapRouterAddress = "0xE592427A0AEce92De3Edee1F18E0157C05861564";
const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

// Transaction deadline (1 hour )
const deadline = Math.floor(Date.now() / 1000) + 60 * 60;

const provider = new ethers.JsonRpcProvider(RPC_URL, chainId);
const wallet = new ethers.Wallet(PRIVATE_KEY!, provider);
const signer = wallet.connect(provider);

//  Default fee for swaps
const fee = 3000;

// Function to swap tokenA to tokenB
async function swapTokenAToB(tokenIn: string, tokenOut: string, amount: number) {
  const tokenInContract = new ethers.Contract(tokenIn, ERC20_ABI, signer);
  const swapRouterContract = new ethers.Contract(
    V3SwapRouterAddress,
    V3SwapRouterABI,
    signer
  );

  const amountInStr = String(amount);
  const amountIn = ethers.parseUnits(amountInStr, 18);

  const approveData = tokenInContract.interface.encodeFunctionData("approve", [
    V3SwapRouterAddress,
    amountIn,
  ]);

  // Parameters for the exact input single swap
  const params = {
    tokenIn: tokenIn,
    tokenOut: tokenOut,
    fee: fee,
    recipient: WALLET_ADDRESS,
    deadline: deadline,
    amountIn: amountIn,
    amountOutMinimum: 0,
    sqrtPriceLimitX96: 0,
  };

  const swapData = swapRouterContract.interface.encodeFunctionData(
    "exactInputSingle",
    [params]
  );

  const calls = [approveData, swapData];
  const encMultiCall = swapRouterContract.interface.encodeFunctionData(
    "multicall",
    [calls]
  );
  const txArgs = {
    to: V3SwapRouterAddress,
    from: WALLET_ADDRESS,
    data: encMultiCall,
  };

  // Estimate the gas limit for the transaction
  const gasLimit = swapRouterContract.multicall.estimateGas([calls]);
  console.log("Gas Limit for your transaction is: ", gasLimit);

  // Send the transaction 
  try {
    const tx = await signer.sendTransaction(txArgs);
    console.log("tx", tx);
    const receipt = await tx.wait();
    console.log("receipt", receipt);
  } catch (error) {
    console.error("Transaction failed:", error);
    throw error;
  }
}

// Function to swap ETH to a token
async function swapEthToToken(tokenOut: string, amount: string) {
  const amountInStr = String(amount);
  const amountIn = ethers.parseUnits(amountInStr, 18);

  const WETHContract = new ethers.Contract(WETH, ERC20_ABI, signer);
  const swapRouterContract = new ethers.Contract(
    V3SwapRouterAddress,
    V3SwapRouterABI,
    signer
  );

  const approveData = WETHContract.interface.encodeFunctionData("approve", [
    V3SwapRouterAddress,
    amountIn,
  ]);

  const params = {
    tokenIn: WETH,
    tokenOut: tokenOut,
    fee: fee,
    recipient: WALLET_ADDRESS,
    deadline: deadline,
    amountIn: amountIn,
    amountOutMinimum: 0,
    sqrtPriceLimitX96: 0,
  };

  const swapData = swapRouterContract.interface.encodeFunctionData(
    "exactInputSingle",
    [params]
  );
  const refundData = swapRouterContract.interface.encodeFunctionData(
    "refundETH",
    []
  );

  const calls = [approveData, swapData, refundData];
  const encMultiCall = swapRouterContract.interface.encodeFunctionData(
    "multicall",
    [calls]
  );
  const txArgs = {
    to: V3SwapRouterAddress,
    from: WALLET_ADDRESS,
    data: encMultiCall,
  };

  const gasLimit = await swapRouterContract.multicall.estimateGas([calls]);
  console.log("Gas Limit for your transaction is: ", gasLimit);

  try {
    const tx = await signer.sendTransaction(txArgs);
    console.log("tx", tx);
    const receipt = await tx.wait();
    console.log("receipt", receipt);
  } catch (error) {
    console.error("Transaction failed:", error);
    throw error;
  }
}

// Function to swap tokens to ETH
async function swapTokensToETH(tokenIn: string, amount: string) {
  const tokenInContract = new ethers.Contract(tokenIn, ERC20_ABI, signer);
  const swapRouterContract = new ethers.Contract(
    V3SwapRouterAddress,
    V3SwapRouterABI,
    signer
  );

  const amountInStr = String(amount);
  const amountIn = ethers.parseUnits(amountInStr, 18);

  const approveData = tokenInContract.interface.encodeFunctionData("approve", [
    V3SwapRouterAddress,
    amountIn,
  ]);

  const params = {
    tokenIn: tokenIn,
    tokenOut: WETH,
    fee: fee,
    recipient: WALLET_ADDRESS,
    deadline: deadline,
    amountIn: amountIn,
    amountOutMinimum: 0,
    sqrtPriceLimitX96: 0,
  };

  const swapData = swapRouterContract.interface.encodeFunctionData(
    "exactInputSingle",
    [params]
  );
  const refundData = swapRouterContract.interface.encodeFunctionData(
    "refundETH",
    []
  );

  const calls = [approveData, swapData, refundData];
  const encMultiCall = swapRouterContract.interface.encodeFunctionData(
    "multicall",
    [calls]
  );
  const txArgs = {
    to: V3SwapRouterAddress,
    from: WALLET_ADDRESS,
    data: encMultiCall,
  };

  try {
    const tx = await signer.sendTransaction(txArgs);
    console.log("tx", tx);
    const receipt = await tx.wait();
    console.log("receipt", receipt);
  } catch (error) {
    console.error("Transaction failed:", error);
    throw error;
  }

  const WETHContract = new ethers.Contract(WETH, ERC20_ABI, signer);
  const wETHBalance = await WETHContract.balanceOf(WALLET_ADDRESS);

  const paramsUnwrapETH = {
    amountMinimum: wETHBalance,
    recipient: WALLET_ADDRESS,
  };

  const unwrapETHData = swapRouterContract.interface.encodeFunctionData(
    "unwrapWETH9",
    [paramsUnwrapETH]
  );
  const unwrapTxArgs = {
    to: V3SwapRouterAddress,
    from: WALLET_ADDRESS,
    data: unwrapETHData,
  };

  try {
    const unwrapTxResponse = await signer.sendTransaction(unwrapTxArgs);
    const unwrapReceipt = await unwrapTxResponse.wait();
    console.log("receipt", unwrapReceipt);
  } catch (error) {
    console.error("Transaction failed:", error);
    throw error;
  }
}
