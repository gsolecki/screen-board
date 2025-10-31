# 📺 Screen Board

A beautiful, interactive digital display board built with React that automatically rotates between different informational slides. Perfect for lobby displays, information kiosks, or any public viewing screen.

![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=flat&logo=react)
![Vite](https://img.shields.io/badge/Vite-7.1.14-646CFF?style=flat&logo=vite)
![Tests](https://img.shields.io/badge/Tests-Passing-success?style=flat)
![Deployment](https://img.shields.io/badge/Deployed-Azure%20Static%20Web%20Apps-0078D4?style=flat&logo=microsoft-azure)
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
- 🚀 **Production Ready** - Deployed on Azure Static Web Apps

### 🌐 Live Demo

👉 **[View Live Application](https://chiqchic.com)** 👈

**Production URL**: https://chiqchic.com  
**Azure Default URL**: https://icy-hill-08e9aec10.3.azurestaticapps.net

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

# Preview production build locally
npm run preview
```

The preview server will start at `http://localhost:4173`

> **Note**: Modern React applications cannot be opened directly in a browser from the file system due to CORS restrictions. Always use `npm run preview` or an HTTP server to test the production build locally.

---

## 🌐 Deployment

### Azure Static Web Apps (Recommended)

This application is deployed to **Azure Static Web Apps**. You can deploy using the Azure CLI or GitHub Actions.

#### Current Deployment
🌐 **Production URL**: https://chiqchic.com  
🌐 **Azure URL**: https://icy-hill-08e9aec10.3.azurestaticapps.net  
🔒 **Custom Domain**: chiqchic.com (SSL/TLS enabled)

#### Prerequisites

- Azure account with an active subscription
- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) installed
- Azure Static Web App resource created

#### Manual Deployment with Azure CLI

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Login to Azure**:
   ```bash
   az login
   ```

3. **Get your deployment token**:
   ```bash
   az staticwebapp secrets list \
     --name screenboard \
     --resource-group screenboard-rg \
     --query "properties.apiKey" -o tsv
   ```

4. **Deploy using SWA CLI**:
   ```bash
   npx @azure/static-web-apps-cli deploy ./dist \
     --deployment-token <YOUR_DEPLOYMENT_TOKEN> \
     --env production
   ```

#### Custom Domain Configuration

The application is configured with a custom domain: **chiqchic.com**

To add or update a custom domain:

1. **Add custom domain via Azure CLI**:
   ```bash
   az staticwebapp hostname set \
     --name screenboard \
     --resource-group screenboard-rg \
     --hostname yourdomain.com
   ```

2. **Configure DNS records** at your domain registrar:
   - **Type**: CNAME
   - **Name**: @ (or www)
   - **Value**: icy-hill-08e9aec10.3.azurestaticapps.net
   - **TTL**: 3600 (or your preference)

3. **Verify domain** (automatic SSL/TLS provisioning):
   ```bash
   az staticwebapp hostname list \
     --name screenboard \
     --resource-group screenboard-rg
   ```

4. Wait for SSL certificate provisioning (typically 5-10 minutes)

**Current Configuration**:
- ✅ Custom domain: chiqchic.com
- ✅ SSL/TLS: Enabled (auto-provisioned by Azure)
- ✅ Status: Ready

#### Automated Deployment with GitHub Actions

Add this workflow to `.github/workflows/azure-static-web-apps.yml`:

```yaml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main
  pull_request:
    types: [opened, synchronize, reopened, closed]
    branches:
      - main

jobs:
  build_and_deploy_job:
    if: github.event_name == 'push' || (github.event_name == 'pull_request' && github.event.action != 'closed')
    runs-on: ubuntu-latest
    name: Build and Deploy Job
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: true
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build application
        run: npm run build
        
      - name: Deploy to Azure Static Web Apps
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/"
          output_location: "dist"

  close_pull_request_job:
    if: github.event_name == 'pull_request' && github.event.action == 'closed'
    runs-on: ubuntu-latest
    name: Close Pull Request Job
    steps:
      - name: Close Pull Request
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
          action: "close"
```

**Setup GitHub Actions**:
1. Go to your GitHub repository settings → Secrets and variables → Actions
2. Add a new secret named `AZURE_STATIC_WEB_APPS_API_TOKEN`
3. Paste your deployment token as the value
4. Push changes to trigger automatic deployment

### Alternative Deployment Options

#### Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

#### Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

#### GitHub Pages

1. Update `vite.config.js` with your repo name:
   ```javascript
   export default defineConfig({
     base: '/screen-board/', // Your repo name
     // ...existing config
   })
   ```

2. Build and deploy:
   ```bash
   npm run build
   npx gh-pages -d dist
   ```

### Deployment Checklist

Before deploying to production:

- [ ] All tests passing (`npm run test:run`)
- [ ] Build completes without errors (`npm run build`)
- [ ] Preview build works locally (`npm run preview`)
- [ ] Environment variables configured (if any)
- [x] ✅ Custom domain configured (chiqchic.com)
- [x] ✅ SSL/TLS certificate valid
- [ ] Performance optimized (check bundle size)

### Post-Deployment

After deployment, verify:
- ✅ Application loads correctly
- ✅ All slides display properly
- ✅ Auto-rotation works
- ✅ Keyboard controls function
- ✅ Images and assets load
- ✅ Mobile responsiveness
- ✅ Performance (use Lighthouse)

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
- **Azure Static Web Apps** - Cloud hosting platform
- **Azure CLI** - Deployment automation

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

- [x] ✅ **Phase 1**: Core testing infrastructure - Complete!
- [x] ✅ **Azure Static Web Apps deployment** - Live at https://chiqchic.com
- [x] ✅ **Custom domain with SSL/TLS** - chiqchic.com configured
- [ ] Phase 2: Component testing (ScreenRotator, Header, Footer, Slides)
- [ ] Phase 3: Integration testing
- [ ] Touch screen support for navigation
- [ ] Admin panel for content management
- [ ] Real-time data updates
- [ ] Theme customization
- [ ] Multiple display profiles
- [ ] CI/CD pipeline automation

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
