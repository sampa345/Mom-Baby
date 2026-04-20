export type Product = {
  id: string;
  title: string;
  description: string;
  image_url: string;
  image_url_2?: string;
  affiliate_link: string;
  direct_link: string;
  category: string;
  rating?: number;
  created_at: string;
};

export type Blog = {
  id: string;
  title: string;
  content: string;
  featured_image: string;
  category: string;
  slug: string;
  created_at: string;
};

export type Category = {
  id: string;
  name: string;
  created_at: string;
};
