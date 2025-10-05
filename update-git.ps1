# Git Auto Update Script
# This script will add, commit, and push changes to GitHub

Write-Host "Starting Git auto-update..." -ForegroundColor Green

# Check if there are any changes
$status = git status --porcelain
if ($status) {
    Write-Host "Changes detected, proceeding with update..." -ForegroundColor Yellow
    
    # Add all changes
    Write-Host "Adding all changes..." -ForegroundColor Cyan
    git add .
    
    # Get current date and time for commit message
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $commitMessage = "Auto-update: $timestamp"
    
    # Commit changes
    Write-Host "Committing changes..." -ForegroundColor Cyan
    git commit -m $commitMessage
    
    # Push to GitHub
    Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
    git push
    
    Write-Host "Git update completed successfully!" -ForegroundColor Green
} else {
    Write-Host "No changes detected. Nothing to update." -ForegroundColor Blue
}

Write-Host "Script finished." -ForegroundColor Green