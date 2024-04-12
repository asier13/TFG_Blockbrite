// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;

    // Evento que se emitirá cada vez que un nuevo NFT sea acuñado
    event NFTMinted(uint256 tokenId, address recipient, string tokenURI);

    constructor() ERC721("MyNFT", "MNFT") {
        // El constructor de Ownable se llama automáticamente sin argumentos.
    }

    /**
     * @dev Función para acuñar un nuevo NFT.
     * @param recipient dirección del destinatario del NFT.
     * @param tokenURI URI del token para asociar con el NFT.
     * @return El tokenId del nuevo NFT acuñado.
     */
    function mintNFT(address recipient, string memory tokenURI) public onlyOwner returns (uint256) {
        _tokenIds++;
        uint256 newItemId = _tokenIds;

        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);

        // Emitir el evento de acuñado de NFT.
        emit NFTMinted(newItemId, recipient, tokenURI);

        return newItemId;
    }
}
