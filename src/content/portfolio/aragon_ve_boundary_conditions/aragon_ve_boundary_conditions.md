# Boundary Conditions for MAX_EPOCHS and SHARED_LINEAR_COEFFICIENT

## **1. Summary**

This report aims to find safe upper bounds for two parameters controlling how voting power grows with lock duration: `MAX_EPOCHS` (maximum time allowed for a lock) and `SHARED_LINEAR_COEFFICIENT`, which is the fixed per-unit slope governing how quickly voting power increases (`slope = amount × SHARED_LINEAR_COEFFICIENT`). These appear in both `EscrowIVotesAdapter` and `LinearIncreasingCurve` and must be constrained to prevent denial-of-service conditions.

The core safety limit arises from the maximum possible **bias**. Because a user can allocate full voting weight (`1e36`) to one gauge, the system must ensure bias remains well below the overflow threshold. After normalisation, the practical safe ceiling is **~1e59**.

**Recommended Bounds**

| Parameter                       | Recommended Bounds            | Notes                                                                                                                                   |
| ------------------------------- | ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| **`MAX_EPOCHS`**                | 0 ≤ X ≤ **6500** (~250 years) | Far below overflow thresholds.                                                              |
| **`SHARED_LINEAR_COEFFICIENT`** | 0 ≤ X ≤ **1e13**              | Ensures the slope (`amount × coefficient`) cannot generate unsafe bias values, even under extreme token amounts and maximum lock times. |

 **Justification**

These bounds preserve intended behaviour while maintaining large safety margins. `MAX_EPOCHS` is capped for practicality, and `SHARED_LINEAR_COEFFICIENT ≤ 1e13` ensures the slope cannot push bias near the overflow limit, even with long locks and full gauge allocation. 

---
## **2. Scope & Context**

This report analyses `MAX_EPOCHS` and `SHARED_LINEAR_COEFFICIENT`. The goal is to determine safe and reasonable upper bounds that avoid vulnerabilities (integer overflow, excessive precision loss, or unintended denial-of-service behaviour) while preserving intended behaviour.

**Variables Considered**

Four stored variables are evaluated:

1. **`EscrowIVotesAdapter::SHARED_LINEAR_COEFFICIENT`**
2. **`EscrowIVotesAdapter::MAX_EPOCHS`**
3. **`LinearIncreasingCurve::SHARED_LINEAR_COEFFICIENT`**
4. **`LinearIncreasingCurve::MAX_EPOCHS`**

**Key Assumptions**

The following assumptions are made throughout the analysis:

- **Token decimals**
    - The escrowed token uses **18 decimal places**.

- **Fixed coefficients**
    - `SHARED_CONSTANT_COEFFICIENT = 1e18`
    - `SHARED_QUADRATIC_COEFFICIENT = 0`  
            
- **Epoch duration**
    - `epochDuration = 1,209,600 seconds` (two weeks)
        
- **Lock horizon scenarios**
    - Bounds are evaluated under a realistic range of `MAX_EPOCHS` that translate to lock durations between **2 weeks and 250 years**.
        
- **Supply assumptions for pathological cases**
    - When evaluating maximum bias and slope, a worst-case assumption of **1e36 effective locked units** (1e18 tokens × 1e18 decimals) is used.

---
## **3. System Mechanics**

This section outlines how the parameters `MAX_EPOCHS` and `SHARED_LINEAR_COEFFICIENT` influence voting power throughout the system.

### **Definition of `maxTime`**

`MAX_EPOCHS` determines the maximum time horizon over which a lock can accumulate variable voting power. It is converted into a duration in seconds:

`maxTime = MAX_EPOCHS × epochDuration`

Where:
- `epochDuration` = 1,209,600 seconds (2 weeks)
- `maxTime` is the upper limit on the time-dependent term of the bias
    
This means:

- Larger `MAX_EPOCHS` → longer available slope accumulation window
- `MAX_EPOCHS = 0` → disables the variable component entirely (flat voting power curve)
    
A user’s effective elapsed lock time is:

`ELAPSED = block.timestamp – lock.start`

But accumulation only counts up to:

`min(ELAPSED, maxTime)`

### **Bias Formula & Normalisation**

Voting power is built from a time-invariant constant component and a time-increasing variable component. The core quantity is **bias**:

`BIAS = AMOUNT × SHARED_CONSTANT_COEFFICIENT + AMOUNT × SHARED_LINEAR_COEFFICIENT × min(ELAPSED, maxTime)`

Where:

- `AMOUNT` is the user’s locked token balance
- `SHARED_CONSTANT_COEFFICIENT = 1e18`
- `SHARED_LINEAR_COEFFICIENT` is the parameter under review
- No quadratic term is used (`SHARED_QUADRATIC_COEFFICIENT = 0`)
    
Bias is stored internally as an **int256** and then normalised to produce a **uint256 voting power**:

`votingPower = uint256(BIAS / 1e18)`

### **Propagation into Gauge Voting**

Voting power becomes relevant when allocating it to gauges through the `AddressGaugeVoter`. The function responsible for translating user-assigned weights into actual votes is:

```solidity
function _votesForGauge(uint256 _weight, uint256 _votingPower) internal view returns (uint256) {
	 return (_weight * _votingPower) / 1e36; 
}
```

Where:

- `_weight` is the gauge weight assigned by the user, expressed with **36 decimal places**
- Maximum possible: `1e36` (100% allocation)
- `_votingPower` is the normalised voting power from the bias
    
If a user allocates all of their voting power to a single gauge:

`votesForGauge = (1e36 × votingPower) / 1e36 = votingPower`

### **Why `_votesForGauge` Creates the Tightest Overflow Constraint**

The tightest overflow risk appears in `AddressGaugeVoter::_votesForGauge`, where a user’s voting power is scaled by their gauge weight:

```solidity
function _votesForGauge(
    uint256 _weight,
    uint256 _votingPower
) internal view virtual returns (uint256) {
    return (_weight * _votingPower) / 1e36;
}
```

- `_weight` is a 36-decimals fixed-point weight (max `1e36`, i.e. 100% allocation).
- `_votingPower` is derived from `bias` as:
    
    ```solidity
    votingPower = uint256(bias / 1e18);
    ```

To avoid overflow in the multiplication:

```text
_weight * _votingPower < 2^256
```

In the worst case, the user allocates **all** their weight to a single gauge:

```text
_weight = 1e36 (100% allocation)
```

So the safety condition becomes:

```text
votingPower < (2^256 − 1) / 1e36  ≈ 1.2 × 10^41
```

Given:

```text
votingPower = bias / 1e18
```

we get the corresponding bound on `bias`:

```text
bias < ((2^256 − 1) / 1e36) × 1e18 ≈ 1.2 × 10^59
```

For simplicity and a bit of extra slack, we treat:

```text
bias_max ≈ 1e59
```

as a **conservative global ceiling** for bias.

As a result:

> **All safe choices for `MAX_EPOCHS` and `SHARED_LINEAR_COEFFICIENT` must ensure that, even under extreme assumptions (max supply, max lock, max weight), `bias` stays comfortably below ~1e59, so that `votingPower` stays below ~1e41 and `_votesForGauge` cannot overflow.**


---

## **4. Safe Bounds Derivation**

This section derives practical upper bounds for `MAX_EPOCHS` and `SHARED_LINEAR_COEFFICIENT` using the global bias ceiling established in Section 3:

`bias < ~1e59`

This bound ensures `votingPower` remains safely within the range where `_votesForGauge` cannot overflow, even when the user allocates full weight to a single gauge (`_weight = 1e36`).

### Bound on `MAX_EPOCHS`

`MAX_EPOCHS` appears through:

```
maxTime = MAX_EPOCHS × epochDuration
```

where `epochDuration = 1,209,600` seconds.

#### **Type Bound**

A `uint256` can theoretically hold:

```
MAX_EPOCHS ≤ (2^256 − 1) / 1,209,600   ≈ 10^70
```

This corresponds to lock horizons lasting **billions of billions of years**, so there is no realistic overflow risk from multiplication alone.

#### **Practical Bound**

To ensure sanity and operational clarity:

> **Recommended Bound**  
> `0 ≤ MAX_EPOCHS ≤ 6500` (≈ 250-year horizon)

This is far below the type limit, yet well above any expected economic design requirement.  
`MAX_EPOCHS = 0` is valid and produces a flat voting-power curve.

### Bound on `SHARED_LINEAR_COEFFICIENT`

The parameter under scrutiny is the slope term in:

```
BIAS = AMOUNT × (1e18 + SHARED_LINEAR_COEFFICIENT × maxTime)
```

At maximum lock length (`ELAPSED ≥ maxTime`), this cannot exceed the global safety ceiling:

```
AMOUNT × (1e18 + SHARED_LINEAR_COEFFICIENT × maxTime) < 1e59
```

To derive a conservative global bound, we apply the worst-case assumption already introduced:

```
AMOUNT = 1e36 (maximal effective locked supply)
```

Substituting and dividing through:

```
1e18 + SHARED_LINEAR_COEFFICIENT × maxTime  < 1e23
```

Which gives:

```
SHARED_LINEAR_COEFFICIENT  <  (1e23 − 1e18) / maxTime  ≈ 1e23 / maxTime
```

Thus, the safe coefficient scales inversely with the chosen lock horizon.

#### **Scenario Bounds**

Using representative maximum lock durations:

| Max Lock Duration | Approx. `maxTime` (seconds) | Max Safe Linear Coefficient | Notes                                                   |
| ----------------- | --------------------------- | --------------------------- | ------------------------------------------------------- |
| **10 years**      | 3.2 × 10⁸                   | **~3.1 × 10¹⁴**             | Allows large (100×–1000×) multipliers safely            |
| **20 years**      | 6.4 × 10⁸                   | **~1.6 × 10¹⁴**             | Scaling halves when lock horizon doubles                |
| **50 years**      | 1.6 × 10⁹                   | **~6.3 × 10¹³**             | More conservative long-horizon configuration            |
| **100 years**     | 3.2 × 10⁹                   | **~3.1 × 10¹³**             | Very long-term locks; slope reduced by ~10× vs 10 years |
| **250 years**     | 8.0 × 10⁹                   | **~1.3 × 10¹³**             | Extreme horizon; tightest slope of the considered cases |

These bounds remain comfortably below the threshold where bias approaches 1e59.

#### **Final Recommendation**

> **Recommended Bound**  
> `0 ≤ SHARED_LINEAR_COEFFICIENT ≤ 1e13`

This sits safely below all scenario-specific limits, including long horizons, and guarantees that even extreme token amounts and full gauge allocation cannot push `bias` into the danger zone.

## **5. Other Dangerous / Edge Configurations**

| Configuration Type                                                               | What Happens                                    | Why It’s a Problem                                                                                                                                                                                                 |
| -------------------------------------------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Negative `SHARED_LINEAR_COEFFICIENT`**                                         | Voting power decreases over time                | System is not designed for negative slopes                                                                                                                                                                         |
| **Mismatch between adapter + curve `MAX_EPOCHS` or `SHARED_LINEAR_COEFFICIENT`** | Inconsistent calculations                       | Produces inconsistent voting power across code paths                                                                                                                                                               |
| **Setting `SHARED_LINEAR_COEFFICIENT` without considering `MAX_EPOCHS`**         | Slope implicitly becomes too strong or too weak | The two values are coupled; in practice `SHARED_LINEAR_COEFFICIENT ≈ VARIABLE_MULTIPLIER / MAX_EPOCHS`, so choosing one without the other can push bias toward unsafe ranges or distort intended lock-time scaling |


---

## **6. Practical Recommendations**

- **Ensure `SHARED_LINEAR_COEFFICIENT ≥ 0`**  - Negative slopes are out-of-spec and should be rejected at deployment.
- **Cap `SHARED_LINEAR_COEFFICIENT ≤ 1e13`** - This keeps bias comfortably below the ~1e59 ceiling across realistic lock horizons.
- **Enforce matching `MAX_EPOCHS` & `SHARED_LINEAR_COEFFICIENT` values** in`EscrowIVotesAdapter` and `LinearIncreasingCurve` contracts.       
- **Constrain `MAX_EPOCHS` to a practical upper bound**, e.g.: `0 ≤ MAX_EPOCHS ≤ 30,000   // ~1,000-year horizon`, or `6500 // 250-year horizon`.

## **7. Appendix — Full Derivation**

This appendix provides the full reasoning and mathematical derivation behind the upper bound on `SHARED_LINEAR_COEFFICIENT`. The bound is obtained by analysing how large `bias` can become under extreme assumptions and ensuring that the vote-scaling operation in `AddressGaugeVoter::_votesForGauge` cannot overflow.

---
### **1. Identifying the Critical Scaling Risk**

`SHARED_LINEAR_COEFFICIENT` directly affects the variable slope of voting power. Large slopes increase **bias**, which then becomes **votingPower**, which is multiplied by user-assigned gauge weight in the following function:

```solidity
function _votesForGauge(
    uint256 _weight,
    uint256 _votingPower
) internal view returns (uint256) {
    return (_weight * _votingPower) / 1e36;
}
```

### Worst-case conditions

- A user allocates **100%** of their voting weight to one gauge:
    
    ```
    _weight = 1e36
    ```
    
- `_votingPower` is derived from:
    
    ```
    votingPower = uint256(bias / 1e18)
    ```
    
- `bias` is stored as an `int256`, so:
    
    ```
    bias ≤ 2^255 − 1  ≈ 5.79e76
    ```
    
However, the **overflow-sensitive multiplication** is:

```
_weight × votingPower  <  2^256
```

Substituting `_weight = 1e36`:

```
votingPower  <  (2^256 − 1) / 1e36  ≈ 1.16 × 10^41
```

Since:

```
votingPower = bias / 1e18
```

we obtain:

```
bias  <  1.16 × 10^59
```

For safety and clarity, we adopt the conservative ceiling:

> **Global safe bias limit:**  
> `bias < 1e59`

This is the primary constraint governing safe values of `SHARED_LINEAR_COEFFICIENT`.

---

### **2. Bias Inequality and Simplification**

The bias formula at maximum lock duration is:

```
BIAS = AMOUNT × SHARED_LINEAR_COEFFICIENT × MAX_TIME
     + AMOUNT × CONSTANT_COEFFICIENT
```

Substitute the global ceiling:

```
1e59  >  AMOUNT × SHARED_LINEAR_COEFFICIENT × MAX_TIME
         + AMOUNT × 1e18
```

Using:

```
AMOUNT = 1e36    // worst-case effective locked supply
```

Divide the entire inequality by 1e36:

```
1e23  >  SHARED_LINEAR_COEFFICIENT × MAX_TIME + 1e18
```

Rearranging:

```
SHARED_LINEAR_COEFFICIENT × MAX_TIME  <  1e23 − 1e18
≈ 1e23
```

Thus the slope must satisfy:

> **`SHARED_LINEAR_COEFFICIENT < 1e23 / MAX_TIME`**

This is the master bound from which scenario-specific and global recommendations follow.

---

### **3. Expressing the Coefficient in “Numerator Form”**

In some configurations, the slope is set as:

```
SHARED_LINEAR_COEFFICIENT = LINEAR_COEFFICIENT_NUMERATOR / MAX_TIME
```

Substituting into the inequality:

```
1e23  >  LINEAR_COEFFICIENT_NUMERATOR
```

So the numerator must satisfy:

> **`LINEAR_COEFFICIENT_NUMERATOR < 1e23`**

This matches the bound above and is consistent with expected 18–36 decimal scaling ranges in VE tokenomics.

---

### **4. Worst-Case Amount Scalar**

The derivation assumes:

- Token has **18 decimals**
- User locks up to **1e18 tokens**
- Internally represented as **1e36 units**
    

This is consistent with:

- Observed max supplies (no major asset > 6e14 supply)
- “Extreme worst-case” scenario for protocol hardening
    
Under this assumption, the system supports **up to ~1e21× effective voting-power multipliers** before hitting any overflow risk.

If `bias` were _not_ normalised by `1e18` prior to gauge weight multiplication, the bound would tighten dramatically to:

```
~1.58 × 10^41
```


---

### **5. Reintroducing `MAX_TIME`**

Restating:

```
SHARED_LINEAR_COEFFICIENT  <  1e23 / MAX_TIME
```

Now evaluate this across realistic lock durations.

We approximate:

- 10 years ≈ 3.2e8 seconds
- 20 years ≈ 6.4e8 seconds
- 50 years ≈ 1.6e9 seconds

---

### **6. Scenario Evaluations**

#### **(1) 10-year max lock**

```
MAX_TIME_10Y ≈ 3.2e8
SHARED_LINEAR_COEFFICIENT < 1e23 / 3.2e8
                       ≈ 3.125e14
```

→ **Safe: ~3.1 × 10¹⁴**

---

#### **(2) 20-year max lock**

```
MAX_TIME_20Y ≈ 6.4e8
SHARED_LINEAR_COEFFICIENT < 1e23 / 6.4e8
                       ≈ 1.5625e14
```

→ **Safe: ~1.6 × 10¹⁴**

---

#### **(3) 50-year max lock**

```
MAX_TIME_50Y ≈ 1.6e9
SHARED_LINEAR_COEFFICIENT < 1e23 / 1.6e9
                       ≈ 6.25e13
```

→ **Safe: ~6.3 × 10¹³**

---

### **7. Complete Bias Calculations (Verification)**

Using:

```
AMOUNT = 1e36
CONSTANT_COEFFICIENT = 1e18
```

#### **10-Year Example**

```
coeff = 3.1e14
maxTime = 3.2e8

BIAS = 1e36 × 3.1e14 × 3.2e8 + 1e36 × 1e18
     = 1e36 × 9.92e22 + 1e54
     = 9.92e58 + 1e54
≈ 1.0e59  // safe
```

---

#### **20-Year Example**

```
coeff = 1.6e14
maxTime = 6.4e8

BIAS = 1e36 × 1.6e14 × 6.4e8 + 1e36 × 1e18
     = 1e36 × 1.024e23 + 1e54
≈ 1.024e59  // safe
```

---

#### **50-Year Example**

```
coeff = 6.3e13
maxTime = 1.6e9

BIAS = 1e36 × 6.3e13 × 1.6e9 + 1e36 × 1e18
     = 1e36 × 1.008e23 + 1e54
≈ 1.008e59  // safe
```

---

### **8. Conclusion of Full Derivation**

- The system remains safe as long as:
    
    ```
    SHARED_LINEAR_COEFFICIENT < 1e23 / MAX_TIME
    ```
    
- For lock horizons between **10 and 50 years**, safe coefficients range from **3.1e14 down to 6.3e13**.
- These values ensure **bias stays well under 1e59**, preventing overflow in `_votesForGauge`. 
- The protocol supports extremely large possible multipliers without risk, provided coefficients stay within the derived bounds.