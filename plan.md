# GDrive Audio Player Development Plan

This document outlines the development phases for the GDrive Audio Player project.

## Phase 1: Core Functionality & Setup (Completed)

- **Objective:** Establish the project foundation, including setup, authentication, routing, and basic audio playback.
- **Key Tasks:**
    - [x] Set up project with Vite and React.
    - [x] Install all necessary dependencies (`@react-oauth/google`, `gapi-script`, `axios`, `react-router-dom`, `xstate`).
    - [x] Implement Google OAuth for user authentication.
    - [x] Set up secure handling of Google Client ID using environment variables.
    - [x] Implement protected and public routes using `react-router-dom` loaders.
    - [x] Create an Axios instance with an interceptor to attach the auth token.
    - [x] Implement a service to fetch audio files from Google Drive.
    - [x] Create a basic `AudioPlayer` component using XState for state management.
    - [x] Verify that single audio file playback is functional.

---

## Phase 2: Playlist Implementation (Completed)

- **Objective:** Build the core playlist functionality, allowing users to see and play a list of their audio files.
- **Key Tasks:**
    - [x] Create `playlistMachine.ts` using XState to manage the playlist state.
    - [x] Develop the `Playlist.tsx` component to render the list of audio tracks.
    - [x] Create `PlaylistContext` to provide the playlist state and actions.
    - [x] Fetch audio files in `HomePage.loader.ts` and populate the playlist machine.
    - [x] Connect the `AudioPlayer` to the `playlistMachine`.

---

## Phase 3: Advanced Features & UI/UX Polish (Current Focus)

- **Objective:** Enhance the user experience with advanced controls and a more polished interface.
- **Key Tasks:**
    - **1. Advanced Player Controls:**
        - [ ] Implement shuffle functionality in `playlistMachine.ts`.
        - [ ] Implement repeat functionality (repeat one, repeat all) in `playlistMachine.ts`.
        - [ ] Add UI controls for shuffle and repeat to the `AudioPlayer` component.
        - [ ] Add a volume control slider to the `AudioPlayer`.
        - [ ] Add a seek/progress bar to the `AudioPlayer`.
    - **2. UI/UX Enhancements:**
        - [ ] Add loading indicators (e.g., skeletons) while fetching files in `HomePage.tsx`.
        - [ ] Implement toast notifications for key events (e.g., "Now Playing...").
        - [ ] Improve the overall visual design and layout for responsiveness.
    - **3. Persistence:**
        - [ ] Persist the user's playlist and current track to `localStorage` to resume across sessions.