// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract SplitPay {
    address public owner;
    
    constructor(address _owner) {
        owner = _owner;
    }
    
    function send(address payable[] memory to, uint256[] memory amounts) payable onlyOwner() public {
        
        require(to.length == amounts.length, 'unspecified amount or receiving address');
        for(uint256 i = 0; i < to.length; i++) {
            to[i].transfer(amounts[i]);
        }
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, 'only the owner can make split payments');
        _;
    }
}