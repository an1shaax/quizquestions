# QuizQuestions – Soroban Smart Contract

## Project Description

QuizQuestions is a simple decentralized quiz system built using **Soroban smart contracts on the Stellar network**.  
The project demonstrates how blockchain can be used to store and verify quiz questions and answers in a transparent and tamper-proof way.

Using Soroban, the quiz logic runs directly on-chain, ensuring fairness and trust without relying on centralized servers.

This project serves as a beginner-friendly example of how to build educational or gamified applications on Stellar.

---

## What it does

The smart contract allows users to interact with a decentralized quiz system where:

- Questions are stored on-chain
- Users can retrieve quiz questions
- Users can submit answers
- The contract verifies whether the answer is correct

All quiz data is stored directly inside the Soroban smart contract storage.

---

## Features

- On-chain quiz question storage
- Decentralized answer verification
- Simple and efficient Soroban contract logic
- Immutable question records
- Beginner-friendly example for Soroban developers
- Built using Rust and Soroban SDK

---

## Smart Contract Functions

### `add_question`
Adds a new quiz question to the blockchain.

**Parameters**
- `id` – Question ID
- `question` – Quiz question text
- `answer` – Correct answer

---

### `get_question`
Retrieves a quiz question by ID.

---

### `check_answer`
Checks whether a submitted answer is correct.

**Returns**
- `true` if correct
- `false` if incorrect

---

## Tech Stack

- **Stellar Soroban**
- **Rust**
- **Soroban SDK**

---

## Deployed Smart Contract Link

🔗 https://lab.stellar.org/r/testnet/contract/CAMP4KWUOXJOHCGPMUNPMEHAJOKSRM6NZ2CBSFST5Z6HDYLKHBV2BQN4

*(Replace with the actual Stellar contract address or Explorer link after deployment)*

Example:

https://stellar.expert/explorer/testnet/contract/XXXXXXXX

---

## Future Improvements

- Multiple-choice questions
- Player scoring system
- Leaderboard
- Reward tokens for correct answers
- Time-limited quiz rounds
- Admin-only question creation

---

## License

MIT License