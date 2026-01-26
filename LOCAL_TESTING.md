# Local Testing Guide - Manual Cookie Setup

Since Slack OAuth doesn't work on localhost (requires HTTPS), you can manually copy your session cookie from production to test locally.

## Method 1: Copy Cookie from Production

1. **Login on Production**
   - Go to https://campfire.alimad.co/login
   - Complete the Slack OAuth flow
   - You'll be redirected to /dash

2. **Extract the Session Cookie**
   - Open DevTools (F12)
   - Go to Application tab → Cookies → https://campfire.alimad.co
   - Find the cookie named `__Secure-next-auth.session-token`
   - Copy its **Value** (it's a long JWT token)

3. **Set Cookie on Localhost**
   - Go to http://localhost:3000
   - Open DevTools (F12)
   - Go to Console tab
   - Run this command (replace YOUR_TOKEN_HERE with the copied value):

   ```javascript
   document.cookie = "next-auth.session-token=YOUR_TOKEN_HERE; path=/; max-age=2592000"
   ```

4. **Verify**
   - Navigate to http://localhost:3000/dash
   - You should now be logged in!
