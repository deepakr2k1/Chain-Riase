import { client } from "@/app/client";
import Link from "next/link";
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { useReadContract } from "thirdweb/react";
import { CHAIN_RAISE_CONTRACT_METHODS } from '../constants/contracts';
import { MAX_DESCRIPTION_LENGTH } from '../constants/app';

type CampaignCardProps = {
    campaignAddress: string;
};

export const CampaignCard: React.FC<CampaignCardProps> = ({ campaignAddress }) => {
    const contract = getContract({
        client: client,
        chain: sepolia,
        address: campaignAddress,
    });

    // Get Campaign Name
    const { data: campaignName } = useReadContract({
        contract: contract,
        method: CHAIN_RAISE_CONTRACT_METHODS.NAME,
        params: []
    });

    // Get Campaign Description
    const { data: campaignDesc, isLoading: isLoadingDesc } = useReadContract({
        contract: contract,
        method: CHAIN_RAISE_CONTRACT_METHODS.DESCRIPTION,
        params: []
    });

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
    let balancePercentage = Math.min((parseInt(totalBalance as string) / parseInt(targetFund as string)) * 100, 100);

    const descForHomePage = (desc: string): string => {
        console.log(desc);
        return desc.length > MAX_DESCRIPTION_LENGTH ? `${desc.slice(0, MAX_DESCRIPTION_LENGTH)}...` : desc;
    };

    return (
        <div className="flex flex-col justify-between max-w-sm p-6 bg-white border border-slate-200 rounded-lg shadow">
            <div>
                {/* <h5 className="mb-2 text-2xl font-bold textblue-900 tracking-tight">{campaignName}</h5> */}
                <h5 className="mb-2 font-bold text-gray-600 dark:text-gray-600 text-2xl font-bold tracking-tight">{campaignName}</h5>
                {!isLoadingDesc && campaignDesc && (
                    <p className="mb-3 font-normal text-gray-400 dark:text-gray-400">{descForHomePage(campaignDesc)}</p>
                )}
                {!isLoadingBalance && (
                    <div className="mb-4">
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
            </div>

            <Link href={`/campaign/${campaignAddress}`} passHref={true} >
                <p className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    View Campaign
                    <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                    </svg>
                </p>
            </Link>
        </div>
    )
};