# 🪷 Vesak AR Banner - Beginner's Guide

Welcome! This is a simple AR (Augmented Reality) app for Vesak that displays decorations using your phone camera.

## What You'll See 📱

When you open this on your phone:
- A golden banner saying "Happy Vesak"
- Pink lotus flowers
- Red lanterns (lantern decorations)
- All floating in your camera view!

---

## Step 1: Download the Files to Your Computer

1. Create a new folder on your computer (example: `vesak-ar`)
2. Put these 4 files in that folder:
   - `index.html` (the AR app)
   - `package.json` (tells Vercel what to install)
   - `server.js` (runs your app)
   - `vercel.json` (Vercel configuration)

---

## Step 2: Create a GitHub Account & Upload Files

### If you don't have GitHub:
1. Go to **github.com**
2. Click "Sign up"
3. Create an account (use your email)

### Upload your files:
1. On GitHub, click **"+"** (top right) → **"New repository"**
2. Name it: `vesak-ar-banner`
3. Click **"Create repository"**
4. Click **"uploading an existing file"**
5. Drag & drop your 4 files
6. Click **"Commit changes"**

---

## Step 3: Deploy to Vercel (FREE!)

### If you don't have Vercel:
1. Go to **vercel.com**
2. Click **"Sign Up"**
3. Choose **"Continue with GitHub"**
4. Allow Vercel to access your GitHub

### Deploy your app:
1. On Vercel, click **"Add New..."** → **"Project"**
2. Find your `vesak-ar-banner` repository
3. Click **"Import"**
4. Click **"Deploy"** (wait 1-2 minutes)
5. ✅ Done! You'll get a live URL like: `https://vesak-ar-banner.vercel.app`

---

## Step 4: Test on Your Phone

1. Open the Vercel URL on your **mobile phone**
2. Click **"Allow"** when it asks for camera permission
3. Point your phone around
4. You should see the AR Vesak banner! 🎉

---

## How to Customize It

Want to change things? Edit `index.html`:

### Change the banner text:
Look for this line:
```html
value="🪷 Happy Vesak 🪷"
```
Change it to whatever you want!

### Change colors:
```html
color="#FFD700"        <!-- This is gold -->
color="#FF69B4"        <!-- This is pink -->
color="#FF6347"        <!-- This is red -->
```
Use any color code from: **htmlcolorcodes.com**

### Change the size:
```html
scale="2 2 2"          <!-- Make it bigger! Try "3 3 3" -->
```

### Move things around:
```html
position="0 2 -3"      <!-- X, Y, Z position -->
<!-- X = left/right, Y = up/down, Z = closer/further -->
```

---

## Common Issues

### "Camera not working"
- ✅ Use **HTTPS** (Vercel gives you this)
- ✅ Use a **mobile phone** (AR needs real device, not computer)
- ✅ Allow camera **permissions**

### "Nothing appears"
- Check your phone is pointing at a flat surface
- Try moving around slowly
- Make sure browser has camera access

### "How do I update my app?"
1. Edit `index.html` on your computer
2. Upload the updated file to GitHub
3. Vercel automatically redeploys (wait 1 min)
4. Refresh your phone page

---

## Next Steps (When you're ready)

### Add more decorations:
Replace shapes with 3D models in `index.html`

### Add video:
Use a Node.js library like `ffmpeg` in `server.js`

### Add user interactions:
Add buttons and click events in `index.html`

### Learn more:
- **A-Frame tutorial**: aframe.io
- **AR.js documentation**: ar-js.org

---

## Quick Reference

| What you want | How to do it |
|---|---|
| Change text | Find `<a-text value="...">` |
| Change color | Change the `color="#XXXXX"` |
| Change size | Change the `scale="X X X"` |
| Move object | Change the `position="X Y Z"` |
| Add new decoration | Copy a `<a-box>` or `<a-sphere>` block |

---

## Need Help?

- **GitHub issues**: Create an issue on your repository
- **A-Frame Discord**: ar-js.org (community chat)
- **Vercel Support**: vercel.com/support

---

Happy Vesak! 🪷✨
