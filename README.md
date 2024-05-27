# PhantaField

## Introduction

PhantaField is a blockchain-based application that allows users to log in using MetaMask and Google OAuth. The project is built using Next.js, Moralis, and Web3Modal.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js and Yarn installed on your machine.
- MetaMask installed in your browser.
- Google OAuth credentials.
- Moralis API key.
- Magic.link API key.

## Installation

1. **Clone the Repository:**

   ```sh
   git clone https://github.com/czkcool666/phantaJack.git
   cd phantaJack
----------------------------


yarn install
---------------------------------------------
Create a .env.local File:

GOOGLE_CLIENT_ID=758789077626-n7bpsp1trgl8e3o07har9800usv3dr1t.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
NEXTAUTH_SECRET=your-nextauth-secret
NEXT_PUBLIC_MAGIC_LINK_API_KEY=pk_live_051CED0A2B7C5630
MORALIS_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImU0ODg5MzYxLTA1ZTEtNGYxNi1iZWM5LTIwNzMzM2FkOGUwOCIsIm9yZ0lkIjoiMzkzMDk0IiwidXNlcklkIjoiNDAzOTE5IiwidHlwZUlkIjoiMzcwNjQyM2UtNzI4Yy00MDM2LTkxNmYtYzk5NjE5NjBhNWU4IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MTYyNjkyNDAsImV4cCI6NDg3MjAyOTI0MH0.jCieOc6tdgEn8GNGVsxx1LfT_5K1bqMO7H8lRJjT-nE

APP_DOMAIN=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_MORALIS_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImU0ODg5MzYxLTA1ZTEtNGYxNi1iZWM5LTIwNzMzM2FkOGUwOCIsIm9yZ0lkIjoiMzkzMDk0IiwidXNlcklkIjoiNDAzOTE5IiwidHlwZUlkIjoiMzcwNjQyM2UtNzI4Yy00MDM2LTkxNmYtYzk5NjE5NjBhNWU4IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MTYyNjkyNDAsImV4cCI6NDg3MjAyOTI0MH0.jCieOc6tdgEn8GNGVsxx1LfT_5K1bqMO7H8lRJjT-nE
NEXT_PUBLIC_MAGIC_SECRET_KEY=sk_live_0875FDB1D155DEFB
NEXT_PUBLIC_MAGIC_REDIRECT_URI=http://localhost:3000/callback

--------------------------------
yarn build
yarn start

Open your browser and navigate to http://localhost:3000/signin to access the login page.
