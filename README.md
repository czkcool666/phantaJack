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

# Google OAuth
GOOGLE_CLIENT_ID=758789077626-n7bpsp1trgl8e3o07har9800usv3dr1t.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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

# NextAuth
NEXTAUTH_SECRET=your-nextauth-secret

# Magic Link
NEXT_PUBLIC_MAGIC_LINK_API_KEY=pk_live_051CED0A2B7C5630
NEXT_PUBLIC_MAGIC_SECRET_KEY=sk_live_0875FDB1D155DEFB
NEXT_PUBLIC_MAGIC_REDIRECT_URI=http://localhost:3000/callback
MAGIC_SECRET_KEY=sk_live_0875FDB1D155DEFB
NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY=pk_live_051CED0A2B7C5630

# Moralis
MORALIS_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImU0ODg5MzYxLTA1ZTEtNGYxNi1iZWM5LTIwNzMzM2FkOGUwOCIsIm9yZ0lkIjoiMzkzMDk0IiwidXNlcklkIjoiNDAzOTE5IiwidHlwZUlkIjoiMzcwNjQyM2UtNzI4Yy00MDM2LTkxNmYtYzk5NjE5NjBhNWU4IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MTYyNjkyNDAsImV4cCI6NDg3MjAyOTI0MH0.jCieOc6tdgEn8GNGVsxx1LfT_5K1bqMO7H8lRJjT-nE
NEXT_PUBLIC_MORALIS_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImU0ODg5MzYxLTA1ZTEtNGYxNi1iZWM5LTIwNzMzM2FkOGUwOCIsIm9yZ0lkIjoiMzkzMDk0IiwidXNlcklkIjoiNDAzOTE5IiwidHlwZUlkIjoiMzcwNjQyM2UtNzI4Yy00MDM2LTkxNmYtYzk5NjE5NjBhNWU4IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MTYyNjkyNDAsImV4cCI6NDg3MjAyOTI0MH0.jCieOc6tdgEn8GNGVsxx1LfT_5K1bqMO7H8lRJjT-nE

# Firebase
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCeV72LiPHA5Or/\n2cEIHsFqCLojIujg9tUUFTGlVIVzXxkTYmPlJWAfftGN8L8WioD1p4jej3g7+g4X\nJ/VzMt1QqNoeNT+LcIg9JsHHUY9Xh492GOotnBFgqzGLb4PZqyxuGl2l+PtmqSPT\nhxuIInI28E9L5OFS4AFUpTTAqsZOjnsxnY+BjAsqYF8eD+X4yvB+F+Vq4p/ToudX\nppD+9nb3zWzzzsMyKMGf40K/lcFFZedtUHt0ZzdG8MbDUe4V3La+HQV1lnOWk4pT\nzoLfvmi0eRzbrrQbN2UhzTe8cbfYAFHcaTDGSCvaCIyZ0iCYXTlA1zI+RCY4kwEj\n37n06uMHAgMBAAECggEAAmbORymCkSxnrA2/ccIVqOgM+q9y3MahoLZZlGpdw8wz\ncynQ3g7dEF06DG8UVuEu54rs9oMyjaZTRGKkxGSHGswU0tR37EN+rX7C/aTtCaTS\ntjXWh26QjOjLzZOZalnASMM5nGTUW1BBbNnlvwDWvqKScVI9YKZpHsGKtUlhzJsy\ng1vusXWX72XR4jv1MOGxsfM8iSSZ+nvHKzJ9i8cKfNnazBPkIHEGO3MT5Joqz3f5\nI7rs3ryxpe2NVeTmS33xy3T+FPWCulJ7zYTFKkzof87wWYfeh3uluhxORYOiJ4t4\nBStDamUmzf+qnk1d7vR0O0qcqE1PJghIqQYCUJ+RUQKBgQDNQVcLw+Up2VecTqv/\ntl9MVEvARF67isS43pqhCpXxZBhwQ+HP4kBAOCeY4MTx9YeJZMxPQ1PZq/yDrZDZ\nug5efmQfomLO/ohYfXcPS8xrVypHdtEauoIXNCAkKcXOVcNz5POqnIMj1cCvRKNv\nSrM8hL5JakxuMWEDzyCY5odPpQKBgQDFfUum7HOG65/eGJLrtZKjvWN05EptiM1F\n6nRPLWaicysIjTy8oHsh/c1YkYldDkAT78Z2939veSoFaq8ArzBlR8LNoNPqsHTB\njAVgPmvcNtIkFPheTyZQDRaSVOKY2eZxoiN5X7VFBCjM25/zqsutefLOUrBDRarb\ng3KND/boOwKBgDTupckV8tJRB4P60eZ3HKptjr99okSRK9xVI+Fl/ncrDhZdmy1m\nNpWZJbUKOh//5r0q7nl+bnBTJyK6LwHHNo9t3to9oWeqQnU3ne2m6YfBCdk2LgTL\nlmLvgV5yG13zxhzsLV6RUEx8gl1wwQkhZYm03fHG5QEB4Pf/gXOM99Y1AoGAa2K6\nJEYme5LcFzRdj3XoCskMr58DKZRdqkrWe8dAK81b9QZ3pEnPKqiLZEGe486/4Rdc\nX4ws6zyDMPbVuhWIx0nCD3YIRXE1y5iLw82tcM0ObzhH5WA8gQLc5yzpGhxCRj/X\n8kOsmZ6tYNd7nk+c+PN6p94moi3bvgk33KR1qckCgYAtIvTeGZpt4nqIoV30qZ3L\naZECJWlI+6HZYYCt9p8eUB2/bQV6ypY8U3NGGeqYlzdzyjLg3456Z1uPoAKbQfVK\nV8i3VLQS7918Vn9Wd9I2CDoHIQA3iOjBRfbRsJVvz8RIDhbE1hAGFu6Yylwme17S\nn3K6hQNkthfmEKt3V1bwZQ==\n-----END PRIVATE KEY-----\n"

# Firebase Public API Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBgEftqqH04eUHnNLpWkTTjHidRY5PIqc0
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=phantafield-424104.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=phantafield-424104
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=phantafield-424104.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=758789077626
NEXT_PUBLIC_FIREBASE_APP_ID=1:758789077626:web:336708dfbc700c61ebd9c3
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-8QZXHTZ6F9
NEXT_PUBLIC_FIREBASE_CLIENT_ID=758789077626-n7bpsp1trgl8e3o07har9800usv3dr1t.apps.googleusercontent.com
NEXT_PUBLIC_FIREBASE_CLIENT_SECRET=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

# App configuration
APP_DOMAIN=http://localhost:3000
NEXTAUTH_URL=http://localhost:3000





--------------------------------
yarn build
yarn start

Open your browser and navigate to http://localhost:3000/signin to access the login page.
