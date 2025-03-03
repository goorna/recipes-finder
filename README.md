# Recipe Finder
A web application for discovering, searching, and saving your favorite recipes. Built with Nuxt.js and modern web technologies.

## Project Overview
Recipe Finder allows users to:

Search for recipes using keywords

View detailed recipe information

Save favorite recipes for later reference

Access saved recipes even when offline

## Technology Stack
Framework : Nuxt.js 3 - Vue.js framework

State Management : Pinia - Intuitive, type-safe store for Vue

UI Components : Custom components with responsive design

Storage : Browser localStorage for saving favorite recipes

Project Structure
recipes-finder/
├── components/       # Reusable Vue components
├── composables/      # Shared composition functions
├── layouts/          # Page layouts
├── pages/            # Application routes
├── public/           # Static assets
├── services/         # API service modules
│   └── recipes/      # Recipe-related API services
├── stores/           # Pinia stores
│   ├── favorites.ts  # Favorites management
│   └── search.ts     # Search functionality
├── types/            # TypeScript type definitions
└── utils/            # Utility functions

## Key Features

### Search Functionality
The application uses a dedicated search store to manage query state and synchronize with URL parameters, allowing for shareable search results and browser history integration.

### Favorites Management
Users can save recipes to their favorites, which are stored in the browser's localStorage.


## Setup and Development

Prerequisites
Node.js (v16 or later)

npm or yarn

### Installation

### npm
```npm install```

### yarn
```yarn install```

### Development Server

Start the development server on http://localhost:3000:

### npm
```npm run dev```

### yarn
```yarn dev```

### Test

### npm
```npm run test```

### yarn
```yarn test```

### Production Build

## npm
```npm run build```
```npm run preview```

## yarn
```yarn build```
```yarn preview```


## Some things I would have done differently if this had been a project for the company I work for:
- Managing translations through tools like Weblate (or Contentful)  
- Error management system  
- Monitoring via DataDog  
- Creating a design system (a component library to import/reuse across multiple projects) 
- Improve test code coverage 
- Hooks pre-commit/pre-push
- Merge request template
- Recipe images would be hosted remotely, not within the project

## Choices and Limitations
- **API:** I used a mocking service and the same endpoint for both the list and the details. Normally, I would expect two separate endpoints.  
- **UI Kit:** Initially, I considered using a UI kit for components (like PrimeVue), but then I thought it would be more useful for you to see how I approach building custom components.  
- **Nuxt:** The application is not complex, but I saw it as something that could potentially grow with the addition of new features (user accounts, recipe creation, and more). A framework seemed like the best choice for the project's future evolution.


