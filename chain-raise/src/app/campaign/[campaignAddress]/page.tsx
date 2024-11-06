'use client';
import { client } from "@/app/client";
import { FundCampaignModal } from '@/app/components/modals/FundCampaignModal';
import { CHAIN_RAISE_CONTRACT_METHODS } from '@/app/constants/contracts';
import { showNotification } from '@/app/utils/notification';
import { useParams } from "next/navigation";
import { useState } from "react";
import { getContract, prepareContractCall, sendTransaction, ThirdwebContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { waitForReceipt } from "thirdweb";

export default function CampaignPage() {
    const account = useActiveAccount();

    const { campaignAddress } = useParams();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const contract = getContract({
        client: client,
        chain: sepolia,
        address: campaignAddress as string,
    });

    // Get Campaign Name
    const { data: name, isLoading: isLoadingName } = useReadContract({
        contract: contract,
        method: CHAIN_RAISE_CONTRACT_METHODS.NAME,
        params: []
    });

    // Get Campaign Description
    const { data: description } = useReadContract({
        contract: contract,
        method: CHAIN_RAISE_CONTRACT_METHODS.DESCRIPTION,
        params: []
    });

    // Get Campaign Deadline
    const { data: deadline, isLoading: isLoadingDeadline } = useReadContract({
        contract: contract,
        method: CHAIN_RAISE_CONTRACT_METHODS.DEADLINE,
        params: [],
    });

    // Convert deadline to a date
    const deadlineDate = new Date(parseInt(deadline?.toString() as string) * 1000);
    // Check if deadline has passed
    // const hasDeadlinePassed = deadlineDate < new Date();

    // Get Campaign Target Fund
    const { data: fund, isLoading: isLoadingTargetFund } = useReadContract({
        contract: contract,
        method: CHAIN_RAISE_CONTRACT_METHODS.TARGET_FUND,
        params: [],
    });

    // Get total funded balance of the campaign
    const { data: balance, isLoading: isLoadingBalance } = useReadContract({
        contract: contract,
        method: CHAIN_RAISE_CONTRACT_METHODS.BALANCE,
        params: [],
    });

    // Calulate the total funded balance percentage
    const totalBalance = balance?.toString();
    const targetFund = fund?.toString();
    const remainingFund = Math.max(parseInt(targetFund) - parseInt(totalBalance), 0);
    let balancePercentage = Math.min((parseInt(totalBalance as string) / parseInt(targetFund as string)) * 100, 100);

    // Get Campaign Owner
    const { data: owner, isLoading: isLoadingOwner } = useReadContract({
        contract: contract,
        method: CHAIN_RAISE_CONTRACT_METHODS.OWNER,
        params: [],
    });

    // Get Campaign State
    const { data: status } = useReadContract({
        contract,
        method: CHAIN_RAISE_CONTRACT_METHODS.STATE,
        params: []
    });

    const withdrawAmount = async () => {
        const transaction = await prepareContractCall({
            contract,
            method: "",
            params: []
        });

        const { transactionHash } = await sendTransaction({
            transaction,
            account
        });

        const receipt = await waitForReceipt({
            client: client,
            chain: sepolia,
            transactionHash: transactionHash,
        });

        if (receipt.status == "success") {
            showNotification("Withdrawal Successful!", "SUCCESS");
        } else {
            showNotification("Withdrawal Failed, Please try again.", "ERROR");
        }
    }

    const refundAmount = async () => {
        const transaction = await prepareContractCall({
            contract,
            method: CHAIN_RAISE_CONTRACT_METHODS.WITHDRAW,
            params: []
        });

        const { transactionHash } = await sendTransaction({
            transaction,
            account
        });

        const receipt = await waitForReceipt({
            client: client,
            chain: sepolia,
            transactionHash: transactionHash,
        });

        if (receipt.status == "success") {
            showNotification("Refund Successful!", "SUCCESS");
        } else {
            showNotification("Refund Failed, Please try again.", "ERROR");
        }
    }

    return (
        <div className="mx-auto max-w-7xl px-2 mt-4 sm:px-6 lg:px-8">
            <div className="flex flex-row justify-between items-center">
                {!isLoadingName && (
                    <p className="text-4xl font-semibold">{name}</p>
                )}
                <div className="flex flex-row">
                    <p className={`px-6 py-2 text-white rounded-md mr-2 ${status === 0 ? 'bg-blue-500' :
                        status === 1 ? 'bg-darkorange-500' :
                            status === 2 ? 'bg-green-500' :
                                status === 3 ? 'bg-red-500' : 'bg-gray-500'}`
                    }>
                        {status === 0 ? " Active" :
                            status === 1 ? " Paused" :
                                status === 2 ? " Successful" :
                                    status === 3 ? " Failed" : " Unknown"}
                    </p>
                </div>
            </div>

            <div className="my-4">
                <p className="text-lg font-semibold">Description:</p>
                <p>{description}</p>
            </div>

            <div className="mb-4">
                <p className="text-lg font-semibold">Deadline</p>
                {!isLoadingDeadline && (
                    <p>{deadlineDate.toDateString()}</p>
                )}
            </div>

            {!isLoadingBalance && (
                <div className="mb-4">
                    <p className="text-lg font-semibold">Target Fund: ${targetFund?.toString()}</p>
                    <div className="relative w-full h-6 bg-gray-200 rounded-full dark:bg-gray-700">
                        <div className="h-6 bg-blue-600 rounded-full dark:bg-blue-500 text-right" style={{ width: `${balancePercentage?.toString()}%` }}>
                            <p className="text-white dark:text-white text-xs p-1">${balance?.toString()}</p>
                        </div>
                        <p className="absolute top-0 right-0 text-white dark:text-white text-xs p-1">
                            {balancePercentage >= 100 ? "" : `${balancePercentage?.toString()}%`}
                        </p>
                    </div>
                </div>
            )}

            <div>
                <div className="grid grid-cols-12 gap-4">
                    <button
                        className={`col-span-6 flex flex-col text-center justify-center items-center font-semibold p-2 bg-blue-500 text-white border border-slate-100 rounded-lg shadow ${(status == 0 || status == 1) ? 'bg-blue-400 cursor-not-allowed' : ''}`}
                        onClick={() => setIsModalOpen(true)}
                        disabled={status == 2 || status == 3}
                    > Fund Campaign </button>
                    {
                        (account?.address == owner) ?
                            <button
                                className={`col-span-6 flex flex-col text-center justify-center items-center font-semibold p-2 bg-blue-500 text-white border border-slate-100 rounded-lg shadow ${(status == 0 || status == 1) ? 'bg-blue-400 cursor-not-allowed' : ''}`}
                                onClick={withdrawAmount}
                                disabled={status == 0 || status == 1}
                            > Withdraw </button>
                            :
                            <button
                                className={`col-span-6 flex flex-col text-center justify-center items-center font-semibold p-2 bg-blue-500 text-white border border-slate-100 rounded-lg shadow ${(status == 0 || status == 1) ? 'bg-blue-400 cursor-not-allowed' : ''}`}
                                onClick={refundAmount}
                                disabled={status == 0 || status == 1}
                            > Refund </button>
                    }
                </div>
            </div>

            {
                isModalOpen && (
                    <FundCampaignModal
                        setIsModalOpen={setIsModalOpen}
                        campaignName={name}
                        campaignRemainingFund={remainingFund}
                        contract={contract}
                    />
                )
            }
        </div >
    );
}
