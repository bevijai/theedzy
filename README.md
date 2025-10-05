# TheEDZY - React TypeScript App

A modern React application built with TypeScript, Vite, and Tailwind CSS.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build-and-deploy` - Build and automatically push to Git
- `npm run git-update` - Quick Git add, commit, and push
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔄 Automatic Git Updates

We've set up several ways to automatically update your Git repository:

### Method 1: PowerShell Script (Recommended)
```powershell
.\update-git.ps1
```
This script will:
- Check for changes
- Add all files
- Commit with timestamp
- Push to GitHub
- Show colored status messages

### Method 2: Quick Update Script
```powershell
.\quick-update.ps1
```
Simple 3-command script for fast updates.

### Method 3: NPM Scripts
```bash
npm run git-update          # Quick Git update
npm run build-and-deploy    # Build + Git update
```

### Method 4: Batch File (Windows)
```cmd
update-git.bat
```

## 📁 Project Structure

```
src/
├── components/
│   ├── Navigation.tsx
│   └── Footer.tsx
├── pages/
│   ├── Home.tsx
│   ├── About.tsx
│   ├── Apps.tsx
│   └── Contact.tsx
├── App.tsx
├── main.tsx
└── index.css
```

## 🌐 Deployment

### GoDaddy Hosting
1. Run `npm run build`
2. Upload contents of `dist/` folder to `public_html/`
3. Or use the pre-built `theedzy-website.zip`

### GitHub Pages
The repository is automatically updated, so you can enable GitHub Pages from the repository settings.

## 🛠️ Built With

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Supabase
- Lucide React Icons

## 📝 Auto-Update Usage

After making changes to your code:

1. **Easiest**: Double-click `update-git.ps1`
2. **Command line**: Run `.\update-git.ps1`
3. **NPM**: Run `npm run git-update`
4. **Build + Update**: Run `npm run build-and-deploy`

All methods will automatically add, commit, and push your changes to GitHub!