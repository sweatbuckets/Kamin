import { BadRequestException, Injectable } from '@nestjs/common';
import { ethers } from 'ethers';

@Injectable()
export class OrderVerificationService {
  private readonly provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  private readonly kaminInterface = new ethers.Interface([
    'function confirmOrder(address market,string menuName,uint256 orderId,uint256 rewardAmount,bytes signature)',
  ]);

  async verifyConfirmedOrder(input: {
    user: string;
    market: string;
    menuName: string;
    orderId: number;
    rewardAmount: number;
    txHash: string;
  }) {
    const { user, market, menuName, orderId, rewardAmount, txHash } = input;

    if (!txHash) {
      throw new BadRequestException('Transaction hash is required');
    }

    const receipt = await this.provider.getTransactionReceipt(txHash);

    if (!receipt || receipt.status !== 1) {
      throw new BadRequestException('Transaction was not confirmed');
    }

    const tx = await this.provider.getTransaction(txHash);

    if (!tx) {
      throw new BadRequestException('Transaction not found');
    }

    const kaminAddress = process.env.KAMIN_ADDRESS?.toLowerCase();

    if (!kaminAddress || tx.to?.toLowerCase() !== kaminAddress) {
      throw new BadRequestException('Unexpected transaction target');
    }

    if (tx.from.toLowerCase() !== user.toLowerCase()) {
      throw new BadRequestException('Transaction sender mismatch');
    }

    const parsed = this.kaminInterface.parseTransaction({
      data: tx.data,
      value: tx.value,
    });

    if (!parsed || parsed.name !== 'confirmOrder') {
      throw new BadRequestException('Unexpected transaction payload');
    }

    const [txMarket, txMenuName, txOrderId, txRewardAmount] = parsed.args;

    if (txMarket.toLowerCase() !== market.toLowerCase()) {
      throw new BadRequestException('Market mismatch');
    }

    if (txMenuName !== menuName) {
      throw new BadRequestException('Menu mismatch');
    }

    if (Number(txOrderId) !== orderId) {
      throw new BadRequestException('Order ID mismatch');
    }

    if (Number(txRewardAmount) !== rewardAmount) {
      throw new BadRequestException('Reward amount mismatch');
    }
  }
}
