// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;


contract VaultRegistry {

    mapping(address => bytes32) private vaultHashes;

    event VaultHashUpdated(
        address indexed user,
        bytes32 vaultHash,
        uint256 timestamp
    );
    function updateVaultHash(bytes32 _vaultHash) external {
        require(_vaultHash != bytes32(0), "Invalid vault hash");

        vaultHashes[msg.sender] = _vaultHash;

        emit VaultHashUpdated(
            msg.sender,
            _vaultHash,
            block.timestamp
        );
    }

   
    function getVaultHash(address user)
        external
        view
        returns (bytes32)
    {
        return vaultHashes[user];
    }

   
    function verifyVault(
        address user,
        bytes32 localHash
    ) external view returns (bool) {
        return vaultHashes[user] == localHash;
    }
}
