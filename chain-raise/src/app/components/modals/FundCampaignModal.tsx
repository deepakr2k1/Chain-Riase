'use client';
import { USD_TO_SEPOLIA_ETH } from '@/app/constants/app';
import { showNotification } from '@/app/utils/notification';
import { useState } from "react";
import { prepareContractCall, ThirdwebContract } from "thirdweb";
import { lightTheme, TransactionButton, useActiveAccount, useReadContract } from "thirdweb/react";

type FundCampaignModalProps = {
    setIsModalOpen: (value: boolean) => void
    campaignName: string
    campaignRemainingFund: bigint
    contract: ThirdwebContract
}

export const FundCampaignModal = (
    { setIsModalOpen, campaignName, campaignRemainingFund, contract }: FundCampaignModalProps
) => {
    const [amount, setAmount] = useState<bigint>(1n);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center backdrop-blur-md">
            <div className="w-1/2 bg-slate-100 p-6 rounded-md">
                <div className="flex justify-between items-center mb-4">
                    <p className="text-lg font-semibold">
                        Fund '{campaignName}'
                    </p>
                    <button
                        className="text-sm px-4 py-2 bg-slate-600 text-white rounded-md"
                        onClick={() => setIsModalOpen(false)}
                    >Close</button>
                </div>
                <div className="flex flex-col">
                    <label className="mb-2">Remaining Amount: ${campaignRemainingFund}</label>
                    <label>Fund Amount ({`$`}): </label>
                    <input
                        type="number"
                        min={1}
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter Fund Amount ($)"
                        className="mb-2 px-4 py-2 bg-slate-200 rounded-md"
                    />

                    <label className="mb-4">
                        Fund Amount (Sepolia ETH): {amount ? (parseInt(amount) * USD_TO_SEPOLIA_ETH).toFixed(9) : ""}
                    </label>

                    <TransactionButton
                        transaction={() => prepareContractCall({
                            contract: contract,
                            method: "function fund() payable",
                            params: [],
                            value: BigInt(parseInt(amount))
                        })}

                        onTransactionConfirmed={async () => {
                            showNotification("Funded Successfully!", "SUCCESS");
                            setIsModalOpen(false);
                        }}
                        onError={(error) => showNotification(`ERROR: ${error.message}`, "ERROR")}
                        theme={lightTheme()}
                    > FUND </TransactionButton>
                </div>
            </div>
        </div >
    )
}