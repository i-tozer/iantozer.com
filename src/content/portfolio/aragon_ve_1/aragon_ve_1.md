# Introduction

A time-boxed security review of **Aragon's VE Governance** (versions V1_3_0 & V1_4_0) was conducted by Ian, with emphasis on the security aspects of the implementation contracts.

# About VE Governance

VE (Vote Escrow) Governance is a series of modular and upgradable contracts where user's lock ERC20 tokens in exchange for an ERC721 token, and are then able to vote on gauges (aka addresses).

The codebase contains multiple versions of the VE Governance protocol, where newer versions introduce new features/functions via upgraded contracts and/or new contracts.

One DAO governance system can manage completely separate voting escrow systems for different tokens, while maintaining unified governance control.

### V1_3_0 & V1_4_0

In both vote-escrow systems, users lock ERC20 tokens to receive veNFTs (ERC721 tokens) with voting power that increases linearly over time based on lock amount and duration via a curve contract. 

Voting power is managed through delegations, enabling delegated addresses to vote on gauges. 

Users can merge or split their locks for flexibility and withdraw via an exit queue after a cooldown period. 

The key difference between v1_3_0 and v1_4_0 is that v1_4_0 introduces a configurable dynamic exit queue with decaying fees, while v1_3_0 uses a fixed-fee model. 

#### Architecture

- [Interactive Map (Simple)](https://link.excalidraw.com/readonly/UX0JvukD2xip4c6q1qzL)
- [Interactive Map (Detailed)](https://link.excalidraw.com/readonly/ef64UaueGFYF2Bd4qncu)

There are 7 key contracts:

##### VotingEscrowIncreasing_v1_2_0

This contract serves as the core escrow mechanism where users deposit ERC20 tokens to create voting escrow NFTs (veNFTs), managing lock creation, merging, splitting, and withdrawals via an exit queue. 

##### EscrowIVotesAdapter

This contract manages delegation of voting power from veNFTs, implementing the IVotes interface to track and update voting weights through checkpoints. 

##### AddressGaugeVoter

This contract enables delegated addresses to cast votes on whitelisted gauges using their accumulated voting power, managing gauge creation, activation, and vote tracking. It supports vote resetting and automatic power updates via delegation hooks.

##### Clock_v1_2_0

This contract defines and manages time-based structures including epochs, voting windows, and checkpoint intervals for synchronisation across the system. 

##### DynamicExitQueue (ExitQueue in V1_3_0)

This contract handles the withdrawal queue with configurable dynamic fees that decay over time, supporting fixed, tiered, or linear decay models in v1_4_0 (fixed in v1_3_0). It manages ticket queuing, fee calculation based on wait time, exit eligibility checks, and fee collection, with minimum lock periods to prevent immediate withdrawals.

#####  Lock_v1_2_0

This ERC721 contract represents locked positions as NFTs, handling minting on deposits, burning on withdrawals, and restricted transfers via whitelisting. It integrates with the escrow contract to trigger voting power updates on transfers and supports administrative whitelisting for specific addresses or open transfers.

##### LinearIncreasingCurve 

This contract computes voting power using a linear increasing curve based on lock amount and duration, managing per-token and global checkpoints.

# Process Overview

The security review was predominantly a manual code review that favoured an outside-in approach, and relied heavily on code screenshots, Excalidraw whiteboards, and ongoing conversations with Grok 4 via the Cursor IDE.

In essence, the process involved reading through the code to develop an understanding of how it works, whilst looking for mistakes and hypothesising about edge cases in real-time. 

The audit started by gaining an understanding of the architecture and user entry points (see: [Interactive Map (Simple)](https://link.excalidraw.com/readonly/UX0JvukD2xip4c6q1qzL) & [Interactive Map (Detailed)](https://link.excalidraw.com/readonly/ef64UaueGFYF2Bd4qncu)). 

Line-by-line reviews started via non-privileged user entry points, starting with `createLockFor`, which seemed like the most natural starting point for any user engaging with the system. From there, downstream execution paths were followed. 

View: [Understanding VotingEscrowIncreasing_v1_2_0::createLockFor](https://link.excalidraw.com/readonly/YEEDuljowOddcER8zcMC)

After exploring createLockFor and related contracts, it became clear that checkpointing with bias/slope calculations (on the delegates and tokens) contained the most complexity, so I made an effort to understand the algorithms and related state. As well as understanding what the functions did, I wanted to understand why there were two different implementations of `_checkpoint` and `_getBiasAndSlope` (one on `LinearIncreasingCurve` and one on `EscrowIVotesAdapter`)

View: [Understanding LinearIncreasingCurve::checkpoint()](https://link.excalidraw.com/readonly/DHYDsuV4DAOc0dBPJXwt)

Once I got a handle on the token-based voting power mechanics, I turned my attention to delegations and different delegation flows.

View: [Understanding EscrowIVotesAdapter's Delegation Mechanics](https://link.excalidraw.com/readonly/1HJNbsZVM85CCR4u28m7)

By this point, I had noticed two reentrancy attack vectors, and another bug, so I moved on to proof of concepts and report submissions. After the submissions, I continued by understanding other areas of the codebase. Next was voting and voting power.

View: [Understanding AddressGaugeVoter and Voting Mechanics](https://link.excalidraw.com/readonly/jxsR5Tp0vPPibWbs7ZC0)

This was then followed up by exploring a potential vulnerability in `merge`, which turned into an arbitrary voting power amplification exploit. 

View: [Understanding Merge](https://link.excalidraw.com/readonly/2rDt3WY4baXa6M5ILMqu)

The remaining code left to understand was withdrawal and fee mechanics.

View: [Understanding Withdrawal and Fees](https://link.excalidraw.com/readonly/JU4poqytnDZ5SLqfycRh)

I concluded by reviewing the core contracts again, making notes on thematic research areas for Solodit (though time constraints prevented in-depth research): inheritance order, initialisation order, dynamic fees, ERC20 safetransfer, mint/safeMint, ERC721 `_burn`, split functions, upgradeable contracts, exit queues, `__gap` slot values, clocks and cross-chain implications, delegates, checkpointing, int256 to uint256 conversions, and deprecated functions.

# Security Assessment Summary

## Scope

V1_3_0 and V1_4_0 deployments, with a focus on implementation over deployment and upgrade contracts.

## Contract Scope

Commit Hash: [cb99d5056f9efd23c9c5077c1c3dbf2aaee6895d](https://github.com/aragon/ve-governance/tree/cb99d5056f9efd23c9c5077c1c3dbf2aaee6895d) & [1f5746e5ad5640c7c9cc63988009856e67318384](https://github.com/aragon/ve-governance/tree/1f5746e5ad5640c7c9cc63988009856e67318384)

- src/clock/Clock_v1_2_0.sol (nSLOC 157)
- src/queue/ExitQueue.sol (nSLOC 115)
- src/lock/Lock_v1_2_0.sol (nSLOC 74)
- src/curve/LinearIncreasingCurve.sol (nSLOC 333)
- src/escrow/VotingEscrowIncreasing_v1_2_0.sol (nSLOC 326)
- src/delegation/EscrowIVotesAdapter.sol (nSLOC 389)
- src/voting/AddressGaugeVoter.sol (nSLOC 278)
- src/factory/GaugesDaoFactory_v1_3_0.sol (nSLOC 309)
- src/setup/GaugeVoterSetup_v1_3_0.sol (nSLOC 251)
- src/factory/upgrades/UpgradeFactory_v1_0_0__v1_3_0.sol (nSLOC 299)
- src/libs/CurveConstantLib.sol (nSLOC 7)
- src/libs/ProxyLib.sol (nSLOC 17)
- src/libs/SignedFixedPointMathLib.sol (nSLOC 34)
- src/queue/DynamicExitQueue.sol (nSLOC 191)

## Vulnerability Scope

### High

- Direct Fund Loss 
- Governance Manipulation
- Critical Protocol Failure

### Medium

- Funds at risk under specific conditions
- Temporary DOS
- Voting power manipulation with a reasonable magnitude
- Delegation manipulation with a reasonable magnitude
- Integration failures for admin workflows that are repeated regularly

## Key Findings

| **ID** | **Title**                                                                                          | **Severity** | **Status**   | **Link to PoC and Explanation**                                             |
| ------ | -------------------------------------------------------------------------------------------------- | ------------ | ------------ | --------------------------------------------------------------------------- |
| [H-01] | Reentrancy in `split` Enables Arbitrary Inflation of Delegated Voting Power via Repeated Splitting | High         | Confirmed    | [Details](https://gist.github.com/i-tozer/19bb4dd3430b9fff1391309cce038e4d) |
| [H-02] | Merge-Induced Delegation Manipulation Leading to Unlimited Voting Power Amplification and DoS      | High         | Confirmed    | [Details](https://gist.github.com/i-tozer/902927b4af9902e94655aa176264c91c) |
| [M-01] | Delegation Exploit: Undelegation Incorrectly Schedules Excessive Future Voting Power Reductions    | Medium       | Confirmed    | [Details](https://gist.github.com/i-tozer/6782aeef5730f8d4688be489ae408778) |
| [M-02] | Reentrancy in `createLockFor` Allows Double-Checkpointing of Voting Power                          | Medium       | Confirmed    | [Details](https://gist.github.com/i-tozer/372f2b8c0e46242a0940bbce2d087202) |
| [M-03] | Temporary DOS Vulnerability via `setEnableUpdateVotingPowerHook(false)`                            | Medium       | Acknowledged | [Details](https://gist.github.com/i-tozer/85c3f15843f5869bf61e1cf45bcb47e6) |

## Additional Findings

### Security, Gas & Functional Risk Issues

#### [I-01]  `MAX_FEE_PERCENT` of  10_000 (i.e. 100%) in `DynamicExitQueue` and `ExitQueue` allows the DAO to hold user ERC20 funds ransom.

#### [I-02] Unnecessary gas usage in `_updateVotingPower` calls with `address(0)`

In several flows (e.g., token creation, splitting, and merging in `VotingEscrowIncreasing_v1_2_0.sol`), `_moveDelegateVotes` is called with `address(0)` as either `_from` or `_to`, which propagates to `updateVotingPower(address _from, address _to)` in `AddressGaugeVoter.sol`. This results in invoking `_updateVotingPower(address(0))`.

Although `_updateVotingPower` returns early for `address(0)` (since `isVoting(address(0))` is false and it cannot have votes), the call itself incurs unnecessary gas costs.

#### [I-03] Missing early approval check in `VotingEscrowIncreasing_v1_2_0::beginWithdrawal` may waste gas on invalid calls

The `beginWithdrawal` function performs several operations (e.g., voting power checks, point history queries, and checkpoint updates) before calling `transferFrom`, which will revert if the caller is not approved or the owner. Adding an early check can prevent unnecessary gas consumption on invalid invocations.

Recommended Mitigation: Move the following check to the beginning of the function:
```solidity
if (!isApprovedOrOwner(_msgSender(), _tokenId)) revert NotApprovedOrOwner();
```

### Architectural & Design Concerns

#### [I-04] Inconsistent precision handling across contracts (e.g., fixed-point divisions)

Several contracts handle fixed-point arithmetic (typically with 1e18 precision) inconsistently, using a mix of hardcoded divisions, library functions, and custom scaling factors. This can lead to maintenance challenges, potential precision errors if not handled carefully, and reduced code readability.

Examples of inconsistency:

- Hardcoded divisions by 1e18 in `LinearIncreasingCurve.sol`:
```solidity
return [
	coefficients[0] / 1e18,
	coefficients[1] / 1e18,
	0
];
```    

- Library-based conversion in `EscrowIVotesAdapter.sol`:
```solidity
return uint256(SignedFixedPointMath.fromFP(bias));
```

Uses `SignedFixedPointMath.fromFP` for safe conversion from wad (1e18 scaled) to integer.

- Custom scaling with 10e32 in `AddressGaugeVoter.sol`:
    ```solidity
    return (_weight * 10e32) / _totalWeight;
    return (_weight * _votingPower) / 10e32;
    ```

Employs a different precision factor (10e32) for vote weight normalization, without library support.

Recommendation: Standardise precision handling across all contracts using one of these approaches:

1. Consistent library usage: Refactor to use `SignedFixedPointMathLib` (or similar) for all fixed-point operations
2. Standardised constants: Define precision constants and avoid hardcoded literals

The codebase demonstrates good patterns in `DynamicExitQueue.sol` with `uint256 private constant INTERNAL_PRECISION = 1e18;`. Extending this approach would:

- Improve readability by making scaling factors' purposes explicit
- Enhance maintainability if precision requirements change
- Reduce likelihood of precision errors through consistent handling
- Provide consistency

Locations: `src/curve/LinearIncreasingCurve.sol`, `src/delegation/EscrowIVotesAdapter.sol`, `src/voting/AddressGaugeVoter.sol`, `src/escrow/VotingEscrowIncreasing_v1_2_0.sol`

#### [I-05] Inconsistent use of `SafeCast` and `SafeCastUpgradeable` in upgradeable contracts 

In upgradeable contracts, OpenZeppelin recommends using upgradeable variants of libraries (e.g., `SafeCastUpgradeable`) to ensure proper storage handling and avoid potential upgrade issues. However, some contracts use `SafeCast` (non-upgradeable) and others `SafeCastUpgradeable`.

- `src/escrow/VotingEscrowIncreasing_v1_2_0.sol` imports and uses `SafeCastUpgradeable`.
- `src/voting/AddressGaugeVoter.sol` imports and uses `SafeCast` (non-upgradeable).

Locations:  `src/escrow/VotingEscrowIncreasing_v1_2_0.sol`& `src/voting/AddressGaugeVoter.sol`.

#### [I-06] Misleading naming for `_getBiasAndSlope` functions that modify state in `EscrowIVotesAdapter`

```solidity
// In EscrowIVotesAdapter.sol (called in delegation/undelegation flows)
function _getBiasAndSlope(
	address _delegatee,
	IVotingEscrow.LockedBalance memory _locked,
	function(int256) view returns (int256) op
) private returns (int256, int256) {
	// ... calculations ...
	if (elapsed < maxTime) {
		slope = op(slope);
		slopeChanges[_delegatee][_locked.start + maxTime] += op(slope); // State-modifying write
	} else {	
		slope = 0;
	}
	
	return (op(bias), slope);
}

```

The function name `_getBiasAndSlope` suggests a read-only getter (e.g., computing and returning values without side effects). However, it modifies contract state by updating the `slopeChanges` mapping when `elapsed < maxTime`. 

Additionally, the final parameter is a function pointer marked as `view` (`function(int256) view returns (int256) op`), which further reinforces the impression of a non-mutating function if not examined carefully, potentially misleading developers or auditors.

Although marked as `private` and only used internally, renaming to reflect its mutating nature (e.g., `_computeAndScheduleBiasAndSlope`) would improve clarity.

Location: `src/delegation/EscrowIVotesAdapter.sol`

#### [I-07] Variable naming clarity: Rename `totalBias` and `totalSlope` to `totalDelegateeBias` and `totalDelegateeSlope` in `EscrowIVotesAdapter`

```solidity
// In _delegate function
function _delegate(
    address _sender,
    address _delegatee,
    uint256[] memory _tokenIds,
    bool _validate
) internal virtual {
    (int256 totalBias, int256 totalSlope) = (0, 0);  // Could be more specific
    // ... loop through tokens ...
    _checkpoint(totalBias, totalSlope, _delegatee);
}

// In _undelegate function  
function _undelegate(
    address _sender,
    address _delegatee,
    uint256[] memory _tokenIds,
    bool _validate
) internal virtual {
    (int256 totalBias, int256 totalSlope) = (0, 0);  // Could be more specific
    // ... loop through tokens ...
    _checkpoint(totalBias, totalSlope, _delegatee);
}
```

The variable names `totalBias` and `totalSlope` in both `_delegate` and `_undelegate` functions could be more descriptive. These variables accumulate bias and slope values specifically for the delegatee receiving or losing voting power, not global totals.

Renaming to `totalDelegateeBias` and `totalDelegateeSlope` would:
1. Improve clarity by explicitly indicating these are delegatee-specific accumulations
2. Avoid confusion with potential global counters or other "total" variables in the codebase

Location: `src/delegation/EscrowIVotesAdapter.sol` (in `_delegate` and `_undelegate` functions)

#### [I-08] Unused error definition `UpgradeNotPossible` in `VotingEscrowIncreasing_v1_2_0` (dead code)

```solidity
error UpgradeNotPossible();
```

The error `UpgradeNotPossible` is defined in the contract but never used (no `revert UpgradeNotPossible();` statements exist). This appears to be dead code, possibly a remnant from previous versions or unimplemented logic.

Location: `src/escrow/VotingEscrowIncreasing_v1_2_0.sol`

### Documentation & Clarity

#### [I-09]  Comment in `VotingEscrowIncreasing_v1_2_0::__gap` is inaccurate. 

```solidity
/// @dev Reserved storage space to allow for layout changes in the future.
/// Please note that the reserved slot number in previous version(39) was set
/// incorrectly as 39 instead of 40. Changing it to 40 now would overwrite existing slot values,
/// resulting in the loss of state. Therefore, we will continue using 37 in this version.
/// For future versions, any new variables should be added by subtracting from 37.
```

The correct phrasing is: "Changing it to 40 would've overwritten existing slot values"

#### [I-10] Incorrect NatSpec comment in `AddressGaugeVoter::currentEpochStart`
  
```solidity
/// @notice timestamp of the start of the next epoch
function currentEpochStart() public view returns (uint256) {
return IClock(clock).epochStartTs() - IClock(clock).epochDuration();
}
```

The NatSpec comment incorrectly states this returns the "timestamp of the start of the next epoch". The function actually returns the timestamp of the start of the current epoch by subtracting one epoch duration from the next epoch's start time.

This can be verified by examining `IClock::epochStartTs()` which returns the timestamp of the next epoch's start (current time + time until next epoch start), and `IClock::epochDuration()` which returns the duration of one epoch.

Location: `src/voting/AddressGaugeVoter.sol`

#### [I-11] Potentially misleading NatSpec comment for `CHECKPOINT_INTERVAL` in `Clock` contract

```solidity
/// @dev Checkpoint interval is the time between each voting checkpoint
uint256 internal constant CHECKPOINT_INTERVAL = 1 weeks;
```

The comment describes the checkpoint interval as "the time between each voting checkpoint". However, checkpoints occur every week throughout the 2-week epoch, including during non-voting periods. This may imply checkpoints are exclusively tied to voting, which could be misleading.

A more accurate description could be: "Checkpoint interval is the time between each checkpoint for tracking voting power", as checkpoints are used to record points for slope and bias calculations in the voting escrow system, occurring regardless of active voting periods.

Location: `src/clock/Clock.sol`

#### [I-12] Inaccurate example in comment for `INITIAL_BIAS_MULTIPLIER` in `CurveConstantLib.sol`

```solidity
// The initial bias is scaled by a multiplier, which defaults to 1x (no scaling).
// To start with a higher initial bias (e.g., 1.5x the amount), update this value accordingly.
// For example, set it to 1.5 in case you want to start with 1.5 * amount.
int256 constant INITIAL_BIAS_MULTIPLIER = 1;
```

The comment suggests setting the constant to 1.5 for a 1.5x multiplier. However, as an `int256` constant, it can only hold integer values and cannot be directly set to a fractional number like 1.5.

Location: `src/libs/CurveConstantLib.sol`

#### [I-13] Confusing comment in `VotingEscrowIncreasing_v1_2_0::_createLockFor` about getting "next time" when retrieving past timestamp

```solidity
function _createLockFor(uint256 _value, address _to) internal returns (uint256) {
    if (_value == 0) revert ZeroAmount();
    if (_value < minDeposit) revert AmountTooSmall();

    // query the duration lib to get the next time we can deposit
    uint256 startTime = IClock(clock).epochPrevCheckpointTs();
    // ... rest of function
}
```

The comment states "query the duration lib to get the next time we can deposit" but the function actually calls `epochPrevCheckpointTs()`, which returns the timestamp of the *previous* checkpoint interval (a past timestamp), not a future one.

Based on the clock implementation, `epochPrevCheckpointTs()` calculates `timestamp - resolveEpochPrevCheckpointElapsed(timestamp)`, which gives a timestamp in the past. The comment should be updated to accurately reflect this, such as: "query the clock to get the previous checkpoint timestamp for the lock start time"

Location: `src/escrow/VotingEscrowIncreasing_v1_2_0.sol` (in `_createLockFor` function)

#### [I-14] Deceptive comment in `VotingEscrowIncreasing_v1_2_0::beginWithdrawal` regarding voting power removal

The comment states: `// we can remove the user's voting power as it's no longer locked`, implying that the subsequent `_checkpoint` call directly removes the voting power. However, while `_checkpoint` updates the curve to reflect zero voting power by setting the new locked amount to zero, it does not update the stored `_locked[_tokenId]` balance. The actual reduction in delegated voting power occurs later during the `transferFrom` call, which triggers `moveDelegateVotes` (via the NFT contract's transfer hook) and moves the original locked amount's votes from the owner to the contract address—provided a delegatee exists (required for active voting). This makes the comment potentially misleading, as it overlooks the role of delegation and transfer in fully clearing votes.

This can be mitigated by updating the comment for clarity, e.g.:

```solidity
// Update the curve to reflect zero voting power as the lock is entering withdrawal;
// delegated votes will be moved during the subsequent transfer.
```

### Naming & Readability Improvements

#### [I-15] Misleading function name `_getConstantCoeff` in `LinearIncreasingCurve`

```solidity
/// @return The constant coefficient of the increasing curve, for the given amount
/// @dev In this case, the constant term is 1 so we just case the amount
function _getConstantCoeff(uint256 amount) internal pure virtual returns (int256) {
return amount.toInt256() * SHARED_CONSTANT_COEFFICIENT;
}
```

The function name `_getConstantCoeff` and its NatSpec suggest it returns the constant coefficient. However, it actually computes and returns the product of the amount and `SHARED_CONSTANT_COEFFICIENT`.

Location: `src/curve/LinearIncreasingCurve.sol`

#### [I-16] Potentially unclear naming for `getWriteEpochId()` function in `AddressGaugeVoter`

```solidity
/// @notice This function is used to get the epoch id in the case of delegation mapper
/// does not exist or the hook is not activated.
function getWriteEpochId() public view returns (uint256) {
	return enableUpdateVotingPowerHook ? 0 : epochId();
}
```

The function name `getWriteEpochId()` includes "Write", which specifically indicates its use for determining the epoch key when *writing* (storing or updating) vote data to storage mappings (e.g., `epochVoteData`).

This naming distinguishes it from general epoch getters like `epochId()`, emphasising its write-oriented purpose. However, it may confuse readers unfamiliar with this distinction. Consider renaming to `getVoteStorageEpochId()` or adding clarifying NatSpec for better readability.

Location: `src/voting/AddressGaugeVoter.sol`

#### [I-17] Inaccurate inline comment in `LinearIncreasingCurve::getCoefficients` for consistency

```solidity
function getCoefficients(uint256 amount) public pure virtual returns (int256[3] memory) {
	int256[3] memory coefficients = _getCoefficients(amount);
	return [
		coefficients[0] / 1e18, // amount
		coefficients[1] / 1e18, // slope
		0
	];
}
```

The inline comment labels the first returned value as `// amount`, which matches the input parameter name but may be misleading. This value is actually the constant coefficient (representing the initial bias term in the curve equation), derived from `_getConstantCoeff(amount)`.

For better consistency and clarity (e.g., aligning with the `// slope` comment for the linear coefficient), consider updating the comment to `// constant` to reflect its role in the curve.

Location: `src/curve/LinearIncreasingCurve.sol`

#### [I-18] Inconsistent return types between `getBias` (non-fixed-point) and `_getBias` (fixed-point) in `LinearIncreasingCurve`; rely on naming for clarity

```solidity
// Returns non-fixed-point (regular uint256)
function getBias(uint256 timeElapsed, uint256 amount) public view returns (uint256) {
    int256[3] memory coefficients = _getCoefficients(amount);
    uint256 bias = _getBias(boundElapsedMaxTime(timeElapsed), coefficients[0], coefficients[1]);
    return bias / 1e18;  // Scales down from fixed-point
}

// Returns fixed-point value (as per internal comment)
function _getBias(
    uint256 _timeElapsed,
    int256 _constantCoeff,
    int256 _linearCoeff
) internal pure returns (uint256) {
    int256 bias = _linearCoeff * int256(_timeElapsed) + _constantCoeff;
    if (bias < 0) bias = 0;
    return bias.toUint256();  // Fixed-point representation
}
```

The public `getBias` returns a scaled-down (non-fixed-point) value, while the internal `_getBias` returns a fixed-point value (as noted in comments). Relying solely on NatSpec/comments for this distinction may lead to confusion or errors when using these functions.

To improve clarity without depending on comments, consider renaming the fixed-point version (e.g., `_getBiasFP`) to explicitly indicate its return type in the name.

Location: `src/curve/LinearIncreasingCurve.sol`

#### [I-19] Suggestion to relocate `end` declaration in `votingPowerAt` for improved readability

```solidity
function votingPowerAt(uint256 _tokenId, uint256 _t) external view returns (uint256) {
    // ... other code ...
    TokenPoint memory originalPoint = _tokenPointHistory[_tokenId][1];
    TokenPoint memory lastPoint = _tokenPointHistory[_tokenId][interval];
    int256 bias = lastPoint.coefficients[0];
    int256 slope = lastPoint.coefficients[1];

    uint256 end = originalPoint.checkpointTs + maxTime();  // Could be moved next to elapsed calculation
    // ... other code ...
    uint256 elapsed = _t - lastPoint.writtenTs;
    // ... continued ...
}
```

The declaration `uint256 end = originalPoint.checkpointTs + maxTime();` is used in the elapsed bounding logic. For better code flow and readability, it could be relocated adjacent to the `elapsed` calculation, as both involve time-based computations. This minor restructuring has no functional impact but improves logical grouping without affecting gas costs.

Location: `src/curve/LinearIncreasingCurve.sol` (in `votingPowerAt` function)

### Minor Typos

#### [I-20] Duplicate word "can" in `EscrowIVotesAdapter` NatSpec comment
  
```solidity
/// @notice The Gauge admin can can create and manage voting gauges for token holders
```

The comment contains a duplicate word "can". The correct phrasing should be:

"The Gauge admin can create and manage voting gauges for token holders"
  
Location: `src/delegation/EscrowIVotesAdapter.sol`

#### [I-21] Typo in NatSpec comment for `_checkpoint` in `LinearIncreasingCurve`

```solidity
/// @notice Record gper-user data to checkpoints. Used by VotingEscrow system.
function _checkpoint(
t256 _tokenId,
IVotingEscrow.LockedBalance memory _fromLocked,
IVotingEscrow.LockedBalance memory _newLocked
) internal {
// implementation
}
```

The NatSpec comment contains a likely typo: "gper-user" should be "per-user" to correctly read "Record per-user data to checkpoints. Used by VotingEscrow system."

Location: `src/curve/LinearIncreasingCurve.sol`

# Observations

## Multiple Versions in a Codebase

Since the codebase contains all versions of VE Governance, contract-to-version relationships are not immediately apparent. This creates ambiguity about which contracts belong to which system version.

For example: 
- `AddressGaugeVoter` is used in V_1_2, V1_3_0 and V1_4_0 
- `TokenGaugeVoter` is used in V1_0_0
- `VotingEscrowIncreasing_v1_2_0` is used in V1_2_0, V1_3_0 and V1_4_0

Determining which contracts comprise a specific version requires careful examination of the corresponding `GaugesDAOFactory_V1_x_x` and `GaugesVotingSetup_V1_x_x` contracts. While this level of investigation represents good practice, most developers assume all contracts in a repository are interconnected unless explicitly organised as a library, creating cognitive overhead.

## Redundant State in `AddressGaugeVoter`

The `AddressGaugeVoter` is designed to handle either automated or manual voting power updates, determined by the `enableUpdateVotingPowerHook` flag.

This feature is not designed to be toggled freely. Rather, it should be set based on the system architecture: is the contract ecosystem designed for automated voting power updates or not?

When automated voting power is enabled, it simplifies state management such that `epoch` in `epochVoteData[epoch][_address]` is always zero:

```solidity
function getWriteEpochId() public view returns (uint256) {
	return enableUpdateVotingPowerHook ? 0 : epochId();
}
```

This renders the epoch dimension of the mapping redundant (since it consistently resolves to zero).

The system is designed to disable certain functions when the hook is deactivated. However, toggling this setting could introduce unknown attack vectors. Additionally, this design creates an unnecessary layer of invocation for automated voting power systems.

## Checkpoint Logic Duplication

Two of the most complex functions in the codebase are:

- `LinearIncreasingCurve::_checkpoint` (which invokes `LinearIncreasingCurve::_getBiasAndSlope` for bias/slope calculations).
- `EscrowIVotesAdapter::_checkpoint` (which relies on `EscrowIVotesAdapter::_getBiasAndSlope` for similar bias/slope updates).

Variations of the checkpoint algorithm (iterative bias/slope adjustments over checkpoint intervals) also appear in every curve contract and in `EscrowIVotesAdapter::_delegateBalanceAt`.

This elegant but intricate algorithm demands significant effort to verify. Duplication increases maintenance overhead and vulnerability risks, as seen in finding [M-01] (related to slope handling in `EscrowIVotesAdapter::_getBiasAndSlope`).

Recommendation: Consider the viability of extracting the core logic into a shared library (e.g., `CheckpointLib`) with reusable functions for checkpointing & bias/slope computation. This reduces duplication while preserving intentional differences (e.g., global vs. per-token handling). 

## Exploring Flat Curves

As part of the review, I evaluated the implications of setting the linear coefficient to zero in `LinearIncreasingCurve.sol`, effectively creating a "flat" curve where voting power is constant and independent of lock time.

When `linear_coefficient = 0`, the voting power calculation simplifies from `amount * ((time_elapsed * linear_coefficient) + constant_coefficient)` to `amount * constant_coefficient`. 

This renders several components redundant:
- `slopeChanges` mappings become unused storage
- Checkpointing loops perform unnecessary zero-slope calculations
- Historical queries maintain compatibility but waste gas on redundant slope operations

The following are security considerations related to flattening the curve, and additional thoughts on different implementation approaches.
### Flash Voting Considerations

Users will be able to lock tokens briefly, vote on gauges with full voting power, and then immediately queue for exit. However, existing protections mitigate this concern: 

- Exit fees and cooldown periods still apply
- Voting power is lost immediately upon queuing exit (assuming the update voting power hook is on)
- Votes are automatically recast when delegation changes occur

The primary implication is therefore how the upstream voting system handles these power adjustments rather than it being a direct attack vector.

### Code Redundancy

Code redundancy issues present a more immediate technical concern. For example:

```solidity
// These operations become no-ops with zero slopes:
lastPoint.slope -= dSlope; // Always zero
slopeChanges[_delegatee][endTime] += slope; // Unused storage writes
```
### Migration Risks

Upgrading to a Flat Curve presents data migration challenges. Existing checkpoints and histories (e.g., in `_tokenPointHistory`) assume non-zero slopes, and recalculating them could lead to inconsistencies that compromise historical voting power queries or delegation tracking.

### Implementation Risks

Both upgrade and fresh deployment scenarios face concerns around untested logic paths and interface expectations. Flat-specific simplifications (e.g., zero-slope edge cases) receive less coverage in existing tests, potentially hiding bugs in integrations like delegations. 

Additionally, interfaces named as "Increasing" (e.g., `IEscrowCurveIncreasing`) could mislead callers.

### Inheritance Architecture Analysis

To implement this cleanly in a modular plugin library, an "add-on" architecture via inheritance could work: starting with a base contract for constant voting power (e.g., an abstract `EscrowCurveBase` with virtual methods for bias/slope), then extending it in a child like `LinearIncreasingCurve` to add the slope via overrides. This avoids dead code and toggles, enabling deployers to choose flat or increasing variants as plugins. However, this approach has significant difficulties:

- Complexity bloat: More complex code paths and virtual function resolution
- Storage conflicts: Inheritance risks misaligning slots in UUPS proxies (e.g., `__gap` mismatches across levels).
- Upgrade complexity: Each level needs compatible `_authorizeUpgrade` logic, complicating migrations.
- Testing overhead: Requires tests for each child contract, including inheritance hierarchies and integrations.

### Recommendation

In the short term, accepting code redundancies when setting the linear coefficient to zero may be pragmatic, allowing time to identify slope-related components for future optimisation.

For a more comprehensive v2 approach, inheritance architecture offers the cleanest long-term solution despite its complexities. The modular design would enable proper separation of concerns and eliminate dead code paths, though it requires careful handling of UUPS proxy storage layouts and thorough testing of inheritance hierarchies.

Alternatively, splitting constant math and slope math into distinct library functions (e.g., extending `SignedFixedPointMathLib.sol` or `CurveConstantLib.sol`, or creating `CurveMathLib.sol`) would consolidate duplicate logic into reusable components, while conditional flags could allow functions to skip slope calculations & operations when the linear coefficient is zero. However, this approach still leaves redundant state variables (like `slopeChanges` mappings).

Extensive testing, fuzzing, and invariant tests would be essential regardless of the chosen approach.

# Additional Future Considerations

Research thematic bug disclosures via Solodit or other vulnerability aggregators to ensure similar vulnerabilities have not occurred here.

Research update-driven state changes where functions have been modified and state differences have been unaccounted for (e.g., voting power transitions from token-based to delegate-based systems).