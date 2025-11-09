# ⚡ Quick Start - Church Polling Software

Get up and running in **3 simple steps**!

## Step 1: Install Dependencies ⬇️

Open terminal in the project folder and run:

```bash
npm install
cd client
npm install
cd ..
```

## Step 2: Start the Application 🚀

From the project root directory, run:

```bash
npm run dev
```

**That's it!** The application will open at:
- 🌐 Frontend: http://localhost:5173
- 🔌 Backend: http://localhost:3001

## Step 3: Create Your First Poll 🎯

1. Open http://localhost:5173 in your browser
2. Click **"Create New Poll"**
3. Enter your poll details:
   - Title: "Vote for Best Church Choir 2024"
   - Options: Add your choir names
4. Click **"Create Poll"**
5. Share the QR code or poll code!

---

## Example: Church Choir Competition

### Creating the Poll
```
Title: Best Church Choir Competition 2024
Options:
  - Victory Choir
  - Harmony Voices
  - Joyful Noise
  - Praise Warriors
  
Settings:
  ✅ Show Results (for live leaderboard)
  ❌ Multiple Choice
  ❌ Allow Re-voting
```

### During the Event
1. Project results page on screen
2. Share QR code via projection or handouts
3. Watch votes come in LIVE! 🔴
4. See real-time charts and winner updates

---

## Troubleshooting

**Error: Port 3001 already in use**
```bash
# Find and stop the process using the port
netstat -ano | findstr :3001
taskkill /PID <PID_NUMBER> /F
```

**Can't access camera for QR scanning**
- Use the "Enter Code" option instead
- Check browser permissions for camera

**Real-time updates not working**
- Make sure both terminals are running
- Check browser console for errors
- Refresh the page

---

## 🎉 You're Ready!

Your church polling software is now running with:
- ✨ Real-time voting updates
- 📊 Beautiful live analytics
- 📱 QR code integration
- 🎨 Modern, engaging UI
- ⚡ Instant results

**Need more help?** Check `SETUP_GUIDE.md` for detailed instructions!

---

## Quick Commands Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend & backend |
| `npm run server` | Start backend only |
| `npm run client` | Start frontend only |
| `npm install` | Install backend dependencies |
| `cd client && npm install` | Install frontend dependencies |

---

## URLs You'll Need

- **Homepage**: http://localhost:5173
- **Create Poll**: http://localhost:5173/create
- **Join Poll**: http://localhost:5173/join
- **Admin Dashboard**: http://localhost:5173/admin

---

Happy Polling! 🎊
