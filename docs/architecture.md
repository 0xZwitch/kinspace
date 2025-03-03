## Architecture Design

### Requirment

- The platform should allow user to create a space
- The platform should allow user to mint membership NFT collection
- The platform should allow user to join a space
- The platform should allow user with access token to chat inside the space
- The platform should allow user with space authority to start a livestream\*
- The platform should allow user to transfer lamports to space treasury
- The platform should allow user with authority to withdraw from space treasury
- The platform should claim fee from treasury withdrawal\*

Note:

\*TBD

#### Overview

```mermaid
flowchart LR
A[User - Admin] -- 1 - create space --> B[Space]
B -. mint .-> C[Membership Mint]
D -- 2 - join space --> B
D -- 3 - donate --> B
B -- 4- withdraw --> A
D[User - Member] -. acquire print .-> C

```

1. Create Space

- User create a space
- User mint membership

2. Join Space

- Platform verify membership
- User granted access to social features

3. Donate

- User transfer to space treasury

4. Withdraw

- User with authority can withdraw from treasury
- Platform claim withdraw fee

##### Accounts

```mermaid
---
title: Accounts
---
classDiagram
    class Config {
      + seed: u64
      + authority: Option<Pubkey>
      + withdraw_fee: u16
      + treasury_bump: u8
      + bump: u8
    }

    class Space {
        + creator: Pubkey
        + name: String          // 32
        + description: String   // 256
        + membership_mint: Pubkey
        + treasury_bump: u8
        + bump: u8
    }

```

##### Create Space

```mermaid
flowchart
A[User] --> B[Create Space]
B --> C{"Validate Length
for Name and
Description"}
C -- valid --> D[Init Space]
C -- not valid --> E[Error: Exceed Length]
E --> F{ }
D --> F
F --> G@{ shape: cross-circ }
```

##### Join Space

```mermaid
flowchart
A[User] --> B[Join Space]
B --> C{"Verify
Ownership"}
C -- verified --> D[Access granted]
C -- not verified --> E[Error: Unauthorized]
E --> F{ }
D --> F
F --> G@{ shape: cross-circ }
```

##### Donate

```mermaid
flowchart
A[User] --> B[Donate]
B --> C[Transfer to treasury]
C --> D@{ shape: cross-circ }
```

##### Withdraw

```mermaid
flowchart
A[User] --> B[Withdraw]
B --> C[Calculate fee]
C --> D[Transfer net amount to destination]
D --> E[Transfer fee to platform's treasury]
E --> F@{ shape: cross-circ }
```
