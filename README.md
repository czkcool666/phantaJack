# PhantaField Frontend

## Introduction

This project is a Next.js application designed to implement a Web3 authentication system using Magic.link for OAuth (Google login), NextAuth.js for authentication handling, Moralis for interacting with the blockchain, and Web3 for Ethereum provider connections.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed [Node.js](https://nodejs.org/) and [Yarn](https://yarnpkg.com/).
- You have a GitHub account and have cloned this repository.
- You have configured environment variables for Magic.link, Google OAuth, NextAuth.js, and Moralis.

## Installation

To set up the project locally, follow these steps:

1. **Clone the repository:**

   ```sh
   git clone https://github.com/czkcool666/phantaJack.git
   cd phantaJack

2. intsall dependencies
   yarn install

3. set up the environment variables

create ".env.local" file in the root of the project including (example):


GOOGLE_CLIENT_ID=758789077626-n7bpsp1trgl8e3o07har9800usv3dr1t.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
NEXTAUTH_SECRET=your-nextauth-secret
NEXT_PUBLIC_MAGIC_LINK_API_KEY=pk_live_051CED0A2B7C5630
MORALIS_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImU0ODg5MzYxLTA1ZTEtNGYxNi1iZWM5LTIwNzMzM2FkOGUwOCIsIm9yZ0lkIjoiMzkzMDk0IiwidXNlcklkIjoiNDAzOTE5IiwidHlwZUlkIjoiMzcwNjQyM2UtNzI4Yy00MDM2LTkxNmYtYzk5NjE5NjBhNWU4IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MTYyNjkyNDAsImV4cCI6NDg3MjAyOTI0MH0.jCieOc6tdgEn8GNGVsxx1LfT_5K1bqMO7H8lRJjT-nE

APP_DOMAIN=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_MORALIS_API_KEY=NEXT_PUBLIC_MORALIS_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImU0ODg5MzYxLTA1ZTEtNGYxNi1iZWM5LTIwNzMzM2FkOGUwOCIsIm9yZ0lkIjoiMzkzMDk0IiwidXNlcklkIjoiNDAzOTE5IiwidHlwZUlkIjoiMzcwNjQyM2UtNzI4Yy00MDM2LTkxNmYtYzk5NjE5NjBhNWU4IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MTYyNjkyNDAsImV4cCI6NDg3MjAyOTI0MH0.jCieOc6tdgEn8GNGVsxx1LfT_5K1bqMO7H8lRJjT-nE
NEXT_PUBLIC_MAGIC_SECRET_KEY=sk_live_0875FDB1D155DEFB
NEXT_PUBLIC_MAGIC_REDIRECT_URI=http://localhost:3000/callback

create ".env.production", including(example):
NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY=pk_live_051CED0A2B7C5630
NEXT_PUBLIC_MAGIC_REDIRECT_URI=https://auth.magic.link/v1/oauth2/q5M3PemfFP5C9XcYGVGEVssrzFeQv-CR6ZTeCGR2oDk=/callback




4. generate SSH keys for GitHub (if necessary):
ssh-keygen -t ed25519 -C "your_email@example.com"
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
cat ~/.ssh/id_ed25519.pub

---------------------------------------------------------------
RUN THE PROJECT
After completing the setup, you can start the development server:
yarn dev 
(The application should now be running on http://localhost:3000.)

Then type:
yarn build
yarn start
