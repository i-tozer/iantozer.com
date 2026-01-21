# Introduction

A time-boxed security review of **Aragon's VE Governance** (versions V1_3_0 & V1_4_0) was conducted by Ian, with emphasis on updates since the previous review.

# About VE Governance

VE (Vote Escrow) Governance is a series of modular and upgradable contracts where user's lock ERC20 tokens in exchange for an ERC721 token, and are then able to vote on gauges.

The codebase contains multiple versions of the VE Governance protocol, where newer versions introduce new features/functions via upgraded contracts and/or new contracts.

One DAO governance system can manage completely separate voting escrow systems for different tokens, while maintaining unified governance control.

The latest release and versioned changes are best explained [here](https://github.com/aragon/ve-governance/blob/audit-4/audits/AUDIT_4.md).

#### Architecture

- [Interactive Map (V3; Latest)](https://link.excalidraw.com/readonly/Qw6Y2tLPhtQAptqGDSTk)

# Process Overview

Manual code review with outside-in approach, using Excalidraw diagrams and AI assistance via Grok 4 in Cursor IDE.

Built on the [initial review](https://gist.githubusercontent.com/i-tozer/deff978ab2364e6874733ae419e7ce72/raw/e5cbba13eefb948db4b7414a48be8ed1668896f5/aragon-ve-security-review.md) with:

- Updated architectural diagrams
- Trial of '[Hound](https://github.com/scabench-org/hound)' AI security analysis tool
- Hypotheses-driven investigations

# Security Assessment Summary

## Scope

V1_3_0 and V1_4_0 deployments, with a focus on recent updates.

**Review Focus**: This report documents new findings identified in V1_3_0 and V1_4_0. Informational, architectural, and observational findings previously disclosed in the [initial review](https://gist.githubusercontent.com/i-tozer/deff978ab2364e6874733ae419e7ce72/raw/e5cbba13eefb948db4b7414a48be8ed1668896f5/aragon-ve-security-review.md) are not re-reported here, regardless of whether they persist in the current versions.

## Recent Updates

- New `DELEGATION_TOKEN_ROLE` excluding the public `delegate(address _delegatee)` function
- Introduction of `DelegationHelper.sol`
- Vote weight precision changes
- New withdrawal functions: `cancelWithdrawalRequest()` and `cancelExit()`
- Dependency update: @aragon/osx → @aragon/osx-commons-contracts

## Contract Scope

Commit Hash: [27bbd897c37363b4e3764244cc9c08a530ca2762](https://github.com/aragon/ve-governance/tree/27bbd897c37363b4e3764244cc9c08a530ca2762) & [3693ef6ecc0803eb336aeb47a69f7c558f5b9127](https://github.com/aragon/ve-governance/commit/3693ef6ecc0803eb336aeb47a69f7c558f5b9127)

| Contract Group | Contract Name                      | In Scope | Details                                |
| -------------- | ---------------------------------- | -------- | -------------------------------------- |
| `clock`        | Clock_v1_2_0.sol                   | ✅       | Versioned implementation               |
| `clock`        | IClock_v1_2_0.sol                  | ✅       | Interface                              |
| `curve`        | LinearIncreasingCurve.sol          | ✅       | Main curve logic                       |
| `curve`        | LinearIncreasingCurveNoSupply.sol  | ✅       | Variant without supply                 |
| `curve`        | IEscrowCurveIncreasing_v1_2_0.sol  | ✅       | Interface                              |
| `delegation`   | EscrowIVotesAdapter.sol            | ✅       | IVotes adapter                         |
| `delegation`   | IEscrowIVotesAdapter.sol           | ✅       | Interface                              |
| `escrow`       | VotingEscrowIncreasing_v1_2_0.sol  | ✅       | Versioned implementation               |
| `escrow`       | IVotingEscrowIncreasing_v1_2_0.sol | ✅       | Interface                              |
| `factory`      | GaugesDaoFactory_v1_2_0.sol        | ✅       | Versioned implementation               |
| `factory`      | GaugesDaoFactory_v1_3_0.sol        | ✅       | Versioned implementation               |
| `lock`         | Lock_v1_2_0.sol                    | ✅       | Versioned implementation               |
| `setup`        | GaugeVoterSetup_v1_2_0.sol         | ✅       | Versioned setup                        |
| `setup`        | GaugeVoterSetup_v1_3_0.sol         | ✅       | Versioned setup                        |
| `voting`       | AddressGaugeVoter.sol              | ✅       | Address-based voter                    |
| `voting`       | IAddressGaugeVoter.sol             | ✅       | Interface                              |
| `factory`      | GaugesDaoFactory_v1_4_0.sol\*      | ✅       | Versioned implementation               |
| `setup`        | GaugeVoterSetup_v1_4_0.sol\*       | ✅       | Versioned setup                        |
| `delegation`   | DelegationHelper.sol\*             | ✅       | Delegation-specific utilities          |
| `queue`        | DynamicExitQueue.sol\*             | ✅       | ExitQueue with variable fee structures |

## Key Findings

No high or medium risk vulnerabilities were found.

## Findings

### Low Risk

#### [L-01] Bypassing Same-Block `beginWithdrawal` Restriction Through Token Merging

It's possible to bypass the same-block withdrawal check in `beginWithdrawal`:

```solidity
if (block.timestamp == point.writtenTs) {
    revert CannotWithdrawInSameBlock();
}
```

A user can merge two tokens where Token 1 was created in a previous block (Amount 1) and Token 2 was created in the current block (Amount 10000+). By merging Token 2 into Token 1, the user can bypass the above check since Token 1's `writtenTs` is from the previous block.

If the queue's `minCooldown` is set to 0, this makes the system vulnerable to flashloan attacks.

PoC: [https://gist.github.com/i-tozer/fd833fe5786199edbbfedabd13bed794](https://gist.github.com/i-tozer/fd833fe5786199edbbfedabd13bed794)

#### [L-02] Non-monotonic checkpoint creation in `EscrowIVotesAdapter::_checkpoint` breaks voting power queries

An invariant violation occurs in `EscrowIVotesAdapter::_checkpoint` when `checkpointTransition` is called with `_transitionCount = 0`. This creates a new checkpoint with a backdated `writtenTs` (set to the previous checkpoint interval start) rather than the current `block.timestamp`, breaking the monotonic ordering invariant required for binary search functionality.

When `checkpointTransition(delegate, 0)` is called, the new checkpoint has an earlier timestamp than the previous one, corrupting the binary search in `getPastDelegatePointIndex`. This enables manipulation of historical voting power queries, allowing users to artificially grant themselves voting power for periods before they even had tokens locked.

While this issue doesn't fully manifest in the current v1.3.0-v1.4.0 architecture (since delegation voting uses `UpdateVotingPowerHook` with `block.timestamp`), it renders `getPastVotes` calculations inaccurate and creates significant risks for future governance implementations that rely on historical voting power data.

**Mitigation**: Include the following check in `_checkpoint`:

```solidity
if (expectedWrittenTs <= lastPoint.writtenTs) {
     revert CannotBackdateCheckpoint();
}
```

PoC: [https://gist.github.com/i-tozer/a094ddd04713029648ec23fd0909f1fb](https://gist.github.com/i-tozer/a094ddd04713029648ec23fd0909f1fb)

### Informational

#### [I-01] Queue replacement breaks existing withdrawal requests

`VotingEscrowV1_2_0` allows unrestricted admin calls to `setQueue(address queue)`. When users call `beginWithdrawal()`, tickets are created in the current queue. However, `cancelWithdrawalRequest()` and withdrawal queries reference the current queue for ticket details. If the admin switches queues, these calls reference the new queue lacking prior records, causing `NotTicketHolder` or `CannotExit` reverts. Users cannot access the old queue due to `onlyEscrow` restrictions. Once withdrawals are queued, even `sweepNFT()` becomes unusable due to `if (IExitQueue(queue).ticketHolder(_tokenId) != address(0)) revert CannotExit();`. The admin must revert to the old queue, transfer the state over during an update, or wait for natural completion.

#### [I-02]  Missing validation in initialization functions

Multiple contracts have initialization gaps that could lead to deployment misconfiguration. For example, `DynamicExitQueue.initialize` and `Lock.initialize` lack zero-address validation for the critical parameters: `escrow` & `lock`.

#### [I-03] AddressGaugeVoter gauge validation bypass

During delegation-driven recasts, `_updateVotingPower` calls `_castVote` directly, bypassing the `isActive` checks enforced by `_safeCastVote`. If a gauge is deactivated after initial voting, subsequent delegation changes will still apply votes to the inactive gauge.

#### [I-04] Outdated comment in totalVotingPowerAt function

The `totalVotingPowerAt` function is annotated with "/// @dev Currently unsupported" despite being implemented and functional. The function returns supply at the specified timestamp via `IEscrowCurve(curve).supplyAt(_timestamp)`.

####  [I-05] Misleading inline comment in merge functionality

A misleading inline comment exists in the merge functionality (line 397) stating "// Note that we still decrease owner's delegated token count // as `_from` token is destroyed," implying unconditional decrement. However, `mergeDelegateVotes` in `DelegationHelper.sol` only decrements `numberOfDelegatedTokens[_from.account]` when both `_from` and `_to` tokens are already delegated.

### Observations

####  [O-01] Asymmetric locked state handling in withdrawal operations

An asymmetry exists in locked state management between `beginWithdrawal` and `cancelWithdrawalRequest`. When initiating withdrawal with zero amount, `beginWithdrawal` updates the old locked state to `{amount: x, start: y}` and new state to `{amount: 0, start: y}`, preserving the start time. However, `cancelWithdrawalRequest` resets old state to `{amount: 0, start: 0}` and restores new state to `{amount: x, start: y}`, nullifying both values in the old state. While this asymmetry has no functional impact since zero amounts prevent material escrow changes, it represents a design inconsistency that could lead to unintended assumptions in future modifications.

#### [O-02] votesForGauge multiplication overflow highly unlikely but increasing precision could create risk

The votesForGauge function computes votes as `(_weight * _votingPower) / 1e36`. The concern is in the multiplication `(_weight * _votingPower)` since `_weight` can equal 1e36. With uint256 max (~1e77), even with massive voting power from concentrated whale delegations, overflow is highly unlikely but increasing precision higher would approach overflow territory.

#### [O-03] Lock NFT transfers are coupled to VotingEscrow pause state

`Lock._transfer` unconditionally calls `IVotingEscrow(escrow).moveDelegateVotes` after performing the ERC721 transfer. Since `VotingEscrow.moveDelegateVotes` is protected by `whenNotPaused`, any pause of the VotingEscrow contract will cause all Lock NFT transfers to revert.

## Hound

Hound, an autonomous AI security analysis tool, was deployed in two phases against the VE governance codebase. An initial 15-hour run preceded the manual security review, followed by a 30+ hour analysis of the latest scope, generating over 300 total hypotheses across both runs.

### Analysis Results (Latest Run)
- **Total hypotheses generated**: 165
- **Confirmed findings**: 85
- **Actionable discoveries**: one invariant violation ([L-02]) and ~6 informational findings after filtering false positives and duplicates

Hound successfully identified **[L-02] Non-monotonic checkpoint creation** independently, along with several observational issues that corroborated manual review findings.

### Reproducibility Resources

For those interested in exploring the complete findings:

- **[Hypotheses Dataset](https://gist.github.com/i-tozer/7aca31a359141a044c3fb5020c0398e3)** - JSON export of all generated hypotheses
- **[Full Project Archive](https://drive.google.com/drive/folders/1dpkLj-Jd4cawE37hA9I7AwlpFL2DK8NN)** - Complete Hound analysis workspace

### Setup Instructions

To replicate the analysis environment:

1. **Install Hound**: `git clone https://github.com/scabench-org/hound && cd hound`
2. **Setup environment**: `python -m venv venv && source venv/bin/activate && pip install -r requirements.txt`
3. **Initialize project**: `python hound.py project create aragon_ve_governance path/to/ve-governance/`
4. **Replace with full analysis**: Replace the `/aragon_ve_governance/` folder created within `.hound` with the downloaded full project archive (same folder name: `aragon_ve_governance`)
5. **View analysis graphs**: `python hound.py graph export aragon_ve_governance --open`
6. **Browse hypotheses**: `python hound.py project hypotheses aragon_ve_governance`

**Configuration Notes**: To run investigations and audits with existing graphs, update file paths (search for `Users/iantozer/Code` references) and use the provided [chunked contract files](https://drive.google.com/drive/folders/1aqpxlD-BsCh-54WGskWesSBOcEdOhiGN?usp=drive_link) - preprocessed contracts with comments/whitespace removed and breakpoints inserted for optimal analysis.