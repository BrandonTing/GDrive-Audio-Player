# TanStack Query Integration Plan

This document outlines the development plan for integrating TanStack Query into the GDrive Audio Player project to enable efficient data caching.

### The Goal

The objective is to replace the direct, uncached API calls in the `homePageLoader` with TanStack Query's smart caching mechanism. This will prevent redundant network requests when navigating between folders you've already visited, making the application feel significantly faster.

### The Strategy

We will adopt the recommended "loader factory" pattern. This involves creating a `queryClient` and passing it to our loader, which will then use the client to fetch and cache data. The `HomePage` component itself will require almost no changes, as it will continue to receive its data from the loader via `useLoaderData`.

---

### The Plan

#### Phase 1: Installation and Setup

1.  **Install Dependencies:**
    First, we'll add TanStack Query and its developer tools to the project.

    Command to run:
    `bun add @tanstack/react-query @tanstack/react-query-devtools`

2.  **Provide the QueryClient:**
    We need to wrap the entire application with the `QueryClientProvider` so that all components and hooks can access the cache. We'll also add the devtools for easy debugging.

    The modification will happen in `src/index.tsx`.

#### Phase 2: Refactor Data Fetching Logic

1.  **Define the Query:**
    We'll centralize the query logic. This involves defining a `queryKey` (a unique identifier for this data) and a `queryFn` (the function that fetches the data).

    A new file will be created at `src/queries/folderQueries.ts`.

#### Phase 3: Integrate with the React Router Loader

1.  **Create the Loader Factory:**
    We will update `src/pages/HomePage.loader.ts` to accept the `queryClient` and use it to fetch data via `queryClient.ensureQueryData`, which automatically handles caching.

2.  **Update the Router Definition:**
    Finally, we'll update our main router configuration in `src/index.tsx` to pass the `queryClient` instance to our new loader factory. This will involve restructuring the routes to use the `children` property for proper layout nesting.

#### Phase 4: Verification

1.  **No Component Changes Needed:** The `HomePage.tsx` component should work without any changes, as the data structure returned by `useLoaderData()` remains the same.
2.  **How to Verify:**
    *   Run the application and open the browser's developer tools.
    *   Navigate into a folder. You will see API calls in the "Network" tab.
    *   Navigate back to the parent folder, then navigate back into the same child folder again.
    *   **Observe:** This second time, there should be **no new network request** for that folder's contents. The data is served instantly from the cache.
    *   The TanStack Query Devtools can also be used to inspect the cache.
