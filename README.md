# 🌸 Animania

![Status](https://img.shields.io/badge/Status-Active-brightgreen) ![License](https://img.shields.io/badge/License-MIT-blue)

Hey there! Welcome to **Animania**. 

If you're anything like me, keeping track of what anime you're currently watching, what you've finished, and what's rotting away in your massive watchlist is a bit of a struggle. I built Animania to solve that. It's a gorgeous, lightning-fast web app designed for anime fans who want to discover new shows and organize their library without dealing with cluttered or outdated interfaces.

I put a lot of love into making this look and feel as premium as possible, leaning heavily into a sleek dark-mode aesthetic.

## ✨ Why I Built This (And What It Does)

- **It Looks Awesome**: I was tired of boring UI. Animania uses Tailwind CSS to deliver a minimalist, glassmorphic design with super smooth micro-animations. It just feels *good* to use.
- **Search That Actually Works (And Never Goes Down)**: There's nothing worse than an API crashing when you're trying to find a show. I built a custom **Multi-API Fallback System**. It defaults to the Jikan API (MyAnimeList), but if their servers ever get overloaded, it instantly and invisibly switches to the AniList API so your search never breaks. 
- **Your Personal Library**: Found something you like? Toss it into your `Watching`, `Completed`, or `Watchlist` categories with one click.
- **Discover Your Next Obsession**: You can endlessly scroll through trending shows, the most popular hits of all time, and specific genres like Action or Romance through the interactive carousels on the home page.
- **Smart Recommendations**: Don't know what to watch next? The app looks at what's currently in your library and gives you personalized recommendations.
- **Blazing Fast**: I implemented some aggressive smart-caching under the hood. Pages load almost instantly.

## 🛠️ What's Under The Hood?

I used a modern JavaScript stack to bring this to life:

- **Frontend**: Next.js 14 (App Router) + React 19
- **Styling**: Tailwind CSS v4 (with some custom CSS magic) + Lucide React for crisp icons
- **Backend**: Node.js + Express.js
- **Database**: MongoDB (via Mongoose) to safely store your libraries
- **Auth**: Secure JWT authentication (plus bcrypt for password hashing)
- **The Anime Data**: Powered by the awesome [Jikan API](https://jikan.moe/) and [AniList API](https://anilist.gitbook.io/anilist-apiv2-docs/).

## 🚀 Want to Run It Yourself?

Awesome! Getting it running on your local machine is super straightforward.

### What you'll need
- Node.js (v18 or higher)
- A MongoDB database (either installed locally or a free cloud cluster on MongoDB Atlas)

### Let's get it set up

1. **Grab the code:**
   ```bash
   git clone https://github.com/Arjun-143-kamath/Animania.git
   cd Animania
   ```

2. **Fire up the backend:**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file inside the `server` folder and drop in your variables:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string_here
   JWT_SECRET=make_up_a_super_secret_string_here
   ```
   Start it up:
   ```bash
   npm start
   ```

3. **Fire up the frontend:**
   Open a new terminal tab, and run:
   ```bash
   cd client
   npm install
   ```
   Create a `.env.local` file inside the `client` folder:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```
   Start the Next.js dev server:
   ```bash
   npm run dev
   ```

4. **Enjoy!**
   Head over to `http://localhost:3000` in your browser and start building your library.

## 🤝 Want to Help Out?

I'm always open to ideas! If you find a bug, want a new feature, or want to contribute some code, feel free to open an issue or submit a pull request on the [issues page](https://github.com/Arjun-143-kamath/Animania/issues). 

## 📝 License

This project is completely open-source and licensed under the MIT License. Do whatever you want with it!

---
Created with ❤️ by Arjun
