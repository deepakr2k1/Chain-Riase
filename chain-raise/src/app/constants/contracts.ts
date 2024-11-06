export const PUBLISHER_WALLET_ADDRESS = "0xDfbEf68247a1bfb0Ea465456632A1a788636e55D";
export const CHAIN_RAISE_FACTORY_ADDRESS = "0xf8269d7dF8EE5830046B1B13DA8775af0A75EF3D";
export const CHAIN_RAISE_CONTRACT_METHODS = {
    GET_ALL_CAMPAIGNS: "function getAllCampaigns() view returns ((address campaignAddress, address owner, string name, uint256 creationTime)[])",
    GET_USER_CAMPAIGNS: "function getUserCampaigns(address _user) view returns ((address campaignAddress, address owner, string name, uint256 creationTime)[])",
    NAME: "function name() view returns (string)",
    DESCRIPTION: "function description() view returns (string)",
    DEADLINE: "function deadline() view returns (uint256)",
    TARGET_FUND: "function targetFund() view returns (uint256)",
    BALANCE: "function getContractBalance() view returns (uint256)",
    OWNER: "function owner() view returns (address)",
    STATE: "function currentState() view returns (uint8)",
    WITHDRAW: "function withdraw()",
    REFUND: "function refund()"
}
