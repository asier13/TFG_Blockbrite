// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Blockbrite is ERC721URIStorage, ERC721Enumerable, Ownable {
    using SafeMath for uint256;

    uint256 private _tokenIds;
    mapping(uint256 => uint256) public tokenPrices;
    mapping(uint256 => bool) public isListed;
    mapping(uint256 => address) public originalCreators;
    mapping(uint256 => string) public tokenCategories;
    uint256 public constant ROYALTY_PERCENTAGE = 5;

    event NFTMinted(uint256 indexed tokenId, address indexed recipient, string tokenURI, uint256 price);
    event NFTBought(uint256 indexed tokenId, address indexed newOwner, uint256 price);
    event NFTListed(uint256 indexed tokenId, uint256 price);
    event NFTDelisted(uint256 indexed tokenId);

    constructor() ERC721("Blockbrite", "MNFT") {}

    function mintMultipleNFTs(address recipient, string[] memory tokenURIs, uint256[] memory prices, string[] memory categories) public {
        require(tokenURIs.length == prices.length && tokenURIs.length == categories.length, "Input arrays must have the same length");
        require(tokenURIs.length <= 10, "Can only mint up to 10 NFTs at a time");

        for (uint256 i = 0; i < tokenURIs.length; i++) {
            _tokenIds++;
            uint256 newItemId = _tokenIds;

            _mint(recipient, newItemId);
            _setTokenURI(newItemId, tokenURIs[i]);
            tokenPrices[newItemId] = prices[i];
            tokenCategories[newItemId] = categories[i];
            originalCreators[newItemId] = recipient;
            isListed[newItemId] = false; // El NFT no está listado de inicio

            emit NFTMinted(newItemId, recipient, tokenURIs[i], prices[i]);
        }
    }

    function getTokensForSaleByCategory(string memory category) public view returns (uint256[] memory) {
    uint256 totalTokensForCategory = 0;
    for (uint256 i = 1; i <= _tokenIds; i++) {
        if (isListed[i] && keccak256(abi.encodePacked(tokenCategories[i])) == keccak256(abi.encodePacked(category))) {
            totalTokensForCategory++;
        }
    }

    uint256[] memory tokensForSaleCategory = new uint256[](totalTokensForCategory);
    uint256 currentIndex = 0;
    for (uint256 i = 1; i <= _tokenIds; i++) {
        if (isListed[i] && keccak256(abi.encodePacked(tokenCategories[i])) == keccak256(abi.encodePacked(category))) {
            tokensForSaleCategory[currentIndex] = i;
            currentIndex++;
        }
    }
    return tokensForSaleCategory;
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
        for (uint256 i = 1; i <= _tokenIds; i++) {
            if (tokenPrices[i] > 0 && isListed[i]) {
                totalTokensForSale++;
            }
        }

        uint256[] memory tokensForSale = new uint256[](totalTokensForSale);
        uint256 currentIndex = 0;
        for (uint256 i = 1; i <= _tokenIds; i++) {
            if (tokenPrices[i] > 0 && isListed[i]) {
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
            if (tokenPrices[tokenId] > 0 && isListed[tokenId]) {
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

function delistNFT(uint256 tokenId) public {
    require(ownerOf(tokenId) == msg.sender, "Only the owner can delist the NFT");
    require(isListed[tokenId], "NFT is not listed");
    address originalCreator = originalCreators[tokenId];
    uint256 originalPrice = tokenPrices[tokenId];
    
    if (originalCreator == msg.sender) {
        tokenPrices[tokenId] = originalPrice;
    } else {
        tokenPrices[tokenId] = 0;
    }

    isListed[tokenId] = false; // Marcar el NFT como no listado
    emit NFTDelisted(tokenId); 
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

    function totalSupply()
        public view override(ERC721Enumerable)
        returns (uint256)
    {
        return super.totalSupply();
    }
}
