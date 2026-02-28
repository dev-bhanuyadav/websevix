# Email Setup Guide — Shuru Se (Step by Step)

Is guide mein hum Websevix project ke liye email kaise set karenge — jaise contact form se email bhejna, ya "Get Started" pe click par email aana. **Bilkul zero se.**

---

## Part 1: Email Service Choose Karna

Website se email bhejne ke liye ek **Email Service Provider** chahiye. Ye free/paid services aapki app se mail server tak message bhejte hain.

### Option A — Resend (Recommended, easy)
- **Website:** https://resend.com  
- **Free tier:** 100 emails/day  
- Next.js ke saath bahut easy  
- Sign up: email se account banao

### Option B — SendGrid
- **Website:** https://sendgrid.com  
- **Free tier:** 100 emails/day  
- Thoda zyada settings, lekin reliable  

### Option C — Gmail (sirf testing ke liye)
- Apna Gmail use kar sakte ho  
- Production ke liye recommend nahi (limit kam, security risk)  

**Aage hum Resend use karenge** kyunki setup sabse simple hai.

---

## Part 2: Resend Account Banaana

1. Browser mein jao: **https://resend.com**
2. **Sign Up** par click karo.
3. Apna **email** daalo (jaise: dev-bhanuyadav@gmail.com).
4. **Password** banao (strong, 8+ characters).
5. Verify email — inbox mein jo link aaye us par click karo.
6. Login karo Resend dashboard par.

---

## Part 3: API Key Lena (Resend)

1. Resend dashboard mein **Login** karo.
2. Left side menu mein **API Keys** par click karo.
3. **Create API Key** button dabao.
4. **Name** do: `Websevix Production` (ya kuch bhi).
5. **Permission:** "Sending access" select karo.
6. **Create** par click karo.
7. Jo **key** dikhe (`re_xxxxxxxx…`) — use **ek baar copy** karke safe jagah save karo.  
   - Dobara poora key nahi dikhegi, isliye abhi copy kar lena zaroori hai.

Ye key aapki app ko Resend se connect karegi. **Is key ko kisi ko share mat karo aur GitHub par kabhi commit mat karo.**

---

## Part 4: Project Mein Key Ko Safe Jagah Rakhna (.env)

1. Apne project folder mein jao:  
   `c:\Users\Administrator\Downloads\My Projects\Websevix`
2. Wahan ek **nayi file** banao naam: **`.env.local`**  
   - Notepad ya VS Code se banao.  
   - Filename bilkul yehi honi chahiye: `.env.local` (dot se start, koi .txt mat lagana).
3. Us file ke andar ye line likho (apni actual key paste karo):

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
```

4. File **save** karo.  
5. **Important:** `.env.local` already `.gitignore` mein honi chahiye taaki ye GitHub par kabhi upload na ho. (Next.js projects mein usually ye pehle se ignore hoti hai.)

---

## Part 5: Resend Package Install Karna

Project folder mein **Terminal / PowerShell** kholo aur ye command chalao:

```bash
npm install resend
```

Isse `resend` package aapke project mein add ho jayegi.

---

## Part 6: Resend Mein "From" Email Verify Karna

Resend se mail tabhi bhej sakte ho jab **sender email** verify ho.

1. Resend dashboard → **Domains** (ya **Audience** → **Contacts** side mein).
2. **Add Domain** ya **Verify single email** option dekho.
   - **Testing ke liye:** "Single email" verify karo — apna Gmail daal sakte ho (jaise dev-bhanuyadav@gmail.com). Resend us par verification mail bhejega, link par click karke verify karo.
   - **Live site ke liye:** Apna domain add karo (e.g. `websevix.com`) aur jo steps Resend bataye (DNS records) woh follow karo.

Abhi testing ke liye **single email verify** karna kaafi hai.

---

## Part 7: Code Mein Email Bhejna (API Route)

Next.js mein hum **API Route** se email bhejenge. Neeche code diya gaya hai — copy-paste karke use karo.

### 7.1 API Route File Banao

Project ke andar ye path pe file banao:  
**`app/api/send-email/route.ts`**

Us file ke andar ye code daalo (apna verify kiya hua email `from` mein daalna):

```ts
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email aur message zaroori hain" },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: "Websevix <onboarding@resend.dev>", // Testing: Resend ka default. Apna verify email daal sakte ho: "Your Name <your@email.com>"
      to: ["dev-bhanuyadav@gmail.com"], // Jahan email aani chahiye (apna email daalo)
      subject: `Websevix Contact: ${name}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
    return NextResponse.json({ success: true, data });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
```

**Note:**  
- `from` testing ke liye `onboarding@resend.dev` use kar sakte ho (Resend allow karta hai). Apna domain/email verify karne ke baad wahan apna email daalna.  
- `to` mein woh email daalo jahan aapko contact form ki emails chahiye.

---

## Part 8: Contact Form (Frontend) — Optional

Agar aap chahte ho ki homepage par ek **Contact form** ho (Name, Email, Message) aur submit par ye API call ho, to ek simple form bana sakte ho.

**Example:** Ek naya section `components/sections/ContactForm.tsx` banao aur form submit par `POST /api/send-email` par request bhejo (fetch ya axios se). Form fields: name, email, message.

Agar aap bolo to main aapke project ke andar exact Contact form component + page bana ke de sakta hoon.

---

## Part 9: Test Karna

1. Local pe run karo: `npm run dev`
2. Postman ya browser extension se **POST** request bhejo:  
   `http://localhost:3000/api/send-email`  
   Body (JSON):  
   `{ "name": "Test", "email": "test@example.com", "message": "Hello" }`
3. Agar sab sahi ho to Resend dashboard → **Emails** mein woh email dikhegi aur aapke `to` wale inbox mein bhi aa sakti hai.

---

## Short Checklist (Ek Nazar Mein)

| Step | Kya karna hai |
|------|----------------|
| 1 | Resend.com par account banao |
| 2 | API Key banao, copy karke save karo |
| 3 | Project mein `.env.local` banao, `RESEND_API_KEY=re_xxx` daalo |
| 4 | `npm install resend` chalao |
| 5 | Resend mein sender email/domain verify karo |
| 6 | `app/api/send-email/route.ts` banao (upar wala code) |
| 7 | Contact form (optional) — submit par is API ko call karo |
| 8 | Local pe POST se test karo |

---

## Agar Error Aaye

- **"Invalid API key"** → Check karo `.env.local` mein key sahi paste hui hai, server restart karo (`npm run dev` dubara).
- **"From email not verified"** → Resend mein jaake sender email verify karo (Single email ya Domain).
- **CORS / 404** → Confirm karo route file path sahi hai: `app/api/send-email/route.ts`.

Agar aap chaho to next step mein main tumhare project mein hi `app/api/send-email/route.ts` aur ek chota Contact form component bana ke de sakta hoon — bolo to kar dun.
