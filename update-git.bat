@echo off
echo 🚀 Starting Git auto-update...

:: Check if there are changes
git diff --quiet
if %errorlevel% equ 1 (
    echo 📁 Changes detected, proceeding with update...
    
    :: Add all changes
    echo ➕ Adding all changes...
    git add .
    
    :: Commit with timestamp
    echo 💾 Committing changes...
    git commit -m "Auto-update: %date% %time%"
    
    :: Push to GitHub
    echo 🌐 Pushing to GitHub...
    git push
    
    echo ✅ Git update completed successfully!
) else (
    echo ℹ️ No changes detected. Nothing to update.
)

echo 🏁 Script finished.
pause