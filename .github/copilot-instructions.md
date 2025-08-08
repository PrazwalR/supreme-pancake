# Copilot Instructions for CrowdFund Web3 Platform

## Project Overview

This is a full-stack Web3 crowdfunding platform combining a modern Next.js frontend with Solidity smart contracts. The platform enables users to create bakery funding campaigns, connect MetaMask wallets, and manage blockchain-based fundraising through an intuitive web interface.

## Architecture & Key Components

### Frontend Stack (Next.js 15.4.6 + React 19.1.0)

- **Framework**: Next.js 15 with App Router (`src/app/` directory structure)
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: TailwindCSS with custom component variants and effects
- **Form Management**: React Hook Form with Zod validation for type-safe forms
- **Web3 Integration**: MetaMask wallet connection and Ethereum transaction handling

### Smart Contract Backend (Foundry + Solidity)

- **Contract**: `crowdfund_contracts/src/CrowdFund.sol` - Core crowdfunding logic
- **Development Environment**: Foundry framework with testing and deployment tools
- **Campaign Management**: Struct-based storage with mapping and counter patterns

## Component Architecture

### Core Components

#### `/src/components/Navbar.tsx`

- **Purpose**: Main navigation with tab-based content switching
- **State Management**: Local `activeTab` state controlling content rendering
- **Key Features**:
  - Tab navigation (Create, Owned, Explore, Connect)
  - Enhanced button components with icon effects
  - Responsive design with sticky positioning
  - Background integration for visual hierarchy

#### `/src/components/Form.tsx` (CrowdForm)

- **Purpose**: Campaign creation form with Web3 wallet integration
- **Validation**: Zod schema with comprehensive field validation
- **Key Features**:
  - MetaMask wallet connection (`connectWallet()` function)
  - Form validation for bakery campaigns (title, description, funding goals)
  - Date picker for campaign deadlines
  - ETH amount conversion (ETH to Wei)
  - Real-time form state management

#### `/src/components/ui/button.tsx`

- **Purpose**: Enhanced button component with multiple variants and effects
- **Effects**: expandIcon, shine, gooey animations
- **Variants**: Multiple sizes, colors, and interactive states
- **Integration**: Used throughout navigation and forms for consistent UX

### Smart Contract Structure

#### `CrowdFund.sol` Core Functions

- **`createCampaign()`**: Creates new funding campaigns with validation
- **`donateToCampaign()`**: Processes donations with immediate fund transfer
- **`getCampaigns()`**: Returns all campaigns for frontend display
- **Campaign struct**: Stores owner, metadata, financial data, and donor arrays

## Development Workflow

### Frontend Development

```bash
npm run dev          # Start Next.js development server
npm run build        # Build production application
npm run lint         # ESLint code checking
```

### Smart Contract Development

```bash
cd crowdfund_contracts/
forge build          # Compile Solidity contracts
forge test           # Run contract tests
forge fmt            # Format Solidity code
anvil               # Start local Ethereum node
```

### Component Development Patterns

- **Shadcn/ui Integration**: Use `npx shadcn-ui@latest add <component>` for new UI components
- **Form Patterns**: Implement React Hook Form + Zod for all user input forms
- **State Management**: Use React hooks for local state, consider Context for global state
- **Styling**: TailwindCSS utility classes with custom component variants

## Critical Integration Points

### Web3 Connection Flow

1. **Wallet Detection**: Check for `window.ethereum` (MetaMask)
2. **Account Request**: Use `eth_requestAccounts` method
3. **Address Population**: Auto-populate form fields with connected address
4. **Transaction Handling**: Format data for smart contract interaction

### Form Validation Schema

```typescript
// Key validation patterns used in CrowdForm
const formSchema = z.object({
  title: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[a-zA-Z0-9\s&'-]+$/),
  targetAmount: z.string().refine(ETH_validation_logic),
  deadline: z.date().refine(future_date_validation),
  ownerAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/),
});
```

### Data Conversion Patterns

- **ETH to Wei**: `Number(targetAmount) * Math.pow(10, 18)`
- **Date to Timestamp**: `Math.floor(date.getTime() / 1000)`
- **Address Validation**: Ethereum address regex pattern

## Project-Specific Conventions

### File Organization

```
src/
├── app/                 # Next.js App Router
├── components/          # React components
│   ├── ui/             # shadcn/ui base components
│   ├── Navbar.tsx      # Main navigation
│   └── Form.tsx        # Campaign creation
└── lib/
    └── utils.ts        # Utility functions

crowdfund_contracts/
├── src/CrowdFund.sol   # Main smart contract
├── script/             # Deployment scripts
└── test/               # Contract tests
```

### Styling Patterns

- **Color Scheme**: Black/white with gray accents (`bg-black`, `text-white`, `bg-gray-50`)
- **Spacing**: Consistent padding patterns (`px-6 py-3`, `p-8 md:p-12`)
- **Borders**: Rounded corners with `rounded-xl`, `rounded-3xl` for cards
- **Effects**: Hover states, transitions, and button effects for interactivity

### Form & Validation Patterns

- **Error Handling**: Comprehensive error messages for user guidance
- **Loading States**: `isSubmitting`, `isConnecting` for async operations
- **Success Feedback**: Alert notifications for completed actions
- **Field Types**: Number inputs for ETH amounts, date pickers for deadlines

## Security Considerations

### Frontend Security

- **Input Validation**: Client-side validation with Zod, server-side validation required
- **Wallet Security**: Never store private keys, use read-only wallet connections
- **Form Sanitization**: Regex validation for addresses and input fields

### Smart Contract Security

- **Reentrancy**: Direct fund transfers to campaign owners (no contract balance)
- **Access Control**: Owner-based campaign management
- **Validation**: Deadline checks, amount validation, existence checks

## Development Best Practices

### Component Composition

- **Reusable Components**: Extract common patterns into shared components
- **Props Interface**: Define clear TypeScript interfaces for component props
- **State Management**: Keep state as local as possible, lift up when needed

### Form Development

- **Validation First**: Define Zod schema before building form UI
- **Error Boundaries**: Implement proper error handling for Web3 operations
- **Loading States**: Provide clear feedback during async operations

### Smart Contract Integration

- **Type Safety**: Generate TypeScript types from contract ABIs
- **Error Handling**: Graceful handling of transaction failures
- **Gas Optimization**: Consider gas costs in contract interaction design

## Testing Strategy

### Frontend Testing

- **Component Tests**: Test form validation and state management
- **Integration Tests**: Test wallet connection and form submission flows
- **E2E Tests**: Test full user journey from wallet connection to campaign creation

### Smart Contract Testing

- **Unit Tests**: Test individual contract functions
- **Integration Tests**: Test complete campaign lifecycle
- **Gas Testing**: Monitor gas usage for optimizations

## Common Development Tasks

### Adding New Form Fields

1. Update Zod validation schema
2. Add FormField component in Form.tsx
3. Update TypeScript interfaces
4. Test validation rules

### Modifying Smart Contract

1. Update contract in `crowdfund_contracts/src/`
2. Run `forge build` to compile
3. Update frontend integration code
4. Test contract interactions

### Styling Updates

- Use TailwindCSS utility classes
- Maintain consistent spacing and color patterns
- Test responsive design across devices
- Ensure accessibility standards

This hybrid Web3 platform requires understanding both modern React patterns and blockchain development. Focus on seamless user experience while maintaining security and decentralization principles.
