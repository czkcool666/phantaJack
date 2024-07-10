// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721, Ownable {
    uint256 public nextTokenId = 0;
    uint256 public constant MINT_PRICE = 0.0001 ether;
    address payable public recipient;

    constructor() ERC721("MyNFT", "NFT") Ownable(msg.sender)  {
        recipient = payable(0xE25696E15dd5776F1410647e24c242385A39E973); // Set the recipient address
    }

    function mint() public payable {
        require(msg.value >= MINT_PRICE, "Not enough ether sent");

        // Transfer the ETH to the recipient
        recipient.transfer(msg.value);

        // Mint the NFT to the sender's address
        _mint(msg.sender, nextTokenId);
        nextTokenId++;
    }

    // Simulate minting without requiring ETH
    function simulateMint() public {
        _mint(msg.sender, nextTokenId);
        nextTokenId++;
    }

    // Withdraw function to allow the owner to withdraw the ETH
    function withdraw() public onlyOwner {
        require(address(this).balance > 0, "No balance to withdraw");
        payable(owner()).transfer(address(this).balance);
    }

    // Update the recipient address if needed
    function updateRecipient(address payable _newRecipient) public onlyOwner {
        recipient = _newRecipient;
    }
}
