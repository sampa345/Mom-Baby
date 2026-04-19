# Affiliate Marketing App Setup Guide

This guide will help you configure your database and authentication for the Mom & Baby Affiliate Application.

## 1. Supabase Setup

1. Create a free account at [Supabase](https://supabase.com/).
2. Create a new "Project" (e.g., Mom & Baby Affiliate).
3. Once the project is created, navigate to **Project Settings** -> **API**.
4. Copy the **Project URL** and **anon public key**.
5. Create a new file named `.env` in the root of this project (or in your deployment platform, like Netlify's Environment Variables panel).
6. Add the variables:
```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## 2. Database Schema Creation

1. In Supabase Dashboard, navigate to the **SQL Editor** on the left sidebar.
2. Click **New query** and paste the following SQL commands:

```sql
-- Create categories table
CREATE TABLE categories (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create products table
CREATE TABLE products (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL,
  description text,
  image_url text,
  affiliate_link text,
  direct_link text,
  category text REFERENCES categories(name) ON DELETE SET NULL,
  rating numeric DEFAULT 5,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create blogs table
CREATE TABLE blogs (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL,
  content text NOT NULL,
  featured_image text,
  category text REFERENCES categories(name) ON DELETE SET NULL,
  slug text NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

```

3. Click **Run** to execute the query and setup your database tables.

## 3. Enable RLS (Row Level Security) and Policies

To allow the public to read data but restrict writes to authenticated admins:

```sql
-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access to categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access to products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read access to blogs" ON blogs FOR SELECT USING (true);

-- Allow authenticated users (Admin) full access
CREATE POLICY "Allow authenticated full access to categories" ON categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full access to products" ON products FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated full access to blogs" ON blogs FOR ALL USING (auth.role() = 'authenticated');
```

## 4. Admin Account Creation

Since only admins should manage content, you will create a single admin account:
1. In the Supabase Dashboard, navigate to **Authentication** -> **Users**.
2. Click **Add User** -> **Create new user**.
3. Enter your desired admin email and a secure password.
4. Auto-confirm the user if the option is available (or disable email confirmations in **Auth** -> **Providers** -> **Email**).

## 5. Netlify Deployment

1. Push this project's code to a GitHub repository.
2. Sign in to [Netlify](https://www.netlify.com/).
3. Click **Add new site** -> **Import an existing project**.
4. Connect your GitHub and select the repository.
5. Build settings (usually auto-detected):
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Click **Show advanced** -> **New variable** to add your environment variables:
   - `VITE_SUPABASE_URL` = <your-project-url>
   - `VITE_SUPABASE_ANON_KEY` = <your-anon-key>
7. Click **Deploy site**.
8. Go to **Site settings** -> **Domain management** to add a custom domain if desired.
