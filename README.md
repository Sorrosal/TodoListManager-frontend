# TodoList Manager Frontend

A modern, feature-rich task management application built with Vue 3, Quasar Framework, and TypeScript.

## 🚀 Features

- **User Authentication** - Secure JWT-based authentication with login/logout functionality
- **Task Management** - Create, read, update, and delete todo items
- **Category Organization** - Organize tasks by categories (Work, Personal, Shopping, Health, Education, Finance, Home)
- **Progress Tracking** - Track task completion with percentage-based progress and historical data
- **Progress History** - View complete timeline of progress updates with date and time
- **Visual Progress Indicators** - Color-coded progress bars (red < 50%, orange 50-80%, green > 80%)
- **Responsive Design** - Mobile-first design that works on all devices
- **Component-Based Architecture** - Modular, reusable components for better maintainability

## 🛠️ Tech Stack

- **Framework**: Quasar v2.18.6 (Vue 3)
- **Language**: TypeScript
- **Build Tool**: Vite
- **State Management**: Composables (Vue Composition API)
- **HTTP Client**: Axios
- **Styling**: Quasar Components + SCSS
- **Linting**: ESLint + Vue ESLint + TypeScript ESLint
- **Code Quality**: Prettier

## 📋 Prerequisites

- Node.js >= 16.x
- npm or yarn
- Backend API running on `https://localhost:7292` (configurable via `.env`)

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd TodoListManager-frontend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Configure environment variables:
```bash
# Copy the example environment file
cp .env .env.local

# Edit .env.local and set your API URL
VITE_API_URL=https://localhost:7292
```

## 🏃 Running the Application

### Development Mode
Start the app with hot-code reloading and error reporting:
```bash
npm run dev
# or
quasar dev
```

The application will be available at `http://localhost:9000`

### Production Build
Build the app for production:
```bash
npm run build
# or
quasar build
```

## 🧪 Code Quality

### Lint Files
Check for code quality issues:
```bash
npm run lint
# or
yarn lint
```

### Format Files
Format code with Prettier:
```bash
npm run format
# or
yarn format
```

## 📁 Project Structure

```
src/
├── assets/           # Static assets (images, fonts, etc.)
├── boot/            # Quasar boot files
│   └── axios.ts     # Axios configuration
├── components/      # Reusable Vue components
│   └── TodoList/    # Todo-related components
│       ├── TodoListHeader.vue
│       ├── TodoItemCard.vue
│       ├── TodoItemList.vue
│       ├── TodoFormDialog.vue
│       ├── TodoProgressDialog.vue
│       ├── TodoHistoryDialog.vue
│       ├── TodoLoadingState.vue
│       ├── TodoEmptyState.vue
│       └── index.ts
├── composables/     # Vue composition functions
│   ├── index.ts
│   ├── useTodoItems.ts
│   └── useTodoDialogs.ts
├── css/             # Global styles
├── layouts/         # Layout components
│   └── MainLayout.vue
├── models/          # TypeScript interfaces and types
│   ├── auth.model.ts
│   ├── todolist.model.ts
│   └── index.ts
├── pages/           # Page components (routes)
│   ├── LoginPage.vue
│   ├── TodoListPage.vue
│   └── ErrorNotFound.vue
├── router/          # Vue Router configuration
│   ├── index.ts
│   └── routes.ts
├── services/        # API services
│   ├── api.client.ts
│   ├── auth.service.ts
│   ├── todolist.service.ts
│   └── index.ts
└── App.vue          # Root component
```

## 🎨 Architecture

### Composables Pattern
The application uses Vue 3 Composition API with custom composables for business logic:

- **useTodoItems**: Manages todo CRUD operations, progress tracking, and data formatting
- **useTodoDialogs**: Handles dialog state management and form data

### Component Organization
Components are organized by feature and follow the single responsibility principle:

- **Smart Components** (Pages): Handle data fetching and business logic coordination
- **Presentation Components**: Focus on UI rendering and user interactions
- **Dialog Components**: Manage form input and validation

### API Integration
- Centralized API client with Axios interceptors
- Automatic JWT token injection
- Global error handling with Quasar notifications
- Type-safe API calls with TypeScript interfaces

## 🔐 Authentication

The app uses JWT-based authentication:

1. Login with username/password
2. JWT token stored in localStorage
3. Token automatically included in API requests
4. Unauthorized requests (401) redirect to login
5. Logout clears token and redirects to login

## 🎯 Available Categories

- Work
- Personal
- Shopping
- Health
- Education
- Finance
- Home

## 📊 Progress Tracking

Tasks can track progress with:
- Percentage completion (0-100%)
- Date and time of each progress update
- Visual color-coded progress bars
- Historical timeline of all progress entries

## 🌐 API Endpoints

The frontend integrates with these API endpoints:

- `POST /api/v1/Auth/login` - User authentication
- `GET /api/v1/Auth/me` - Get current user info
- `GET /api/v1/TodoList` - Get all todo items
- `POST /api/v1/TodoList` - Create new todo item
- `PUT /api/v1/TodoList/{id}` - Update todo item
- `DELETE /api/v1/TodoList/{id}` - Delete todo item
- `POST /api/v1/TodoList/{id}/progression` - Register progress

## ⚙️ Configuration

### Environment Variables
Create a `.env.local` file with:
```env
VITE_API_URL=https://localhost:7292
VITE_APP_NAME=TodoListManager
VITE_APP_VERSION=1.0.0
```

### Quasar Configuration
Customize the application in `quasar.config.ts`:
- Build options
- Dev server settings
- PWA configuration
- Environment variables

## 🐛 Troubleshooting

### API Connection Issues
- Verify backend is running on the configured URL
- Check CORS settings on the backend
- Ensure SSL certificate is trusted (for HTTPS)

### Build Errors
- Clear build cache: `rm -rf .quasar node_modules/.vite`
- Reinstall dependencies: `npm install`
- Restart dev server

## 📚 Learn More

- [Quasar Documentation](https://v2.quasar.dev/)
- [Vue 3 Documentation](https://vuejs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Vite Documentation](https://vitejs.dev/)

## 📄 License

This project is private and proprietary.
