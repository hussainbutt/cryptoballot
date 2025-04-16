# Crypto Ballot

This is a mobile-first decentralized voting application built with **React Native**, designed to bring transparency and accountability to the electoral process. It features both:

- 🧑‍💼 **Admin Dashboard** for managing elections, parties, and candidates
- 🗳️ **User (Voter) Interface** for signing up, viewing elections, and casting votes

> The project is actively being developed as a **Final Year Project (FYP)**. The current focus is on implementing:


---

## 📱 Features

### ✅ Voter Side
- Sign Up / Sign In
- View Active & Upcoming Elections
- Cast Vote / Change Vote (while the election is active)
- View Past Election History and Results

### 🛠️ Admin Dashboard
- Create, View, Update, Delete:
  - Elections
  - Political Parties
  - Candidates
- Admin Authentication
- Election Results Overview

---

## ⚙️ Tech Stack

- **Frontend:** React Native + TypeScript + NativeWind (Tailwind for RN)
- **Backend:** Node.js + Express + MongoDB
- **Blockchain Integration:** Internet Computer (ICP) with Motoko (coming soon)
- **Routing:** `expo-router`
- **Image Uploads:** `expo-image-picker`

---

## 🚧 Project Status

The project is actively being developed as a **Final Year Project (FYP)**. The current focus is on implementing:

- Admin-side CRUD operations
- Voter-facing voting flow
- Smart contract logic for secure, immutable vote storage (via ICP)

---

## 🛠️ Setup Instructions

1. Clone the repo:
   ```bash
   git clone https://github.com/your-username/decentralized-voting-app.git
   cd decentralized-voting-app
   Install dependencies:

npm install

Install required Expo packages:

npm install @react-native-picker/picker expo-image-picker

Start the app:

npx expo start

Make sure the backend is running at http://<your-ip>:5000. You can update the IP in API calls inside the frontend code.
