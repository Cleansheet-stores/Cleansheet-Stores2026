# Clean Sheet Stores

Premium football jersey ecommerce website for **Clean Sheet Stores**.

## Features

- Shop with category filters, search, and sorting
- Product pages with size selection and image gallery
- Shopping cart (saved in browser)
- Checkout with GPay/UPI QR payment
- Admin panel to add/edit jerseys with photos
- Order management with status updates

## Contact & Payment

- **Phone / WhatsApp:** +91 93630 22434
- **Email:** guhamsd74@gmail.com
- **UPI ID:** guhamsd74@oksbi

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment

Copy `.env` and update if needed:

```
DATABASE_URL="file:./dev.db"
ADMIN_PASSWORD="your-secure-password"
```

Default admin password: `cleansheet2026`

### 3. Set up database

```bash
npx prisma migrate dev --name init
npm run db:seed
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Admin Panel

1. Go to [http://localhost:3000/admin](http://localhost:3000/admin)
2. Login with your admin password
3. Add jerseys with photos, price, description, and stock
4. View orders and verify UPI payments by UTR
5. Update order status: Pending → Paid → Shipped → Delivered

## Adding Jerseys

1. Admin → **Add Jersey**
2. Upload 1–5 photos
3. Enter name, price (₹), category, description
4. Set stock for each size (S–XXL)
5. Toggle **Featured** to show on homepage

## Customer Checkout Flow

1. Customer adds jersey to cart
2. Fills shipping details at checkout
3. Scans your GPay QR and pays exact amount
4. Enters UPI Transaction ID (UTR)
5. Order saved — you verify payment in GPay app
6. Mark order as **Paid** in admin and ship

## Deploy to Vercel (Free)

1. Push code to GitHub
2. Import project at [vercel.com](https://vercel.com)
3. Add environment variables:
   - `DATABASE_URL` — use [Turso](https://turso.tech) for free serverless SQLite
   - `ADMIN_PASSWORD` — your secure password
4. Deploy and share your `.vercel.app` link

> **Note:** For production on Vercel, use Turso or another hosted database. Local SQLite works for development only.

## Project Structure

```
app/           → Pages and API routes
components/    → UI components
lib/           → Database, auth, utilities
prisma/        → Database schema and seed
public/        → Logo, GPay QR, uploaded images
```
