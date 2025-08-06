# Copilot Instructions for CrowdFund Smart Contract Project

## Project Overview

This is a Solidity crowdfunding platform built with Foundry. The core contract (`src/CrowdFund.sol`) enables campaign creation, donations, and fund management on Ethereum.

## Architecture & Key Components

### Core Contract Structure

- **CrowdFund.sol**: Main contract with campaign management, donation processing, and fund transfers
- **Campaign struct**: Stores owner, metadata (title, description, image), financial data (target, collected amounts), and donor tracking arrays
- **State management**: Uses `numberOfCampaigns` counter and `campaigns` mapping for storage

### Critical Patterns

- **Donation flow**: Immediate transfer to campaign owner via `call{value: amount}("")` - funds don't remain in contract
- **Array tracking**: Parallel `donators[]` and `donations[]` arrays maintain donation history
- **Deadline validation**: `block.timestamp` comparison in `createCampaign()` prevents past deadlines

## Development Workflow

### Build & Test Commands

```bash
forge build          # Compile contracts
forge test           # Run tests (currently empty template)
forge fmt            # Format Solidity code
forge snapshot       # Generate gas usage reports
```

### Local Development

```bash
anvil               # Start local Ethereum node
# Deploy: forge script script/CrowdFund.s.sol --rpc-url http://localhost:8545 --private-key <key>
```

## Project-Specific Conventions

### File Organization

- `src/`: Core smart contracts
- `test/`: Foundry test files (using forge-std/Test.sol)
- `script/`: Deployment scripts (using forge-std/Script.sol)
- `lib/forge-std/`: Git submodule for Foundry standard library

### Solidity Patterns

- **License**: MIT for main contract, UNLICENSED for tests/scripts
- **Pragma**: `^0.8.13` across all files
- **Imports**: Use forge-std imports: `{Test, console}` and `{Script, console}`
- **Error handling**: `require()` statements with descriptive messages

### Security Considerations

- **Reentrancy**: Current design transfers immediately, no reentrancy guards
- **Access control**: No ownership/admin patterns - campaigns are user-owned
- **Fund safety**: No contract balance - all donations forwarded to campaign owners

## Key Integration Points

- **Forge Standard Library**: Test utilities and deployment helpers via git submodule
- **Ethereum interaction**: Direct payable functions and low-level calls for transfers
- **Frontend integration**: Public view functions for campaign data (`getCampaigns()`, `getCampaign()`, `getDonators()`)

## Development Notes

- Test suite is currently empty - requires implementation for production readiness
- Deploy script template exists but needs CrowdFund-specific implementation
- No upgrade patterns - contract is immutable once deployed
