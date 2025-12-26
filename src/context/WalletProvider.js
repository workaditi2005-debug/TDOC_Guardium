import React from "react";
import Web3 from "web3";
import storage from "../utils/storage";

export const WalletContext = React.createContext();
export const useWallet = () => React.useContext(WalletContext);

const WalletProvider = ({ children }) => {
    const [account, setAccount] = React.useState(null);
    const [chainId, setChainId] = React.useState(null);
    const [web3, setWeb3] = React.useState(null);
    const [isAuthenticated, setAuthenticated] = React.useState(false);
    const [appLoading, setAppLoading] = React.useState(false);

    const getProvider = () => {
        if (!window.ethereum) {
            throw new Error("MetaMask not available in extension popup");
        }
        return window.ethereum;
    };

    const connectWallet = async () => {
        setAppLoading(true);
        try {
            const provider = getProvider();

            const accounts = await provider.request({
                method: "eth_requestAccounts",
            });

            const chainId = await provider.request({
                method: "eth_chainId",
            });

            const web3Instance = new Web3(provider);

            setAccount(accounts[0]);
            setChainId(chainId);
            setWeb3(web3Instance);
            setAuthenticated(true);

            storage.set("metamask-connected", { connected: true });
        } catch (err) {
            console.error("MetaMask connection failed:", err);
            setAuthenticated(false);
        } finally {
            setAppLoading(false);
        }
    };

    const disconnectWallet = () => {
        setAccount(null);
        setChainId(null);
        setWeb3(null);
        setAuthenticated(false);
        storage.set("metamask-connected", { connected: false });
    };

    return (
        <WalletContext.Provider
            value={{
                connectWallet,
                disconnectWallet,
                isAuthenticated,
                appLoading,
                account,
                chainId,
                web3,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
};

export default WalletProvider;
