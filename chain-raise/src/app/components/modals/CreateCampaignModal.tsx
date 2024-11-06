"use client";
import { useState } from "react";
import { sepolia } from "thirdweb/chains";
import { deployPublishedContract } from "thirdweb/deploys";
import { useActiveAccount } from "thirdweb/react";
import { client } from "@/app/client";
import { showNotification } from "@/app/utils/notification";
import { PUBLISHER_WALLET_ADDRESS } from "@/app/constants/contracts";

type CreateCampaignModalProps = {
    setIsModalOpen: (value: boolean) => void;
    refetch: () => void;
};

export const CreateCampaignModal = ({
    setIsModalOpen,
    refetch,
}: CreateCampaignModalProps) => {
    const account = useActiveAccount();
    const [isDeployingContract, setIsDeployingContract] = useState<boolean>(false);
    const [campaignName, setCampaignName] = useState<string>("");
    const [campaignDescription, setCampaignDescription] = useState<string>("");
    const [campaignTargetFund, setCampaignTargetFund] = useState<number>(1);
    const [campaignDeadline, setCampaignDeadline] = useState<number>(1);

    // Deploy contract from ChainRaiseFactory
    const handleDeployContract = async () => {
        if (isDeployingContract) return;
        if (!campaignName || campaignName === "" || !campaignDescription || campaignDescription === "" || !campaignTargetFund || !campaignDeadline) {
            showNotification("Please enter all required fields", "WARNING");
            return;
        } else if (campaignTargetFund < 1) {
            showNotification("Campaign target fund must be atleat $1", "WARNING");
            return;
        } else if (campaignDeadline < 1) {
            showNotification("Campaign Deadline must be atleat 1 day", "WARNING");
            return;
        }
        setIsDeployingContract(true);
        try {
            const contractAddress = await deployPublishedContract({
                client: client,
                chain: sepolia,
                account: account!,
                contractId: "ChainRaise",
                contractParams: {
                    _name: campaignName,
                    _description: campaignDescription,
                    _targetFund: campaignTargetFund,
                    _durationInDays: campaignDeadline
                },
                publisher: PUBLISHER_WALLET_ADDRESS,
                version: "1.0.1",
            });
            showNotification("Campaign created successfully", "SUCCESS");
        } catch (error) {
            showNotification(error as string, "ERROR");
        } finally {
            setIsDeployingContract(false);
            setIsModalOpen(false);
            refetch;
        }
    };

    const handleCampaignTargetFund = (value: number) => {
        setCampaignTargetFund(Math.max(1, value));
    };

    const handleCampaignDurationChange = (value: number) => {
        setCampaignDeadline(Math.max(1, value));
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center backdrop-blur-md">
            <div className="w-1/2 bg-slate-100 p-6 rounded-md">
                <div className="flex justify-between items-center mb-4">
                    <p className="text-lg font-semibold">Create a Campaign</p>
                    <button
                        className="text-sm px-4 py-2 bg-slate-600 text-white rounded-md"
                        onClick={() => setIsModalOpen(false)}
                    >
                        Close
                    </button>
                </div>

                <div className="flex flex-col">
                    <label>Campaign Name*</label>
                    <input
                        type="text"
                        value={campaignName}
                        onChange={(e) => setCampaignName(e.target.value)}
                        placeholder="Campaign Name"
                        className="mb-4 px-4 py-2 bg-slate-300 rounded-md"
                    />

                    <label>Campaign Description*</label>
                    <textarea
                        value={campaignDescription}
                        onChange={(e) => setCampaignDescription(e.target.value)}
                        placeholder="Campaign Description"
                        className="mb-4 px-4 py-2 bg-slate-300 rounded-md"
                    />

                    <label>{`Campaign Target Fund  ($)*`}</label>
                    <input
                        type="number"
                        value={campaignTargetFund}
                        onChange={(e) => handleCampaignTargetFund(parseInt(e.target.value))}
                        className="mb-4 px-4 py-2 bg-slate-300 rounded-md"
                    />

                    <label>{`Campaign Duration (Days)*`}</label>
                    <input
                        type="number"
                        value={campaignDeadline}
                        onChange={(e) =>
                            handleCampaignDurationChange(parseInt(e.target.value))
                        }
                        className="mb-4 px-4 py-2 bg-slate-300 rounded-md"
                    />

                    <button
                        className="mt-4 px-4 py-2 bg-black text-white rounded-md"
                        onClick={handleDeployContract}
                    >
                        {isDeployingContract ? "Creating Campaign..." : "Create Campaign"}
                    </button>
                </div>
            </div>
        </div>
    );
};
