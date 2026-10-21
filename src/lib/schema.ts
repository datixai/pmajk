// Field definitions for every editable collection. Shared by the admin forms
// (client) and the server actions that validate what admins submit.

export type FieldType =
  | "text"
  | "textarea"
  | "markdown"
  | "image"
  | "file"
  | "url"
  | "date"
  | "select"
  | "boolean"
  | "youtube";

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: string[];
  help?: string;
  max?: number;
}

export type CollectionKey =
  | "hero"
  | "priorities"
  | "news"
  | "notices"
  | "gallery"
  | "videos"
  | "cabinet"
  | "office"
  | "formerPms"
  | "stats"
  | "timeline"
  | "links"
  | "pages";

export type Group = "Newsroom" | "Home page" | "Government" | "Information";

export interface CollectionDef {
  key: CollectionKey;
  label: string;
  singular: string;
  description: string;
  group: Group;
  prefix: string;
  sort: "order" | "date";
  titleField: string;
  subtitleField?: string;
  imageField?: string;
  fields: Field[];
}

export const PRIORITY_ICONS = ["Scale", "Landmark", "Laptop", "HeartPulse", "GraduationCap", "Briefcase", "Route", "MessageSquareText", "Leaf", "Users"];
export const CABINET_RANKS = ["Prime Minister", "Senior Minister", "Minister", "Adviser", "Special Assistant", "Member"];
export const OFFICE_SECTIONS = [
  "Leadership",
  "Admin Section",
  "Protocol Section",
  "Coordination & Implementation",
  "IT Section",
  "Media Section",
  "Budget Section",
  "Political Wing",
];

export const COLLECTIONS: CollectionDef[] = [
  {
    key: "news",
    label: "Press releases",
    singular: "Press release",
    description: "Statements and news from the Prime Minister's Office. Shown on the home page and the Newsroom.",
    group: "Newsroom",
    prefix: "news",
    sort: "date",
    titleField: "title",
    subtitleField: "date",
    imageField: "image",
    fields: [
      { name: "title", label: "Headline", type: "text", required: true, max: 300 },
      { name: "location", label: "Dateline (place)", type: "text", max: 80, help: "For example: Muzaffarabad (PID)" },
      { name: "date", label: "Date", type: "date", required: true },
      { name: "image", label: "Photo", type: "image" },
      { name: "body", label: "Story", type: "markdown", required: true, help: "Leave a blank line between paragraphs. Start a line with ## for a sub-heading or - for a bullet." },
      { name: "slug", label: "Web address (slug)", type: "text", help: "Leave empty to create it from the headline." },
      { name: "published", label: "Published", type: "boolean", help: "Untick to keep this as a draft." },
      { name: "featured", label: "Lead story on the home page", type: "boolean" },
    ],
  },
  {
    key: "notices",
    label: "Notifications",
    singular: "Notification",
    description: "Official notifications, directives and documents (image or PDF).",
    group: "Newsroom",
    prefix: "notice",
    sort: "date",
    titleField: "title",
    subtitleField: "date",
    imageField: "file",
    fields: [
      { name: "title", label: "Title", type: "text", required: true, max: 200 },
      { name: "date", label: "Date", type: "date", required: true },
      { name: "file", label: "Document (image or PDF)", type: "file", required: true },
      { name: "summary", label: "Short summary", type: "textarea", max: 600 },
    ],
  },
  {
    key: "gallery",
    label: "Photo gallery",
    singular: "Photo",
    description: "Event photos. Albums are created from the album name you type.",
    group: "Newsroom",
    prefix: "photo",
    sort: "date",
    titleField: "title",
    subtitleField: "album",
    imageField: "image",
    fields: [
      { name: "title", label: "Caption", type: "text", required: true, max: 240 },
      { name: "image", label: "Photo", type: "image", required: true },
      { name: "date", label: "Date", type: "date", required: true },
      { name: "album", label: "Album", type: "text", required: true, max: 60, help: "For example: 2026, or the name of an event." },
      { name: "featured", label: "Show on the home page", type: "boolean" },
    ],
  },
  {
    key: "videos",
    label: "Videos",
    singular: "Video",
    description: "Paste any YouTube link. The thumbnail and player are created automatically.",
    group: "Newsroom",
    prefix: "video",
    sort: "order",
    titleField: "title",
    subtitleField: "url",
    fields: [
      { name: "title", label: "Title", type: "text", required: true, max: 160 },
      { name: "url", label: "YouTube link", type: "youtube", required: true, help: "Any YouTube link works: youtu.be, watch?v=, shorts or embed." },
      { name: "description", label: "Short description", type: "textarea", max: 400 },
    ],
  },
  {
    key: "hero",
    label: "Hero backdrops",
    singular: "Backdrop photo",
    description: "Landscape photos that fade slowly behind the Prime Minister's portrait at the top of the home page.",
    group: "Home page",
    prefix: "hero",
    sort: "order",
    titleField: "title",
    imageField: "image",
    fields: [
      { name: "title", label: "Caption (place name)", type: "text", required: true },
      { name: "image", label: "Photo (wide, at least 1920px)", type: "image", required: true },
    ],
  },
  {
    key: "priorities",
    label: "Priorities & initiatives",
    singular: "Priority",
    description: "The government's priorities, shown on the home page.",
    group: "Home page",
    prefix: "pri",
    sort: "order",
    titleField: "title",
    subtitleField: "link",
    fields: [
      { name: "title", label: "Title", type: "text", required: true, max: 80 },
      { name: "text", label: "Description", type: "textarea", required: true, max: 400 },
      { name: "icon", label: "Icon", type: "select", options: PRIORITY_ICONS },
      { name: "link", label: "Link (page or website)", type: "text", help: "For example: /newsroom/... or https://..." },
    ],
  },
  {
    key: "cabinet",
    label: "Cabinet",
    singular: "Cabinet member",
    description: "Members of the AJK Cabinet.",
    group: "Government",
    prefix: "cab",
    sort: "order",
    titleField: "name",
    subtitleField: "portfolio",
    imageField: "image",
    fields: [
      { name: "name", label: "Name", type: "text", required: true, max: 120 },
      { name: "rank", label: "Rank", type: "select", options: CABINET_RANKS, required: true },
      { name: "portfolio", label: "Portfolio", type: "text", max: 200, help: "Leave empty if not yet notified." },
      { name: "image", label: "Portrait", type: "image" },
    ],
  },
  {
    key: "office",
    label: "PM Office staff",
    singular: "Officer",
    description: "The organogram of the Prime Minister's Secretariat, and the political wing.",
    group: "Government",
    prefix: "off",
    sort: "order",
    titleField: "designation",
    subtitleField: "name",
    imageField: "image",
    fields: [
      { name: "designation", label: "Designation", type: "text", required: true, max: 140 },
      { name: "name", label: "Name", type: "text", max: 120, help: "Leave empty while the post is vacant." },
      { name: "section", label: "Section", type: "select", options: OFFICE_SECTIONS, required: true },
      { name: "image", label: "Photo", type: "image" },
      { name: "note", label: "Note", type: "textarea", max: 600 },
    ],
  },
  {
    key: "formerPms",
    label: "Former Prime Ministers",
    singular: "Former Prime Minister",
    description: "Holders of the office since 1975, newest first.",
    group: "Government",
    prefix: "fpm",
    sort: "order",
    titleField: "name",
    subtitleField: "from",
    imageField: "image",
    fields: [
      { name: "name", label: "Name", type: "text", required: true, max: 120 },
      { name: "party", label: "Party", type: "text", max: 80 },
      { name: "from", label: "Took office", type: "text", required: true, max: 40, help: "For example: 20 Apr 2023" },
      { name: "to", label: "Left office", type: "text", max: 40 },
      { name: "image", label: "Portrait", type: "image" },
      { name: "note", label: "Note", type: "text", max: 200 },
    ],
  },
  {
    key: "stats",
    label: "AJK key figures",
    singular: "Figure",
    description: "Numbers shown on the AJK at a Glance page.",
    group: "Information",
    prefix: "stat",
    sort: "order",
    titleField: "label",
    subtitleField: "value",
    fields: [
      { name: "label", label: "Label", type: "text", required: true },
      { name: "value", label: "Value", type: "text", required: true },
      { name: "unit", label: "Unit", type: "text" },
      { name: "note", label: "Note / source", type: "text" },
    ],
  },
  {
    key: "timeline",
    label: "History milestones",
    singular: "Milestone",
    description: "Milestones shown on the AJK at a Glance page.",
    group: "Information",
    prefix: "tl",
    sort: "order",
    titleField: "title",
    subtitleField: "year",
    fields: [
      { name: "year", label: "Year", type: "text", required: true, max: 20 },
      { name: "title", label: "Title", type: "text", required: true },
      { name: "text", label: "Description", type: "textarea", required: true, max: 600 },
    ],
  },
  {
    key: "links",
    label: "Useful links",
    singular: "Link",
    description: "Government websites and services listed in the footer and on the Contact page.",
    group: "Information",
    prefix: "link",
    sort: "order",
    titleField: "title",
    subtitleField: "url",
    fields: [
      { name: "title", label: "Title", type: "text", required: true, max: 80 },
      { name: "url", label: "Web address", type: "url", required: true },
      { name: "description", label: "Short description", type: "text", max: 160 },
    ],
  },
  {
    key: "pages",
    label: "Pages",
    singular: "Page",
    description: "Long-form pages such as The Kashmir Cause and AJK at a Glance.",
    group: "Information",
    prefix: "page",
    sort: "order",
    titleField: "title",
    subtitleField: "slug",
    imageField: "heroImage",
    fields: [
      { name: "title", label: "Title", type: "text", required: true },
      { name: "slug", label: "Web address (slug)", type: "text", required: true },
      { name: "subtitle", label: "Subtitle", type: "text" },
      { name: "heroImage", label: "Header image", type: "image" },
      { name: "body", label: "Content", type: "markdown", required: true },
      { name: "source", label: "Source / credit", type: "text" },
    ],
  },
];

export function getCollection(key: string): CollectionDef | undefined {
  return COLLECTIONS.find((c) => c.key === key);
}

export const SETTINGS_FIELDS: { section: string; fields: Field[] }[] = [
  {
    section: "Identity",
    fields: [
      { name: "siteName", label: "Official name", type: "text", required: true },
      { name: "shortName", label: "Short name", type: "text", required: true },
      { name: "urduName", label: "Name in Urdu", type: "text" },
    ],
  },
  {
    section: "The Prime Minister",
    fields: [
      { name: "pmName", label: "Name", type: "text", required: true },
      { name: "pmHonorific", label: "Title before the name", type: "text", help: "For example: Barrister" },
      { name: "pmOffice", label: "Office", type: "text", required: true },
      { name: "pmOrdinal", label: "Order of office", type: "text", help: "For example: 17th Prime Minister" },
      { name: "pmSince", label: "In office since", type: "text", help: "For example: 28 August 2026" },
      { name: "pmPortrait", label: "Official portrait", type: "image", required: true },
      { name: "pmIntro", label: "Short introduction (home page)", type: "textarea", max: 600 },
      { name: "pmProfile", label: "Full profile", type: "markdown" },
      { name: "mission", label: "Mission", type: "textarea", max: 900 },
      { name: "vision", label: "Vision", type: "textarea", max: 900 },
    ],
  },
  {
    section: "Kashmir cause band",
    fields: [
      { name: "causeTitle", label: "Title", type: "text" },
      { name: "causeText", label: "Text", type: "textarea" },
      { name: "causeQuote", label: "Quote", type: "textarea" },
      { name: "causeQuoteSource", label: "Quote source", type: "text" },
      { name: "glanceIntro", label: "AJK at a Glance introduction", type: "textarea", max: 1500 },
    ],
  },
  {
    section: "Contact & links",
    fields: [
      { name: "contactAddress", label: "Address", type: "text" },
      { name: "contactPhone", label: "Phone", type: "text" },
      { name: "contactEmail", label: "Email", type: "text" },
      { name: "officeHours", label: "Office hours", type: "text" },
      { name: "complaintPortalUrl", label: "PM Complaint Portal link", type: "url" },
      { name: "facebook", label: "Facebook page", type: "url" },
      { name: "twitter", label: "X (Twitter) profile", type: "url" },
      { name: "youtube", label: "YouTube channel", type: "url" },
      { name: "footerNote", label: "Footer note", type: "text" },
    ],
  },
];
