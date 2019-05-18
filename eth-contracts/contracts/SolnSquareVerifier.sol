pragma solidity >=0.4.21 <0.6.0;

import "./ERC721Mintable.sol";
import "./verifier.sol";



// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is ERC721Mintable, Verifier {
// TODO define a solutions struct that can hold an index & an address
   struct solutions  {
        uint256 index;
        address wallet;
    }

//TODO define an array of the above struct
  solutions[] arraySolutions;

//TODO define a mapping to store unique solutions submitted
  mapping(bytes32 => bool) uniqueSolutionsSubmitted;

//TODO Create an event to emit when a solution is added
  event SolutionAdded(bytes32 key, uint256 index, address wallet);


//TODO Create a function to add the solutions to the array and emit the event
  function addSolution(bytes32 _key, uint256 _tokenId, address _wallet) internal {
    arraySolutions.push(
        solutions ({index : _tokenId,
                    wallet: _wallet
                    })
    );
    uniqueSolutionsSubmitted[_key] = true;
    emit SolutionAdded(_key, _tokenId, _wallet);
  }

// TODO Create a function to mint new NFT only after the solution has been verified
//  - make sure the solution is unique (has not been used before)
//  - make sure you handle metadata as well as tokenSuplly

  function mintToken(
            address to,
            uint256 tokenId,
            uint[2] memory a,
            uint[2] memory a_p,
            uint[2][2] memory b,
            uint[2] memory b_p,
            uint[2] memory c,
            uint[2] memory c_p,
            uint[2] memory h,
            uint[2] memory k,
            uint[2] memory input
  ) public returns (bool) {

        // generate the key
        bytes32 key = keccak256(abi.encodePacked(a, a_p, b, b_p, c, c_p, h, k, input));

        require(uniqueSolutionsSubmitted[key] == false, "This solution was already used!");

        // check if the proof is valid
        bool isValidProof = verifyTx(a, a_p, b, b_p, c, c_p, h, k, input);

        require(isValidProof == true, "The provided proof is not valid!");

        // mint the token
        mint(to, tokenId);

        // store the solution
        addSolution(key, tokenId, msg.sender);

        return true;

  }
}
















































