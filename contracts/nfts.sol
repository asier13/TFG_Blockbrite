// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract MyNFT is ERC721URIStorage, ERC721Enumerable, Ownable {
    using SafeMath for uint256;

    uint256 private _tokenIds;
    mapping(uint256 => uint256) public tokenPrices;
    mapping(uint256 => bool) public isListed;  // Agregado para rastrear si un NFT está listado
    mapping(uint256 => address) public originalCreators;
    uint256 public constant ROYALTY_PERCENTAGE = 5;

    event NFTMinted(uint256 indexed tokenId, address indexed recipient, string tokenURI, uint256 price);
    event NFTBought(uint256 indexed tokenId, address indexed newOwner, uint256 price);
    event NFTListed(uint256 indexed tokenId, uint256 price);

    constructor() ERC721("MyNFT", "MNFT") {}

    function mintMultipleNFTs(address recipient, string[] memory tokenURIs, uint256[] memory prices) public {
        require(tokenURIs.length == prices.length, "URIs and prices length mismatch");
        require(tokenURIs.length <= 10, "Can only mint up to 10 NFTs at a time");

        for (uint256 i = 0; i < tokenURIs.length; i++) {
            _tokenIds++;
            uint256 newItemId = _tokenIds;

            _mint(recipient, newItemId);
            _setTokenURI(newItemId, tokenURIs[i]);
            tokenPrices[newItemId] = prices[i];
            originalCreators[newItemId] = recipient;
            isListed[newItemId] = false; // Inicialmente, el NFT no está listado

            emit NFTMinted(newItemId, recipient, tokenURIs[i], prices[i]);
        }
    }

    function buyNFT(uint256 tokenId) public payable {
        uint256 price = tokenPrices[tokenId];
        require(_exists(tokenId), "Token does not exist");
        require(price > 0, "This token is not for sale");
        require(msg.value >= price, "Not enough ether sent");

        address tokenSeller = ownerOf(tokenId);
        address originalCreator = originalCreators[tokenId];

        uint256 royaltyAmount = price.mul(ROYALTY_PERCENTAGE).div(100);
        payable(originalCreator).transfer(royaltyAmount);
        payable(tokenSeller).transfer(msg.value.sub(royaltyAmount));

        _transfer(tokenSeller, msg.sender, tokenId);
        tokenPrices[tokenId] = 0;
        isListed[tokenId] = false;

        emit NFTBought(tokenId, msg.sender, price);
    }

    function getTokensForSale() public view returns (uint256[] memory) {
        uint256 totalTokensForSale = 0;
        // Primero calculamos cuántos tokens están en venta para poder crear un array de ese tamaño
        for (uint256 i = 1; i <= _tokenIds; i++) {
            if (tokenPrices[i] > 0) {
                totalTokensForSale++;
            }
        }

        // Ahora que sabemos cuántos tokens están en venta, podemos crear el array y llenarlo
        uint256[] memory tokensForSale = new uint256[](totalTokensForSale);
        uint256 currentIndex = 0;
        for (uint256 i = 1; i <= _tokenIds; i++) {
            if (tokenPrices[i] > 0) {
                tokensForSale[currentIndex] = i;
                currentIndex++;
            }
        }
        return tokensForSale;
    }

    function getTokensForSaleByOwner(address owner) public view returns (uint256[] memory) {
        uint256 totalOwnedTokens = balanceOf(owner);
        uint256[] memory temp = new uint256[](totalOwnedTokens);
        uint256 count = 0;

        for (uint256 i = 0; i < totalOwnedTokens; i++) {
            uint256 tokenId = tokenOfOwnerByIndex(owner, i);
            if (tokenPrices[tokenId] > 0 && isListed[tokenId]) { // Asegurarse que el NFT está listado para la venta
                temp[count] = tokenId;
                count++;
            }
        }

        uint256[] memory tokensForSaleOwner = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            tokensForSaleOwner[i] = temp[i];
        }

        return tokensForSaleOwner;
    }

    // Función para listar un NFT para la venta
    function listNFT(uint256 tokenId, uint256 price) public {
        require(ownerOf(tokenId) == msg.sender, "Only the owner can list the NFT");
        require(_exists(tokenId), "Token does not exist");
        require(price > 0, "Price must be greater than zero");
        require(!isListed[tokenId], "NFT already listed");
        
        // Si el token no tiene precio, permitir al propietario listarlo con el precio que desee.
        // Si tiene precio y es el minteador original, debe listar al precio establecido.
        // Si el propietario actual no es el creador original, puede listar a cualquier precio.
        tokenPrices[tokenId] = price;
        isListed[tokenId] = true; // Marcar el NFT como listado
        require(price == tokenPrices[tokenId], "You must list the NFT at the minting price");

        emit NFTListed(tokenId, price);
    }
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721URIStorage, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal virtual override (ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
    }

    function tokenOfOwnerByIndex(address owner, uint256 index) public view override(ERC721Enumerable) returns (uint256) {
        return super.tokenOfOwnerByIndex(owner, index);
    }

    function _burn(uint256 tokenId)
    internal
    override(ERC721, ERC721URIStorage)
    {
    super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    // Devuelve el total de tokens utilizando ERC721Enumerable
    function totalSupply()
        public view override(ERC721Enumerable)
        returns (uint256)
    {
        return super.totalSupply();
    }
}
