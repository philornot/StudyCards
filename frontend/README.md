# Study Cards Frontend

## Tech Stack
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: CSS with CSS Variables

## Setup

### 1. Install dependencies:
```bash
pnpm install
```

### 2. Environment variables:
Create a `.env` file in the frontend directory (optional - defaults work for development):
```bash
cp .env.example .env
```

Available variables:
- `VITE_API_URL`: Backend API URL (default: `http://localhost:8000/api`)

### 3. Run development server:
```bash
pnpm run dev
```

The app will be available at: http://localhost:5173

### 4. Build for production:
```bash
pnpm run build
```

### 5. Preview production build:
```bash
pnpm run preview
```

## Project Structure
```
frontend/
├── src/
│   ├── assets/           # Static assets
│   ├── components/       # React components
│   │   └── ui/          # Reusable UI components
│   ├── pages/           # Page components
│   ├── services/        # API services
│   ├── styles/          # Global styles and variables
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── public/              # Public assets
├── package.json
└── README.md
```

## Available Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build
- `pnpm run lint` - Run ESLint (if configured)

## Design System

The app uses CSS variables for consistent theming. Variables are defined in `src/styles/variables.css`:

- **Colors**: Primary, secondary, danger, backgrounds, borders, text colors
- **Spacing**: xs, sm, md, lg, xl, 2xl
- **Typography**: Font sizes and weights
- **Border Radius**: sm, md, lg, full
- **Shadows**: sm, md, lg

### Example usage:
```css
.my-component {
  color: var(--color-primary);
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
}
```

## Components

### UI Components (Reusable)
- `Button` - Variants: primary, secondary, danger, outline
- `Input` - Text input with label and error state
- `Textarea` - Multiline text input
- `Card` - Content container with optional hover effect
- `LoadingSpinner` - Loading indicator

### Feature Components
- `Navbar` - Navigation bar
- `SetCard` - Display set information in grid
- `CardEditor` - Edit flashcard term/definition
- `EmptyState` - Empty state placeholder

## API Integration

API calls are centralized in `src/services/api.js`:
```javascript
import { setsApi } from './services/api';

// Get all sets
const sets = await setsApi.getAll();

// Get set by ID
const set = await setsApi.getById(id);

// Create new set
const newSet = await setsApi.create(data);
```