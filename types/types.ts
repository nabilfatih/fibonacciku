import Stripe from "stripe";
import type { Database, Json } from "./types_db";

export type UserRole = "student" | "teacher" | "professional";

export type UserDetails = {
  id: string /* primary key */;
  full_name: string;
  avatar_url?: string;
  billing_address: Stripe.Address | Json;
  payment_method: Stripe.PaymentMethod[Stripe.PaymentMethod.Type] | Json;
  email: string;
  access_token: string;
  usage: number;
  lang?: string;
  geo_location?: GeoLocation;
  ip?: string;
  role?: UserRole;
  block: boolean;
  created_at: string;
};

export type Product = {
  id: string /* primary key */;
  active?: boolean;
  name?: string;
  description?: string;
  image?: string;
  metadata?: Json;
};

export type Price = {
  id: string /* primary key */;
  product_id?: string /* foreign key to products.id */;
  active?: boolean;
  description?: string;
  unit_amount?: number;
  currency?: string;
  type?: Stripe.Price.Type;
  interval?: Stripe.Price.Recurring.Interval;
  interval_count?: number;
  trial_period_days?: number | null;
  metadata?: Json;
  products?: Product;
};

export type Subscription = {
  id: string;
  user_id: string;
  status: Database["public"]["Enums"]["subscription_status"];
  metadata: Json | null;
  price_id: string | null;
  quantity: number | null;
  cancel_at_period_end: boolean | null;
  created: string;
  current_period_start: string;
  current_period_end: string;
  ended_at: string | null;
  cancel_at: string | null;
  canceled_at: string | null;
  trial_start: string | null;
  trial_end: string | null;
  provider: string;
  isActive: boolean; // this is not in the database
  planName: string; // this is not in the database
};

export type Chat = {
  id: string /* primary key */;
  user_id: string /* foreign key */;
  title: string;
  messages: ChatMessage[];
  liked: boolean | null;
  language: string | null;
  grade: string | null;
  type: string;
  file_id: string | null;
  filename: string | null;
  created_at: string;
  updated_at: string;
};

export type LibraryStatus = "processing" | "invalid" | "finished";

export type Libraries = {
  id: string /* primary key */;
  user_id: string /* foreign key */;
  file_id: string;
  name: string;
  file_type: string;
  status: LibraryStatus;
  public_id: string | null;
  created_at: string;
  updated_at: string;
};

export type Books = {
  abstract: string | null;
  authors: string | null;
  collection: string;
  created_at: string;
  file_id: string;
  id: string;
  isbn: string | null;
  public_id: string;
  published_date: string | null;
  publisher: string | null;
  status: string;
  tags: string;
  title: string;
  type: string;
  lang: string;
  updated_at: string;
};

export type ShareChat = {
  id: string;
  user_id: string;
  chat_id: string;
  created_at: string;
};

export type GeoLocation = {
  country_code: string;
  country_name: string;
  city: string;
  postal: number;
  latitude: number;
  longitude: number;
  IPv4: string;
  state: string;
};

export type RoleAgent = "user" | "assistant" | "system" | "function";

export type DataMessage = {
  role: RoleAgent;
  content: string;
};

export type SaveDataMessage = {
  role: RoleAgent;
  content: string;
  metadata?: ChatMessageMetadata[];
};

export type ShowChatMessage = {
  id: string /* primary key */;
  role: RoleAgent;
  content: string[];
  metadata?: ChatMessageMetadata[];
  created_at: string;
};

export type IndexMessage = {
  index: number;
  currentMessage: number;
};

export type ChatMessage = {
  id: string /* primary key */;
  role: RoleAgent;
  content: string[];
  metadata?: ChatMessageMetadata[];
  created_at: string;
};

export type ChatMessageMetadata = {
  source_documents?: SourceDocument[];
  google_search?: SearchResult[];
  youtube_search?: YoutubeSearchResult[];
  academic_search?: AcademicSearchResult[];
  attachments?: Attachment[];
  image_result?: ImageResult[];
};

export type Attachment = {
  type: string;
  file_id: string;
  chat_id: string;
};

export type ImageResult = {
  prompt: string;
  image: string;
};

export type SourceDocument = {
  file_id: string;
  filename: string;
  num_pages: number;
  page_number: number;
};

export type SearchResult = {
  title: string;
  displayLink: string;
  link: string;
  snippet: string;
};

export type YoutubeSearchResult = {
  id: {
    videoId: string;
    channelId: string;
    playlistId: string;
  };
  snippet: {
    thumbnails: {
      high: {
        url: string;
      };
    };
    title: string;
    channelTitle: string;
  };
};

export type AcademicSearchResult = {
  id: string;
  title: string;
  authors: {
    authorId: string;
    name: string;
  }[];
  year: number;
  abstract: string;
  url: string;
};

export type InvoiceCallbackPayload = {
  id: string;
  user_id: string;
  external_id: string;
  is_high: boolean;
  status: string;
  merchant_name: string;
  amount: number;
  payer_email?: string;
  description?: string;
  paid_amount?: number;
  updated: string;
  created: string;
  currency: string;
  paid_at?: string;
  payment_method?: string;
  payment_channel?: string;
  payment_destination?: string;
  payment_details?: {
    receipt_id?: string;
    source?: string;
  };
  payment_id: string;
  success_redirect_url: string;
  failure_redirect_url: string;
  credit_card_charge_id?: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    category?: string;
    url?: string;
  }>;
  fees: Array<{
    type: string;
    value: number;
  }>;
  should_authenticate_credit_card?: boolean;
  bank_code?: string;
  ewallet_type?: string;
  on_demand_link?: string;
  recurring_payment_id?: string;
};

// Define types
export type PlanType = "starter" | "hobby" | "premium";
export type CurrencyType = "usd" | "eur" | "idr";
export type PlanDetailsType = Record<PlanType, string[]>;
export type PriceListType = Array<{
  plan: PlanType;
  redirect: boolean;
  priceId: string;
  price: Record<CurrencyType, number>;
}>;
