# Civisight
![Static Badge](https://img.shields.io/badge/Unihack_7-Top_5-blue)
![Static Badge](https://img.shields.io/badge/Blockchain_challenge-Winner-gold)

AI-powered civic monitoring app that lets citizens photograph and report urban issues; UniHack 7 entry.

## About 🎈
Civisight is a platform that enables citizens to report community problems (such as damaged infrastructure, trash, street issues), vote on issues, and track their resolution status.
It includes:

- A Spring Boot backend (REST API + security + database)
- A React Native mobile app for citizens
- Full authentication & user roles
- Blockchain-ready reporting logic
- AI classification/API integration

## 🚀 Features
### 👤 Citizen Features
- Report a problem (photo + description + GPS coordinates)
- Upvote / downvote other problems
- View problems on a map or list
- Track score/rank based on contributions
- See personal vote status for each problem (+1, 0, -1)

### 🏛 Admin/Institution Features

- Review reported issues
- Change issue status (OPEN → IN_PROGRESS → RESOLVED)
- Moderate invalid reports

### 🧠 AI & Blockchain Modules

- AI classification of issues
- Sending reports to a blockchain network for public traceability
