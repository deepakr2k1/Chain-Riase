"use client";
import { useState } from "react";
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { useActiveAccount, useReadContract } from "thirdweb/react";
import { client } from "@/app/client";
import { CampaignCard } from "@/app/components/CampaignCard";
import { CreateCampaignModal } from '@/app/components/modals/CreateCampaignModal';
import { CHAIN_RAISE_FACTORY_ADDRESS, CHAIN_RAISE_CONTRACT_METHODS } from "@/app/constants/contracts";

export default function DashboardPage() {
    const account = useActiveAccount();

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const contract = getContract({
        client: client,
        chain: sepolia,
        address: CHAIN_RAISE_FACTORY_ADDRESS,
    });

    // Get all my Campaigns
    const { data: myCampaigns, isLoading: isLoadingMyCampaigns, refetch, } = useReadContract({
        contract: contract,
        method: CHAIN_RAISE_CONTRACT_METHODS.GET_USER_CAMPAIGNS,
        params: [account?.address as string],
    });

    return (
        <div className="mx-auto max-w-7xl px-4 mt-16 sm:px-6 lg:px-8">
            <div className="flex flex-row justify-between items-center mb-8">
                <p className="text-4xl font-semibold">Dashboard</p>
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    onClick={() => setIsModalOpen(true)}
                >
                    Create Campaign
                </button>
            </div>

            <p className="text-2xl font-semibold mb-4">My Campaigns</p>
            <div className="grid grid-cols-3 gap-4">
                {!isLoadingMyCampaigns ?
                    (myCampaigns && myCampaigns.length > 0 ? (
                        myCampaigns.map((campaign, index) => (
                            <CampaignCard key={index} campaignAddress={campaign.campaignAddress} />
                        ))
                    ) : (
                        <p>You've not created any campaigns yet.</p>
                    )) : <p>Loading...</p>
                }
            </div>

            {isModalOpen && (
                <CreateCampaignModal
                    setIsModalOpen={setIsModalOpen}
                    refetch={refetch}
                />
            )}
        </div>
    );
}
