# Animania

## Project Overview

Animania is an anime tracking web application that allows users to organize and manage the anime they watch. The goal is to provide a simple, fast, and intuitive platform where users can keep track of their anime progress without unnecessary complexity.

The application is centered around a user's personal anime library. Users can search for anime, add them to different tracking categories, update their progress, and manage their watch history.

---

## Technology Stack

Animania follows a decoupled client-server architecture where the frontend and backend are developed independently and communicate through REST APIs.

### Frontend

* **Next.js**

  * Primary frontend framework
  * React-based architecture
  * Uses the App Router
  * Component-based UI
  * Handles routing, rendering, and user interactions
  * Tailwind CSS is used for styling
  * Prefer TypeScript whenever possible

### Backend

* **Node.js + Express.js**

  * Express.js serves as the REST API server
  * Handles authentication, business logic, validation, and communication with the database
  * Provides endpoints consumed by the Next.js frontend

### Database

* **MongoDB**

  * Primary NoSQL database
  * Stores user accounts
  * Stores anime collections
  * Stores user watch progress
  * Stores authentication-related data

* **Mongoose**

  * Used as the ODM for MongoDB
  * Defines schemas and models

### API Architecture

* **REST API**

  * The frontend communicates exclusively with the backend through RESTful endpoints.
  * APIs should follow REST conventions.
  * Use appropriate HTTP methods:

    * `GET` for retrieving data
    * `POST` for creating resources
    * `PUT` or `PATCH` for updating resources
    * `DELETE` for removing resources
  * Return meaningful HTTP status codes.
  * Return consistent JSON responses.

### External API

* **Jikan API**

  * Used as the primary source of anime metadata.
  * Provides:

    * Anime search
    * Anime details
    * Episode count
    * Season information
    * Genres
    * Ratings
    * Images
    * Synopsis

---

## Core Features

### Anime Search

Users can search for anime using the Jikan API.

Display relevant information such as:

* Title
* Poster
* Synopsis
* Genres
* Episode count
* Status
* Rating
* Release year

---

### User Authentication

Users must have an account to save their anime library.

Authentication includes:

* Sign Up
* Login
* Logout
* Persistent sessions

Each user has their own independent anime collection.

---

## Anime Categories

Every anime belongs to exactly one of the following categories.

### 1. Watchlist

Anime the user plans to watch in the future.

Characteristics:

* No viewing progress.
* No completed episodes.
* Can be moved into **Watching** once the user starts watching it.

---

### 2. Watching

Anime the user is currently watching.

Tracks:

* Current season number
* Current episode number

Users can continuously update their progress as they watch.

Once the anime has been completed, it can be moved into **Completed**.

---

### 3. Completed

Anime the user has finished watching.

Characteristics:

* All available episodes are considered completed.
* Season progress is complete.
* Acts as the user's viewing history.

---

## User Workflow

Typical workflow:

1. Search for an anime.
2. Add it to Watchlist.
3. Start watching.
4. Move it to Watching.
5. Update episode and season progress.
6. Finish the anime.
7. Move it to Completed.

---

## Design Goals

Animania should prioritize:

* Clean UI
* Responsive design
* Fast interactions
* Minimal clicks
* Easy navigation
* Modern appearance
* Accessibility
* Smooth user experience

The application should feel lightweight and enjoyable to use.

---

## Development Guidelines

When generating code:

* Write clean, modular, and maintainable code.
* Prefer reusable components over duplicated code.
* Keep business logic separate from UI components.
* Follow consistent naming conventions.
* Prefer async/await over promise chains.
* Follow REST best practices.
* Avoid unnecessary dependencies.
* Keep the codebase scalable.
* Generate production-ready code whenever possible.
* Preserve existing architecture when adding new features.
* Explain major architectural decisions when appropriate.
* Prefer incremental improvements over large rewrites.

---

## Project Philosophy

Animania is **not** intended to be a social media platform.

Its primary purpose is helping users maintain a personal anime library and track their viewing progress in the simplest and most enjoyable way possible.

Every feature should support this core objective.

---

## Expected Assistance from Gemini CLI

When assisting with development:

* Understand the existing project structure before making changes.
* Follow the project's coding conventions.
* Preserve existing functionality unless explicitly instructed otherwise.
* Do not introduce breaking changes.
* Write production-ready code.
* Prioritize readability and maintainability.
* Keep components modular and reusable.
* Suggest improvements that align with the project's philosophy.
* Ask for clarification if requirements are ambiguous rather than making assumptions.

