# 📺 Screen Board

A beautiful, interactive digital display board built with React that automatically rotates between different informational slides. Perfect for lobby displays, information kiosks, or any public viewing screen.

![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=flat&logo=react)
![Vite](https://img.shields.io/badge/Vite-7.1.14-646CFF?style=flat&logo=vite)
![Tests](https://img.shields.io/badge/Tests-Passing-success?style=flat)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat)

---

## ✨ Features

- 🔄 **Auto-Rotating Slides** - Automatically cycles through content every 10 seconds
- ⌨️ **Keyboard Controls** - Navigate manually with arrow keys and pause with spacebar
- 🎨 **Smooth Transitions** - Beautiful fade in/out effects between slides
- 📱 **Responsive Design** - Looks great on any screen size
- 🎯 **Multiple Content Types**
  - Concessions menu and pricing
  - Knox County Cup tournament information
  - Easily extensible for more slides
- ♿ **Accessible** - Built with accessibility in mind
- ✅ **Fully Tested** - Comprehensive BDD-style unit tests

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ (with npm)
- Modern web browser

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/screen-board.git
cd screen-board

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:5173`

---

## 📖 Usage

### Development

```bash
# Start dev server with hot reload
npm run dev

# Run linter
npm run lint

# Run tests
npm test

# Run tests once (CI mode)
npm run test:run

# Open test UI
npm run test:ui
```

### Production

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Keyboard Controls

When viewing the screen board:

- **← Left Arrow** - Previous slide
- **→ Right Arrow** - Next slide  
- **Spacebar** - Pause/Resume auto-rotation

---

## 🏗️ Project Structure

```
screen-board/
├── src/
│   ├── components/
│   │   ├── ScreenRotator.jsx      # Main rotation logic
│   │   ├── common/                 # Shared components
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── SlideLayout.jsx
│   │   └── slides/                 # Individual slide components
│   │       ├── Concessions/
│   │       └── KnoxCountyCup/
│   ├── data/                       # JSON data files
│   │   ├── concessions.json
│   │   └── kcc-pool.json
│   ├── test/                       # Test configuration
│   │   └── setup.js
│   ├── App.jsx                     # Root component
│   └── main.jsx                    # Entry point
├── docs/                           # Documentation
│   └── developers/                 # Developer documentation
├── public/                         # Static assets
├── vitest.config.js               # Test configuration
├── vite.config.js                 # Build configuration
└── package.json
```

---

## 🎨 Customization

### Adding New Slides

1. Create a new component in `src/components/slides/YourSlide/`
2. Add your slide to `src/components/slides/Slides.jsx`
3. Update the `VIEWS` array in `ScreenRotator.jsx`
4. Add your slide data to `src/data/` if needed

### Adjusting Timing

Edit constants in `src/components/ScreenRotator.jsx`:

```javascript
const ROTATION_INTERVAL = 10000; // Time per slide (milliseconds)
const FADE_DURATION = 250;       // Fade transition time
```

---

## 🧪 Testing

This project uses **Vitest** and **React Testing Library** with beautiful, human-readable **BDD-style tests**.

```bash
# Run tests in watch mode
npm test

# Run tests once
npm run test:run

# Open interactive test UI
npm run test:ui

# Generate coverage report
npm run test:coverage
```

### Test Coverage

- ✅ **App.jsx** - 11/11 tests passing
- 📊 **Code Coverage** - Comprehensive test suite
- 📖 **BDD Style** - Tests read like documentation

**Current Status**: Phase 1 Complete - All tests passing!

---

## 📚 Documentation

Comprehensive developer documentation is available in the `docs/developers/` directory:

### For Developers

- **[Testing Guide](docs/developers/TESTING.md)** - Complete testing documentation with BDD principles
- **[Quick Start Testing](docs/developers/QUICK_START_TESTING.md)** - Fast reference for running tests
- **[Test Phase 1 Summary](docs/developers/TEST_PHASE_1_SUMMARY.md)** - App.jsx test completion report
- **[Troubleshooting](docs/developers/TROUBLESHOOTING.md)** - Common issues and solutions

---

## 🛠️ Tech Stack

### Core
- **React 19.1.1** - UI library
- **Vite 7.1.14** - Build tool and dev server
- **PostCSS** - CSS processing with autoprefixer

### Development
- **ESLint** - Code linting
- **Vitest 3.2.4** - Unit testing
- **React Testing Library** - Component testing
- **jsdom** - DOM testing environment

### Build & Deploy
- **Rolldown-Vite** - Optimized Vite variant
- **PostCSS Preset Env** - Future CSS features

---

## 🎯 Features in Detail

### Screen Rotation
- Automatically cycles through configured slides
- Smooth fade transitions between content
- Configurable timing intervals
- Visual indicators for current slide

### Keyboard Navigation
- Arrow keys for manual navigation
- Spacebar to pause/resume rotation
- Visual feedback for pause state
- Intuitive on-screen control hints

### Content Management
- JSON-based data storage
- Easy to update without code changes
- Structured data for each slide type
- Support for various content formats

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Write tests** for your changes (we follow BDD principles!)
4. **Ensure tests pass**: `npm run test:run`
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### Coding Standards

- Write **BDD-style tests** for all new features
- Follow existing code style and conventions
- Keep components **small and focused**
- Add **JSDoc comments** for public APIs
- Ensure all tests pass before submitting

---

## 📋 Roadmap

- [ ] Phase 2: Component testing (ScreenRotator, Header, Footer, Slides)
- [ ] Phase 3: Integration testing
- [ ] Touch screen support for navigation
- [ ] Admin panel for content management
- [ ] Real-time data updates
- [ ] Theme customization
- [ ] Multiple display profiles

---

## 🐛 Known Issues

No known issues at this time. See [TROUBLESHOOTING.md](docs/developers/TROUBLESHOOTING.md) for common problems and solutions.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Authors

**Your Name** - Initial work

---

## 🙏 Acknowledgments

- Built with [React](https://react.dev/)
- Powered by [Vite](https://vitejs.dev/)
- Tested with [Vitest](https://vitest.dev/) and [React Testing Library](https://testing-library.com/)
- Icons and badges from [Shields.io](https://shields.io/)

---

## 📞 Support

For questions, issues, or feature requests:

- 🐛 [Open an issue](https://github.com/yourusername/screen-board/issues)
- 📖 Check the [documentation](docs/developers/)
- 💬 Start a [discussion](https://github.com/yourusername/screen-board/discussions)

---

<p align="center">
  Made with ❤️ and ☕ by developers, for developers
</p>

<p align="center">
  <strong>⭐ Star this repo if you find it useful!</strong>
</p>
