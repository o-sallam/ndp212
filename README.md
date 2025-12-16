# Railway Deployment Guide

When deploying this application to Railway (or any other hosting service), ensure you include the following files and folders.

## Essential Files & Folders

- **`package.json`**: Defines the project and dependencies.
- **`package-lock.json`**: Ensures consistent dependency versions.
- **`server.js`**: The main application server file.
- **`Dockerfile`**: Instructions for building the application image.
- **`.dockerignore`**: Tells Docker what to exclude (like `node_modules`).
- **`views/`**: Contains all the EJS templates (`index.ejs`, `admin.ejs`, etc.).
- **`public/`**: Contains static assets like CSS (`style.css`) and images.
- **`data.json`**: The initial data file. **Note**: On Railway, changes to this file via the admin panel will be lost when the app restarts unless you use a persistent volume (Railway Volumes) and configure the path accordingly. For a simple static deployment, this file resets on redeploy.

## Files to IGNORE (Do NOT Upload)

- **`node_modules/`**: This folder is huge and unnecessary. Railway will install dependencies automatically based on `package.json`.
- **`.git/`**: Your local git history.

## Quick Deployment Steps

1.  Initialize a Git repository: `git init`
2.  Add files: `git add .`
3.  Commit: `git commit -m "Initial commit"`
4.  Push to GitHub.
5.  Connect your GitHub repo to Railway.
