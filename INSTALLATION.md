# 💿 Installation Instructions

## Choose Your Installation Method

### Method 1: Automated (Recommended for Windows) ⚡

Double-click the files in this order:

1. **`install.bat`** - Installs all dependencies
2. **`start.bat`** - Starts the application

That's it! The application will be running.

---

### Method 2: Manual Installation 🔧

#### Step 1: Install Backend Dependencies
```bash
npm install
```

#### Step 2: Install Frontend Dependencies
```bash
cd client
npm install
cd ..
```

#### Step 3: Start the Application
```bash
npm run dev
```

---

## What Gets Installed

### Backend Dependencies (`package.json`)
- `express` - Web server framework
- `socket.io` - Real-time WebSocket server
- `cors` - Cross-origin resource sharing
- `uuid` - Unique ID generation
- `qrcode` - QR code generation
- `nodemon` - Auto-restart on changes (dev)
- `concurrently` - Run multiple commands (dev)

### Frontend Dependencies (`client/package.json`)
- `react` & `react-dom` - UI framework
- `react-router-dom` - Routing
- `socket.io-client` - WebSocket client
- `axios` - HTTP requests
- `framer-motion` - Animations
- `recharts` - Charts and graphs
- `lucide-react` - Icons
- `react-qr-code` - QR code display
- `html5-qrcode` - QR code scanner
- `react-confetti` - Celebration effects
- `vite` - Build tool
- `tailwindcss` - CSS framework
- `autoprefixer` & `postcss` - CSS processing

---

## Post-Installation

### Verify Installation

After installation, you should see:
```
✓ Backend dependencies installed
✓ Frontend dependencies installed
✓ Ready to start!
```

### First Run

When you start the application:

1. **Backend starts** on port 3001
   ```
   Server running on port 3001
   ```

2. **Frontend starts** on port 5173
   ```
   VITE v4.x.x ready in xxx ms
   ➜ Local: http://localhost:5173/
   ```

3. **Browser opens** automatically (usually)

---

## Troubleshooting Installation

### Problem: "npm is not recognized"
**Solution**: Install Node.js from https://nodejs.org/

### Problem: "Port 3001 already in use"
**Solution**: 
```bash
# Find process using the port
netstat -ano | findstr :3001

# Kill the process
taskkill /PID <PID_NUMBER> /F
```

### Problem: "Permission denied"
**Solution**: Run terminal as Administrator

### Problem: Installation takes too long
**Solution**: 
- Check internet connection
- Try using npm cache clean: `npm cache clean --force`
- Delete `node_modules` and retry

### Problem: "Module not found" errors
**Solution**:
```bash
# Remove all node_modules
rmdir /s /q node_modules
rmdir /s /q client\node_modules

# Reinstall
npm install
cd client && npm install
```

---

## Uninstallation

To remove the application:

1. Stop all running servers (Ctrl+C)
2. Delete the entire project folder
3. Optional: Clear npm cache
   ```bash
   npm cache clean --force
   ```

---

## Installation Size

- **Backend dependencies**: ~50 MB
- **Frontend dependencies**: ~200 MB
- **Total**: ~250 MB

---

## System Requirements

### Minimum
- **OS**: Windows 10, macOS 10.15, or Linux
- **RAM**: 2 GB
- **Storage**: 500 MB free space
- **Node.js**: Version 16.x or higher

### Recommended
- **OS**: Windows 11, macOS 12+, or Linux
- **RAM**: 4 GB or more
- **Storage**: 1 GB free space
- **Node.js**: Version 18.x or higher
- **Browser**: Chrome, Firefox, Safari, or Edge (latest)

---

## Network Requirements

### Development
- **Ports needed**: 3001 (backend), 5173 (frontend)
- **Internet**: Required for initial installation only

### Production
- **Ports needed**: 3001 or custom
- **Internet**: Required for users to access
- **HTTPS**: Recommended for camera access (QR scanning)

---

## Next Steps After Installation

1. ✅ Installation complete
2. 🚀 Start the application (`npm run dev` or `start.bat`)
3. 🌐 Open http://localhost:5173
4. 📊 Create your first poll
5. 🎉 Share with your congregation!

---

## Quick Reference Commands

| Command | Purpose |
|---------|---------|
| `npm install` | Install backend dependencies |
| `cd client && npm install` | Install frontend dependencies |
| `npm run dev` | Start both servers |
| `npm run server` | Start backend only |
| `npm run client` | Start frontend only |

---

## Getting Help

If you encounter issues:

1. Check the error message carefully
2. Review SETUP_GUIDE.md for detailed help
3. Ensure Node.js is properly installed
4. Verify all dependencies installed successfully
5. Check if ports 3001 and 5173 are available

---

## Ready to Go! 🎊

After successful installation, you're ready to create amazing polls for your church community!

**Next**: Check out QUICKSTART.md for your first poll creation.
