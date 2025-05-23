# Pizza Diet Website 🍕

A modern, responsive website for Pizza Diet - Premium Vegetarian Pizzas.

## Features

- 🎨 Modern design with smooth animations
- 📱 Fully responsive (mobile-first)
- 🛒 Smart cart system with WhatsApp integration
- 👑 Admin panel for content management
- 🖼️ Dynamic gallery management
- 🍕 Menu management system
- 💾 Local storage for data persistence

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository or download the files
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```
4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser

### Admin Panel Access

To access the admin panel:
1. Go to `http://localhost:3000?admin=true`
2. Enter password: `pizzadiet2025`
3. Manage menu items and gallery images

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (irreversible)

## Project Structure

```
src/
├── components/          # All React components
│   ├── Header/         # Navigation header
│   ├── Hero/           # Hero section
│   ├── Gallery/        # Image gallery
│   ├── Menu/           # Menu section
│   ├── Cart/           # Shopping cart
│   ├── Admin/          # Admin panel
│   └── Common/         # Shared components
├── hooks/              # Custom React hooks
├── context/            # React context providers
├── data/               # Initial data and constants
└── styles/             # Global styles and CSS

```

## Technologies Used

- **React 18** - UI framework
- **Tailwind CSS** - Styling framework
- **Lucide React** - Icon library
- **Context API** - State management
- **Local Storage** - Data persistence

## Deployment

### Netlify
1. Run `npm run build`
2. Upload the `build` folder to Netlify

### Vercel
1. Connect your GitHub repository
2. Vercel will automatically deploy

### GitHub Pages
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json: `"homepage": "https://yourusername.github.io/pizza-diet"`
3. Add scripts: `"predeploy": "npm run build", "deploy": "gh-pages -d build"`
4. Run: `npm run deploy`

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.
