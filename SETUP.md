# Getting Level running on your Mac

This walks you from a blank Mac to the app running in an iPhone simulator,
with Claude Code doing the coding. No experience needed. Budget about an hour,
most of it waiting for downloads.

You need: a Mac with about 30 GB free, an Apple ID (for the App Store), a
GitHub account (free, github.com), and a Claude account on the Pro or Max
plan (claude.ai) for Claude Code.

Terminal shows up a lot below. Open it with Spotlight: press cmd + space, type
`Terminal`, press return. Paste each command and press return.

## 1. Install Xcode (this is the iPhone simulator)

1. Open the App Store, search for **Xcode**, click Get. It is large (15 GB or
   more), so start it first and move on to step 2 while it downloads.
2. When it finishes, open Xcode once. Accept the license. When it asks which
   platforms to install, tick **iOS** and continue. If you missed that screen,
   go to Xcode, Settings, Components, and install the iOS platform there.
3. In Terminal, paste these two lines one at a time (it asks for your Mac
   password, which does not show as you type):

```bash
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
sudo xcodebuild -license accept
```

## 2. Install Node.js

1. Go to https://nodejs.org and click the big **LTS** download button.
2. Open the downloaded file and click through the installer.
3. Check it worked. In Terminal:

```bash
node -v
```

It should print a version starting with v22 or higher.

## 3. Install VS Code

1. Go to https://code.visualstudio.com and click Download for Mac.
2. Unzip it and drag **Visual Studio Code** into your Applications folder.
3. Open VS Code. Press cmd + shift + P, type `shell command`, and choose
   **Install 'code' command in PATH**.

## 4. Install Claude Code

1. In Terminal:

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

2. Close Terminal completely (cmd + Q) and open it again.
3. Type `claude` and press return. It opens a browser window to sign in. Sign
   in with your Claude account, then come back to Terminal. Type `/exit` to
   leave for now.
4. In VS Code, open Extensions (cmd + shift + X), search **Claude Code**, and
   click Install. This gives you Claude inside VS Code as well.

## 5. Get the code

1. Open VS Code. On the Welcome screen click **Clone Git Repository**. If you
   do not see the Welcome screen, press cmd + shift + P and type `Git: Clone`.
2. Choose **Clone from GitHub**. A browser window asks you to sign in to
   GitHub and allow VS Code. Allow it.
3. Type `superalex051/level` and pick it from the list.
4. Choose a folder to put it in (Desktop is fine). When VS Code asks
   "Would you like to open the cloned repository?", click **Open**.

If the repository is private and does not show up, ask Alex to add your
GitHub username as a collaborator first.

## 6. Run the app

1. In VS Code, open the menu Terminal, then New Terminal. A terminal opens at
   the bottom of the window, already inside the project.
2. Paste and wait for it to finish (a few minutes the first time):

```bash
npm install
```

3. Then:

```bash
npm run ios
```

The first time, it boots an iPhone simulator and installs Expo Go into it.
Then the app opens. You should see a cream screen with the Level wordmark
asking for your name.

Leave this terminal running while you use the app. To stop it, click in the
terminal and press ctrl + C. To start again, run `npm run ios` again.

## 7. Let Claude Code do the coding

1. In VS Code, open a second terminal (the + button on the right of the
   terminal panel) and type:

```bash
claude
```

2. Paste this as your first message:

> Read AGENTS.md and docs/brand-kit.md. Then walk me through what this app is
> and how the code is organized, in plain language.

3. From then on, say what you want in ordinary words. Some examples:

> Change the accent color to a deep green and show me the result in the simulator.

> Add a "saved" tab that shows the posts I bookmarked.

> Something looks wrong on the profile screen. Here is what I see: ...

Claude Code asks before it runs commands or edits files. Read what it wants to
do and press return to allow it. It runs the typecheck and the app itself, so
you can ask it to prove a change works.

`AGENTS.md` is the rulebook Claude reads on every start. It says what the app
is, what must never change (no numbers shown to viewers), and how the brand
works. If you want to change a rule, change it there and tell Claude.

## If something breaks

- **"xcrun: error" or "unable to find simulator"**: step 1 is not finished.
  Open Xcode, let it finish installing components, and run the two `sudo`
  lines again.
- **"command not found: node"**: step 2. Reinstall Node and reopen Terminal.
- **"command not found: claude"**: step 4. Reopen Terminal after installing.
- **The simulator opens but the app shows a red error screen**: click in the
  terminal that is running `npm run ios` and press `r` to reload. If it stays
  red, stop it with ctrl + C and run `npm run ios` again.
- **"Unmatched Route"**: same fix, press `r` or restart `npm run ios`.
- **A blue gear button covers part of the screen in the simulator**: that is
  Expo Go's developer button. Hold it down to hide it.
- **Anything else**: ask Claude Code. Paste the exact error text and say
  "this happened when I ran npm run ios". It usually fixes it.

## Useful commands

```bash
npm run ios          # start the app in the simulator
npx tsc --noEmit     # check the code for type errors
npx expo lint        # check the code for style problems
```
