# Name My Baby 👶

A baby name voting app for Anish & Adrienne. Pick your favorite from 5 names at a time, and watch rankings build over time. Both of you can vote from different devices — results sync in real time.

## Quick Start (15 minutes)

### Step 1: Create a Firebase project (free)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"** (or "Add project")
3. Name it something like `name-my-baby`
4. Disable Google Analytics (not needed) → **Create Project**
5. Once created, click the **web icon** `</>` to add a web app
6. Register the app (name it anything, skip hosting) → you'll see a config block like:

```js
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "name-my-baby-xxxxx.firebaseapp.com",
  databaseURL: "https://name-my-baby-xxxxx-default-rtdb.firebaseio.com",
  projectId: "name-my-baby-xxxxx",
  storageBucket: "name-my-baby-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

7. **Copy these values** — you'll need them in Step 3.

### Step 2: Enable Realtime Database

1. In Firebase Console, go to **Build → Realtime Database**
2. Click **"Create Database"**
3. Choose a location (any is fine)
4. Start in **test mode** (you can lock it down later)
5. Click **Enable**

> ⚠️ Test mode allows anyone with the URL to read/write for 30 days. This is fine for a personal app — see "Security" below to lock it down.

### Step 3: Add your Firebase config

Open `src/firebase.js` and replace the placeholder config:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",            // ← paste your real values
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

### Step 4: Deploy to Vercel (free)

**Option A — via GitHub (recommended):**

1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com), sign in with GitHub
3. Click **"New Project"** → import the repo
4. Framework: **Vite** (should auto-detect)
5. Click **Deploy**
6. Done — you'll get a URL like `name-my-baby.vercel.app`

**Option B — via Vercel CLI:**

```bash
npm install -g vercel
cd name-my-baby
npm install
vercel
```

Follow prompts. Your site will be live in ~60 seconds.

### Step 5: Use it!

Open the URL on your phone and Adrienne's phone. When either of you votes, the other sees the rankings update in real time.

---

## Local Development

```bash
cd name-my-baby
npm install
npm run dev
```

Opens at `http://localhost:5173`

---

## Security (optional but recommended)

After 30 days, Firebase test mode expires. To keep the database working, go to **Realtime Database → Rules** and set:

```json
{
  "rules": {
    "namemybaby": {
      ".read": true,
      ".write": true
    }
  }
}
```

This keeps the app open but restricts access to only the `namemybaby` path. Since this is a personal app with no sensitive data, this is perfectly fine.

For tighter security, you could add Firebase Anonymous Auth — but it's overkill for a baby name app between two people.

---

## Project Structure

```
name-my-baby/
├── index.html          # Entry HTML
├── package.json        # Dependencies
├── vite.config.js      # Vite config
├── src/
│   ├── main.jsx        # React entry point
│   ├── App.jsx         # Full app (2000+ names, voting, rankings)
│   └── firebase.js     # Firebase config ← EDIT THIS FILE
└── README.md           # You're reading it
```

## How It Works

- **2,087 unique names** from Indian, Arabic/Persian, African, Korean, and global origins
- ~37% start with "A", ~44% are Indian origin
- Simple vote counting: pick a name → it gets +1 vote
- Rankings sorted by total votes
- Real-time sync via Firebase Realtime Database
- Favorites and "never show again" dismissals are shared between devices
