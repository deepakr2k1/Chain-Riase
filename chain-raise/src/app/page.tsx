'use client';
import { useReadContract } from "thirdweb/react";
import { client } from "./client";
import { sepolia } from "thirdweb/chains";
import { getContract } from "thirdweb";
import { CampaignCard } from './components/CampaignCard';
import { CHAIN_RAISE_CONTRACT_METHODS, CHAIN_RAISE_FACTORY_ADDRESS } from './constants/contracts';

export default function Home() {
	// Get CrowdfundingFactory contract
	const contract = getContract({
		client: client,
		chain: sepolia,
		address: CHAIN_RAISE_FACTORY_ADDRESS,
	});

	// Get all campaigns deployed with CrowdfundingFactory
	const { data: campaigns, isLoading: isLoadingCampaigns, refetch: refetchCampaigns } = useReadContract({
		contract: contract,
		method: CHAIN_RAISE_CONTRACT_METHODS.GET_ALL_CAMPAIGNS,
		params: []
	});

	return (
		<main className="mx-auto max-w-7xl px-4 mt-4 sm:px-6 lg:px-8">
			<div className="py-10">
				<h1 className="text-4xl font-bold mb-4">All Campaigns</h1>
				<div className="grid grid-cols-3 gap-4">
					{!isLoadingCampaigns && campaigns ? (
						campaigns.length > 0 ? (
							campaigns.map((campaign) => (
								<CampaignCard
									key={campaign.campaignAddress}
									campaignAddress={campaign.campaignAddress}
								/>
							))
						) : (
							<p>No Campaigns</p>
						)
					) : (
						<p>Loading...</p>
					)}
				</div>
			</div>
		</main>
	);
}
