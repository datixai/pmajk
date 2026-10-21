# ajkpm.gok.pk: review of the current site and the proposed redesign

Reviewed on 21 and 22 October 2026. Every public page of the current website of the Prime Minister's Office was read: Home, About PM, AJK Cabinet, Organogram, Political Wing, Blogs (press releases), Notifications ("news"), Image and Video Gallery, AJK at Glance, Contact, News Tickers, Latest Updates, Sample Page and all three posts, plus the site's public media library (316 files).

## 1. Security problems on the current site

| # | Problem found | Evidence | Fixed in the redesign |
| --- | --- | --- | --- |
| 1 | **A spam file has been planted on the server.** A text file in the uploads folder holds a long list of spam keywords for unrelated foreign businesses. This is a common sign that someone has had upload access to the site, and it can be used to poison the domain's search ranking. No hidden spam text was found inside the rendered pages (also checked with the Googlebot user agent, which spammers often target). | `/wp-content/uploads/2023/04/new-2.txt` and `new-2-1.txt` | Not carried over. New code base with no WordPress or plugins. Uploads are checked by real file signature (JPG, PNG, WebP, GIF, PDF only), given random names and stored outside the public folder. Every upload is recorded in the activity log |
| 2 | **An internal spreadsheet is publicly downloadable.** | `/wp-content/uploads/2022/10/EMIS_Latest.xlsx` (21 KB, open to anyone) | Not carried over. Office documents cannot be uploaded to the new site |
| 3 | **The administrator's user name is public.** The WordPress REST API lists site users to anyone, which gives attackers half of the login | `/wp-json/wp/v2/users` | No public user list. Staff sign in with email, a strong password and a two-factor code; 5 wrong attempts lock the account for 15 minutes |
| 4 | WordPress attack surfaces are open: `xmlrpc.php` (used for password guessing), `readme.html` (reveals the software), directory listing of `/wp-content/uploads/`, and AI and "MCP" endpoints of the Elementor plugin listed in the public API | Direct requests to each address | None of these exist. Requests for WordPress paths (`wp-login.php`, `xmlrpc.php`, `wp-admin`, `.env`, `.git`) get a plain 404 so scanners learn nothing |
| 5 | Admin pages of a staging server are linked from the live site | "Sample Page" links to `ajkpm.tm8.co.uk/wp-admin/`, and the site's user profile URL is the same staging domain | Removed. The old "Sample Page" address redirects to the home page |
| 6 | Scripts are loaded from four outside servers (jQuery, Slick, Bootstrap, Font Awesome, two versions of each) | Page source | All code is served from the site itself, and a Content Security Policy with a fresh nonce on every request blocks any injected script |

## 2. Broken links, broken images and unfinished parts

| # | Problem found | Fixed in the redesign |
| --- | --- | --- |
| 7 | **The whole site is set to "noindex, nofollow"**, so Google and other search engines are told not to list the Prime Minister's website at all | Normal indexing, a sitemap at `/sitemap.xml` and a `robots.txt` that only hides the admin panel |
| 8 | The "News" menu item goes to `https://www.kmsnews.org/kms/?`, an outside site that refuses the request (HTTP 403) | "Newsroom" now shows the Office's own press releases. Kashmir Media Service is listed correctly under Useful links |
| 9 | Several menu links are malformed: they end in `; ` (for example `https://ajkpm.gok.pk/about; `) | All links rebuilt |
| 10 | In one version of the menu "PM Complaint Portal" links to `#` (goes nowhere) | The Complaint Portal is linked from the header, home page, contact page and footer |
| 11 | Four cabinet members (Saqib Majeed Raja, Muhammad Riasat Khan, Umair Naeem, Abdul Rehman) and one former Prime Minister entry have empty image tags | Elegant monogram portraits until photos are supplied; staff can upload a photo in the admin panel |
| 12 | One gallery photo points at a different file name from the one in the media library | Gallery rebuilt from the media library; every photo shown has been checked |
| 13 | **Contact page is empty**: no address, no form, no map | Full contact page: address, phone, email, social links, the Complaint Portal, useful links and a secure contact form whose messages arrive in the admin panel |
| 14 | "Image and Video Gallery" has 5 photos and no videos, although the media library holds more than 100 event photos | Gallery of 102 photos in albums by year, with a full-screen viewer. A Videos page where staff paste any YouTube link (the Office's YouTube channel is linked until videos are added) |
| 15 | "AJK at Glance" history text stops in the middle of the story (at 1965) | Finished: the 1974 Interim Constitution and the parliamentary system, plus the history timeline and key figures |
| 16 | "Notifications" page holds one image with no date or description | Notifications section with date, summary, image or PDF, managed from the admin panel |
| 17 | "Latest Updates" and "News Tickers" are two duplicate pages with only a slider of six images | Those six images are in the gallery (album 2026); both old addresses redirect there |
| 18 | Mobile app "coming soon" banner and an empty "News Letter" heading | Removed, as neither exists |
| 19 | Live X (Twitter) and Facebook feeds load third-party tracking scripts and often fail to load | Replaced with "Follow the PM Office" links (no tracking, nothing to break) |
| 20 | Old, low-resolution template images: a "Zakat" stock photo, a finance stock photo, a stock "profile" avatar, blurred banners and 42 by 27 pixel party flag icons | Not used. Full-HD AJK landscapes in the hero and page headers; party names written out in full |
| 21 | Every page has the same title ("The Prime Minister Office", repeated twice), and the footer says "Copyright 2023" and "PM Secreariat" | Each page has its own title and description; footer year updates itself; spelling fixed |
| 22 | Old web addresses will break when the site is replaced | Every old address (`/about`, `/organogram`, `/political`, `/blog`, `/news`, `/image-and-video-gallery`, `/ajk-at-glance`, `/updates`, `/latest-updates` and the three press release addresses) redirects permanently to its new page |

## 3. Corrections to content

| Where | Was | Now | Why |
| --- | --- | --- | --- |
| Press releases | Titles were only datelines, e.g. "Kotli (PID) October 04, 2026" | Real headlines, with the dateline shown separately | Readers and search engines need a headline |
| Press release (Kotli) | Published "23 September 2026" for an event on Sunday 4 October 2026, at an address saying "september-22-2026" | Dated 4 October 2026 (a Sunday, as the story says) | The publish date was before the event |
| Two press releases | Published "24 July 2023" but titled 22 September 2026, at addresses saying "july-2023" | Dated 22 September 2026 | Old posts were overwritten with new stories |
| Whole site | "Gillani" (profile, cabinet, organogram) and "Gilani" (press releases); "Mr." on the profile and "Barrister" in press releases | "Barrister Iftikhar Gillani" everywhere, set once in Site settings | Consistency. **Please confirm the preferred spelling and title**; the main portal ajk.gov.pk uses "Syed Iftikhar Gillani" |
| Organogram / press release | "Secretary to the Prime Minister (BS-20)" and "Principal Secretary Adnan Khurshid" | Kept as written on each page | **Please confirm the correct designation** |
| Organogram | An officer card reads "Title" with no name; Web Master and Press Secretary have no names | "Post vacant" | Placeholder text was showing |
| Organogram | "SO Admin", "PSO", "DG C&I" | Section Officer Admin, Principal Staff Officer, Director General, Coordination & Implementation | Abbreviations written out for the public |
| Former Prime Ministers | Faisal Mumtaz Rathore had no dates | 18 Nov 2025 to 27 Aug 2026 | Inferred from the end of the previous term (17 Nov 2025) and the oath of the present Prime Minister (28 Aug 2026). **Please confirm** |
| Former Prime Ministers | Abdul Hamid Khan shown with an "ind" icon | "Independent" | Taken from the icon; **please confirm** |
| AJK at Glance | "Russia, China and Afghanistan also shares its border" | "shares borders with China and Afghanistan" | The State does not border Russia; grammar |
| AJK at Glance | "Northern Areas (G-B)" | Gilgit-Baltistan | Current official name |
| AJK at Glance | "Holland"; "the Muslims ... started a liberation against India" | the Netherlands; "began a war of liberation" | Wording |
| Mission and Vision | "rapid transaction and disposal of business of government" and similar long phrases | Same meaning in plain English | Readability |
| All pages | Abbreviations written with an ampersand | AJK and JK; "Jammu & Kashmir" in full | House style |
| Contact details | Email `contact@ajkpm.gov.pk` on a site at `ajkpm.gok.pk`; social links to three different X accounts (@PMSAJK, @PMOAJK, @PMOfficeAJK) and two Facebook pages | Kept the email; X set to @PMOfficeAJK (the account the site itself embeds) and Facebook to PrimeMinisterOfficeAJK (the one in the main menu). All editable in Site settings | **Please confirm the official email domain and accounts** |

## 4. What the redesign adds

- A stately, centred design for the Office of the Prime Minister: portrait hero over slowly changing full-HD AJK landscapes, the Prime Minister's mission and vision, the government's priorities (each linked to the press release where it was announced), newsroom, the Kashmir cause band, cabinet, gallery and the Complaint Portal.
- AJK's identity as the base camp of the freedom struggle for Indian Illegally Occupied Jammu & Kashmir, with the UN Security Council resolution, the Kashmir Cause page and the history timeline.
- Former Prime Ministers since 1975 with portraits, terms and parties.
- Full admin panel: add, edit, reorder, upload and delete press releases, notifications (image or PDF), gallery photos and albums, videos, hero photos, priorities, cabinet, office staff, former Prime Ministers, key figures, history, links and pages; site settings; media library; contact messages; users and roles; two-factor login; activity log.
- Fast, mobile-first pages, Urdu name in Nastaliq, small AJK and Pakistan flags in the footer, chinar leaf favicon.

## 5. To confirm with the PM Office before launch

1. Spelling and title of the Prime Minister's name, and the designation of Adnan Khurshid.
2. Portfolios of the cabinet members (the current site lists none) and photos for the four members without one.
3. Dates of Faisal Mumtaz Rathore's term and the party of Abdul Hamid Khan.
4. Official email address and social media accounts.
5. Names for the vacant posts (Web Master, Press Secretary, Press & Publication Officer).
6. Captions for the archive photos (they are dated from their file names; captions say only "Prime Minister's Office" and the date).
7. Delete the planted spam file and the exposed spreadsheet from the current server now, and change all WordPress passwords, whether or not the new site is adopted.
