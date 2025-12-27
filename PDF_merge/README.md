# PDF Operations UI - Frontend

A modern, responsive React + TypeScript frontend for the PDF Operations Backend API. Built with Vite, Tailwind CSS, and Lucide Icons.

## 🎨 Features

- **Modern UI/UX** - Clean, intuitive interface with glassmorphism design
- **Real-time Feedback** - Loading states, error handling, and success messages
- **File Management** - Drag & drop support, file validation, and preview
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Type Safety** - Full TypeScript support for better development experience
- **API Integration** - Seamless connection with FastAPI backend

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - Promise-based HTTP client
- **Lucide React** - Beautiful icon library

## 📁 Project Structure

```
frontend/
│
├── src/
│   ├── components/
│   │   ├── MergePDF.tsx           # Merge PDFs component
│   │   ├── SplitPDFPages.tsx      # Split into pages component
│   │   └── SplitPDFRange.tsx      # Split by range component
│   │
│   ├── services/
│   │   └── api.ts                 # API service layer
│   │
│   ├── App.tsx                    # Main app component
│   ├── main.tsx                   # Application entry point
│   └── index.css                  # Global styles
│
├── public/                        # Static assets
├── index.html                     # HTML template
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
├── vite.config.ts                 # Vite config
└── tailwind.config.js             # Tailwind config
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- Backend API running on `http://127.0.0.1:8000`

### Installation

**1. Navigate to frontend directory**

```bash
cd frontend
```

**2. Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

**3. Configure environment (optional)**

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` if your backend runs on a different URL:

```
VITE_API_BASE_URL=http://127.0.0.1:8000
```

**4. Start development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The application will start at `http://localhost:3000`

### Building for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
```

Build output will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
# or
yarn preview
# or
pnpm preview
```

## 🔌 API Configuration

The frontend connects to the backend through Vite's proxy configuration in `vite.config.ts`:

```typescript
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:8000',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
}
```

This configuration:
- Runs the dev server on port 3000
- Proxies all `/api/*` requests to the backend at `http://127.0.0.1:8000`
- Removes the `/api` prefix when forwarding to backend

## 📱 Features Walkthrough

### 1. Merge PDFs

- Upload multiple PDF files
- Optional password protection
- Download merged result
- Visual file list with size display

### 2. Split PDF into Pages

- Upload single PDF
- Extracts all pages as individual files
- Optional password protection
- Shows list of generated files

### 3. Split PDF by Range

- Upload single PDF
- Specify start and end page numbers
- Optional password protection
- Download extracted range

## 🎨 Customization

### Changing Colors

Edit `tailwind.config.js` to customize the color scheme:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      },
    },
  },
}
```

### Modifying Components

All components are in `src/components/`. Each component is self-contained and can be modified independently.

## 🛠️ Development

### Running Linter

```bash
npm run lint
# or
yarn lint
# or
pnpm lint
```

### Type Checking

TypeScript will automatically check types during development. For manual check:

```bash
npx tsc --noEmit
```

## 🐛 Troubleshooting

### Issue: API requests failing

**Solution:**
- Ensure backend is running on `http://127.0.0.1:8000`
- Check CORS settings in FastAPI backend
- Verify proxy configuration in `vite.config.ts`

### Issue: Build fails

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: TypeScript errors

**Solution:**
```bash
# Ensure all types are installed
npm install --save-dev @types/react @types/react-dom
```

## 🚀 Deployment

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
# Upload dist/ folder to Netlify
```

### Deploy with Docker

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:

```bash
docker build -t pdf-operations-ui .
docker run -p 80:80 pdf-operations-ui
```

## 📦 Dependencies

### Main Dependencies

- `react` - UI library
- `react-dom` - React DOM renderer
- `axios` - HTTP client
- `lucide-react` - Icon library

### Dev Dependencies

- `vite` - Build tool
- `typescript` - Type checking
- `tailwindcss` - CSS framework
- `@vitejs/plugin-react` - React support for Vite

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- FastAPI for the excellent backend framework
- React team for the amazing library
- Tailwind CSS for the utility-first approach
- Lucide for beautiful icons

---

**Built with ❤️ using React, TypeScript, and Vite**