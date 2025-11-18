# Minimalist

A modern, minimalist clothing ecommerce web application built with Next.js, Prisma, and Tailwind CSS. This project supports user authentication, product browsing, cart and checkout, admin management, and more.

---

## Features

- **Product Catalog**: Browse products by category, gender, and search. Supports filtering and sorting.
- **Product Details**: View product images, variants (size, color), reviews, and add to cart.
- **Cart & Checkout**: Manage cart items, checkout with address forms, and pay via Razorpay.
- **User Authentication**: Sign up, sign in, and manage profile.
- **Admin Dashboard**: Manage products, orders, and users.
- **Responsive Design**: Mobile-friendly UI using Tailwind CSS.
- **Secure Payments**: Integrated Razorpay for payment processing.
- **Order Management**: Track orders, view order history, and admin order management.
- **Review System**: Users can leave reviews for products.

---

## Tech Stack

- **Frontend**: Next.js (App Router), React, Tailwind CSS
- **Backend**: Next.js API routes, Prisma ORM
- **Database**: PostgreSQL (or any Prisma-supported DB)
- **Authentication**: NextAuth.js
- **Payments**: Razorpay
- **State Management**: React Context (for cart)
- **UI Components**: Custom + Radix UI primitives

---

## Folder Structure

```
app/
  ├── api/                # API routes (auth, checkout, admin, etc.)
  ├── products/           # Product listing, grid, details
  ├── cart/               # Cart page
  ├── checkout/           # Checkout page
  ├── admin/              # Admin dashboard
  ├── auth/               # Auth pages
  ├── profile/            # User profile
  ├── layout.tsx          # App layout
  ├── globals.css         # Global styles
components/
  ├── header.tsx          # Site header
  ├── footer.tsx          # Site footer
  ├── global-error-boundary.tsx
  ├── theme-provider.tsx
  └── ui/                 # Reusable UI components (button, card, sheet, sidebar, etc.)
lib/
  ├── prisma.ts           # Prisma client
  ├── auth.ts             # NextAuth config
  ├── cart.ts             # Cart context/hooks
public/
  └── assets/             # Images for homepage, categories, featured, etc.
```

---

## Getting Started

### Prerequisites

- Node.js >= 18.x
- PostgreSQL (or other Prisma-supported DB)
- [Razorpay](https://razorpay.com/) account for payments

### Installation

1. **Clone the repo:**

   ```bash
   git clone https://github.com/yourusername/minimalist-clothing-ecommerce.git
   cd minimalist-clothing-ecommerce
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**

   - Copy `.env.example` to `.env.local` and fill in your DB, NextAuth, and Razorpay credentials.

4. **Setup the database:**

   ```bash
   npx prisma migrate dev
   ```

5. **Run the development server:**

   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

---

## Usage

- **Browse Products:** Use the navigation to filter by Men, Women, or All (Unisex included).
- **Product Details:** Select size, color, and quantity. Add to cart.
- **Cart & Checkout:** Review cart, enter shipping/billing info, and pay securely.
- **Authentication:** Sign up or sign in to place orders and leave reviews.
- **Admin:** Access `/admin` for dashboard (requires admin account).

---

## Environment Variables

Create a `.env.local` file with:

```
DATABASE_URL=postgresql://user:password@localhost:5432/minimalist
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
RZP_KEY_ID=your_razorpay_key_id
RZP_KEY_SECRET=your_razorpay_key_secret
```

---

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npx prisma studio` - Open Prisma Studio for DB management

---

## Customization

- **Products & Categories:** Update via admin dashboard or directly in the database.
- **Styling:** Modify `globals.css` and Tailwind config.
- **Payment Gateway:** Razorpay integration in `/app/api/checkout/route.ts`.

---

## Contributing

Pull requests are welcome! For major changes, open an issue first to discuss what you’d like to change.

---

## License

MIT

---

## Credits

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Razorpay](https://razorpay.com/)
- [Radix UI](https://www.radix-ui.com/)
