# Git + Email + Repo Access — Pura Setup (Shuru Se)

Is guide mein teen cheezein cover hain:
1. **Git mein apna naam aur email kaise set karein** (commits ke liye)
2. **GitHub / repo access** — push-pull ke liye authentication
3. **Repo ko kaise use karein** (clone, push, pull)

---

## Part 1: Git Install Karna

1. **Download:** https://git-scm.com/download/win  
2. Install karein. Default options theek hain.  
3. **"Git from the command line and also from 3rd-party software"** wala option **selected** rakhein.  
4. Install ke baad **Command Prompt** ya **PowerShell** naya khol kar check karein:

```bash
git --version
```

Agar version number dikhe (jaise `git version 2.43.0`) to Git install ho chuka hai.

---

## Part 2: Git Mein Naam Aur Email Set Karna (Zaroori)

Har commit par Git ye batata hai ki "kisne commit kiya" — iske liye **name** aur **email** set karna zaroori hai.

### 2.1 Kaun sa email use karein?

- **GitHub par jo email use karte ho** (login wala) — wahi use karna best hai, taaki commits GitHub profile se link ho jayein.  
- Ya koi bhi **real email** jahan aap reach ho sakte ho (e.g. `dev-bhanuyadav@gmail.com`).

### 2.2 Commands (ek baar chala lena)

**Command Prompt** ya **PowerShell** kholo. Ye dono commands chalao — apna naam aur email daalna:

```bash
git config --global user.name "Bhanu Yadav"
git config --global user.email "developerbhanuyadav@gmail.com"
```

- `user.name` — jo naam commits par dikhega (jaise "Bhanu Yadav").  
- `user.email` — wohi email daalo jo GitHub account se linked hai ya jahan aap reach ho sakte ho.

### 2.3 Check karna ki set ho gaya ya nahi

```bash
git config --global user.name
git config --global user.email
```

Dono commands apna naam aur email dikhayenge to setup sahi hai.

---

## Part 3: GitHub Par Repo Access — Push/Pull Ke Liye

GitHub ab **password se push** nahi leta. Do tareeke hain:

- **Option A: Personal Access Token (PAT)** — simple, HTTPS use karta hai  
- **Option B: SSH Key** — thoda setup, phir password ya token har baar nahi maangta  

Neeche dono short steps mein.

---

## Option A: Personal Access Token (PAT) Se Repo Access

### Step 1 — Token Banana

1. **https://github.com** par login karo.  
2. Right top corner par **profile photo** → **Settings**.  
3. Left side se **Developer settings** (sabse neeche).  
4. **Personal access tokens** → **Tokens (classic)**.  
5. **Generate new token** → **Generate new token (classic)**.  
6. **Note:** `websevix-push` (ya kuch bhi naam).  
7. **Expiration:** 90 days (ya No expiration agar chaho).  
8. **Scopes:** **repo** pe tick lagao (full control of private repos).  
9. **Generate token** dabao.  
10. Jo **token** dikhe (`ghp_xxxxxxxx…`) — use **ek hi baar copy** karke safe jagah save karo. Dobara poora token nahi dikhega.

### Step 2 — Push Karte Waqt Use Karna

Jab bhi `git push` chalao aur **Username** puche to:

- **Username:** `dev-bhanuyadav`  
- **Password:** yahan **token paste karo** (account ka password nahi).

Agar Git credentials save karwana ho (taaki har baar na puche):

**Windows:**

1. **Control Panel** → **Credential Manager** → **Windows Credentials**.  
2. **git:https://github.com** dhoondo — agar hai to edit karke **Password** field mein naya token daal do.  
3. Nahi hai to **Add a generic credential** se add karo:  
   - Internet or network address: `git:https://github.com`  
   - User name: `dev-bhanuyadav`  
   - Password: **apna PAT (token)**  

Iske baad `git push` / `git pull` par dubara username-password nahi puchega (jab tak token valid hai).

---

## Option B: SSH Key Se Repo Access (Optional)

SSH se har baar token dene ki zaroorat nahi padti.

### Step 1 — SSH Key Banana

PowerShell ya Git Bash kholo, ye command chalao (apna email daalo):

```bash
ssh-keygen -t ed25519 -C "dev-bhanuyadav@gmail.com" -f "%USERPROFILE%\.ssh\id_ed25519" -N ""
```

- `-N ""` matlab passphrase nahi (empty). Agar passphrase chaho to `-N ""` hata do, phir wo prompt karega.

### Step 2 — Public Key Copy Karna

```bash
type %USERPROFILE%\.ssh\id_ed25519.pub
```

Purri line copy karo (ssh-ed25519 AAAA... wali).

### Step 3 — GitHub Par Key Add Karna

1. GitHub → **Settings** → **SSH and GPG keys**.  
2. **New SSH key**.  
3. **Title:** `Websevix PC` (ya kuch bhi).  
4. **Key:** jo line copy ki thi wahan paste karo.  
5. **Add SSH key**.

### Step 4 — Repo Ko SSH Se Link Karna

Agar pehle HTTPS use kar rahe the to remote URL change karo:

```bash
cd "c:\Users\Administrator\Downloads\My Projects\Websevix"
git remote set-url origin git@github.com:dev-bhanuyadav/websevix.git
```

Phir `git push` / `git pull` — password/token nahi puchega, SSH key use hogi.

---

## Part 4: Repo Kaise Use Karein (Daily Use)

### Pehli Baar — Project Ko Git Repo Bana Kar GitHub Par Bhejna

```bash
cd "c:\Users\Administrator\Downloads\My Projects\Websevix"
git init
git add .
git commit -m "Initial commit: Websevix landing"
git branch -M main
git remote add origin https://github.com/dev-bhanuyadav/websevix.git
git push -u origin main
```

Push par agar **Username/Password** puche to:
- Username: `dev-bhanuyadav`  
- Password: **PAT (token)** — normal password nahi.

### Baad Mein — Jab Code Change Karo

```bash
cd "c:\Users\Administrator\Downloads\My Projects\Websevix"
git add .
git commit -m "Kya change kiya short mein likho"
git push
```

### Agar Repo Pehle Se Bhari Ho (README etc.) — Pehle Pull

```bash
git remote add origin https://github.com/dev-bhanuyadav/websevix.git
git pull origin main --allow-unrelated-histories
```

Agar conflict aaye to file khol ke resolve karo, phir:

```bash
git add .
git commit -m "Merge remote repo"
git push -u origin main
```

---

## Part 5: "Tu Repo Kaise Access Karega" — Samajh

- **Git/GitHub** aapke machine aur GitHub.com ke beech chalता hai.  
- **Mere paas (AI/agent)** aapke PC ka Git, aapka GitHub login, ya aapke tokens ka access **nahi** hota.  
- Isliye **repo access** ka matlab ye hai: **aap apne PC par** Git config + PAT/SSH set karke **khud** push/pull kar sakte ho.

**Jo main kar sakta hoon:**  
- Code likhna, files banana/change karna, scripts aur guides dena (jaise ye file).  
- `git` commands yahan tabhi run ho sakte hain jab aapke system par Git installed ho aur terminal se run karo.

**Jo aapko karna hoga:**  
1. Git install.  
2. `user.name` / `user.email` set.  
3. GitHub par PAT banao (ya SSH key add karo).  
4. Project folder mein `git init`, `add`, `commit`, `remote add`, `push` — ya `push-to-github.bat` chalao (usme bhi push par aapko token dena padega).

---

## Quick Reference

| Kaam              | Command / Step |
|-------------------|----------------|
| Git identity      | `git config --global user.name "Naam"` + `user.email "email@example.com"` |
| Repo access       | GitHub → PAT (token) banao, push/pull par password ki jagah token do |
| Credential save   | Windows Credential Manager → `git:https://github.com` → token daalo |
| Pehli baar push  | `git init` → `add` → `commit` → `remote add origin` → `push -u origin main` |
| Baad mein push    | `git add .` → `git commit -m "message"` → `git push` |

Agar koi step atak jaye to batao — us step ka number likh dena, phir usi hisse ka short version de sakta hoon.
