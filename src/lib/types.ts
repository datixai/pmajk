export interface BaseItem {
  id: string;
  order?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  siteName: string;
  shortName: string;
  urduName: string;
  pmName: string;
  pmHonorific: string;
  pmOffice: string;
  pmOrdinal: string;
  pmSince: string;
  pmPortrait: string;
  pmIntro: string;
  pmProfile: string;
  mission: string;
  vision: string;
  causeTitle: string;
  causeText: string;
  causeQuote: string;
  causeQuoteSource: string;
  glanceIntro: string;
  contactAddress: string;
  contactPhone: string;
  contactEmail: string;
  officeHours: string;
  complaintPortalUrl: string;
  facebook: string;
  twitter: string;
  youtube: string;
  footerNote: string;
}

export interface HeroItem extends BaseItem { title: string; image: string }
export interface Priority extends BaseItem { title: string; text: string; icon: string; link: string }
export interface NewsItem extends BaseItem {
  slug: string;
  title: string;
  location: string;
  date: string;
  image: string;
  body: string;
  published: boolean;
  featured: boolean;
  /** Addresses this story had on the old website; they redirect here. */
  oldSlugs?: string[];
}
export interface NoticeItem extends BaseItem { title: string; date: string; file: string; summary: string }
export interface GalleryItem extends BaseItem { title: string; date: string; album: string; image: string; featured: boolean }
export interface VideoItem extends BaseItem { title: string; url: string; description: string }
export interface CabinetMember extends BaseItem { name: string; portfolio: string; rank: string; image: string }
export interface OfficeMember extends BaseItem { name: string; designation: string; section: string; image: string; note: string }
export interface FormerPm extends BaseItem { name: string; party: string; from: string; to: string; image: string; note: string }
export interface Stat extends BaseItem { value: string; unit: string; label: string; note: string }
export interface TimelineItem extends BaseItem { year: string; title: string; text: string }
export interface LinkItem extends BaseItem { title: string; url: string; description: string }
export interface PageItem extends BaseItem {
  slug: string;
  title: string;
  subtitle: string;
  heroImage: string;
  body: string;
  source: string;
}
export interface Message extends BaseItem {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  read: boolean;
}
export interface MediaItem extends BaseItem {
  url: string;
  name: string;
  size: number;
  type: string;
  uploadedBy: string;
}
export interface AuditEntry {
  id: string;
  at: string;
  user: string;
  action: string;
  target: string;
}

export interface DB {
  settings: Settings;
  hero: HeroItem[];
  priorities: Priority[];
  news: NewsItem[];
  notices: NoticeItem[];
  gallery: GalleryItem[];
  videos: VideoItem[];
  cabinet: CabinetMember[];
  office: OfficeMember[];
  formerPms: FormerPm[];
  stats: Stat[];
  timeline: TimelineItem[];
  links: LinkItem[];
  pages: PageItem[];
  messages: Message[];
  media: MediaItem[];
  audit: AuditEntry[];
}

export type Role = "admin" | "editor";

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  passwordHash: string;
  createdAt: string;
  /** Bumped on password change or "sign out everywhere"; old sessions stop working. */
  sessionVersion?: number;
  /** Base32 secret for two-factor login; empty when 2FA is off. */
  totpSecret?: string;
  lastLoginAt?: string;
}

export type PublicUser = Omit<User, "passwordHash" | "totpSecret"> & { twoFactor: boolean };
