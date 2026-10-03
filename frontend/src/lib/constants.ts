export interface PlatformConfig {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  badgeColor: string;
  placeholderUrl: string;
  tagline: string;
  metaTitle: string;
  metaDescription: string;
  supportedFormats: string[];
  active: boolean;
}

export const SUPPORTED_PLATFORMS: Record<string, PlatformConfig> = {
  youtube: {
    id: 'youtube',
    name: 'YouTube',
    slug: 'youtube',
    iconName: 'Youtube',
    badgeColor: 'text-red-500 bg-red-500/10 border-red-500/20',
    placeholderUrl: 'https://www.youtube.com/watch?v=...',
    tagline: 'Download YouTube Videos in 1080p, 720p HD & MP3 Audio',
    metaTitle: 'Fast YouTube Video & Audio Downloader - 1080p HD & MP3 Free',
    metaDescription: 'Download YouTube videos in crisp 1080p, 720p MP4 or high-fidelity MP3 audio with zero buffering and lightning fast speed. No software installation required.',
    supportedFormats: ['MP4 1080p', 'MP4 720p', 'MP4 480p', 'MP3 160k'],
    active: true,
  },
  pinterest: {
    id: 'pinterest',
    name: 'Pinterest',
    slug: 'pinterest',
    iconName: 'Pin',
    badgeColor: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
    placeholderUrl: 'https://pinterest.com/pin/... or https://pin.it/...',
    tagline: 'Save Pinterest Videos & High-Res Pins in Full Original Quality',
    metaTitle: 'Pinterest Video Downloader - Save Pins & High-Res Images Online',
    metaDescription: 'Extract and download original Pinterest videos (MP4) and full-resolution images (JPG) directly with zero server delay. Free, unlimited, and secure.',
    supportedFormats: ['JPG Full-Res', 'MP4 1080p/720p'],
    active: true,
  },
  tiktok: {
    id: 'tiktok',
    name: 'TikTok',
    slug: 'tiktok',
    iconName: 'Video',
    badgeColor: 'text-cyan-400 bg-cyan-400/10 border-cyan-400/20',
    placeholderUrl: 'https://www.tiktok.com/@user/video/...',
    tagline: 'Download TikTok Videos Without Watermark in HD',
    metaTitle: 'TikTok Video Downloader - HD Without Watermark (Coming Soon)',
    metaDescription: 'Fast, free TikTok video downloader to save watermark-free MP4 videos in seconds.',
    supportedFormats: ['Coming soon'],
    active: false,
  },
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    slug: 'instagram',
    iconName: 'Instagram',
    badgeColor: 'text-pink-500 bg-pink-500/10 border-pink-500/20',
    placeholderUrl: 'https://www.instagram.com/reel/...',
    tagline: 'Download Instagram Reels, Stories & Carousel Posts in HD',
    metaTitle: 'Instagram Reels & Video Downloader (Coming Soon)',
    metaDescription: 'Save Instagram reels, IGTV, and carousel photos in crisp high-definition resolution.',
    supportedFormats: ['Coming soon'],
    active: false,
  },
};

export interface FaqItem {
  question: string;
  answer: string;
}

export const GLOBAL_FAQS: FaqItem[] = [
  {
    question: 'Is it legal to download videos with MediaFlow?',
    answer:
      'Only download content you own, have clear permission to use, or that YouTube itself provides a download option for. MediaFlow does not bypass protections or save restricted content. Users are responsible for ensuring personal fair use compliance.',
  },
  {
    question: 'What are the rate limits on MediaFlow?',
    answer:
      'MediaFlow enforces a fair use rate limit of 30 requests per minute per IP address. This bounds concurrency and protects upstream CDN endpoints from abuse, ensuring sub-two-second latency for all users.',
  },
  {
    question: 'Which formats and resolutions are supported?',
    answer:
      'YouTube supports MP4 video (1080p, 720p, 480p) and MP3 audio (160kbps extraction). Pinterest supports direct full-resolution JPG image downloads and MP4 video streams. Higher quality appears only when offered by the source.',
  },
  {
    question: 'Does MediaFlow store or log my media files?',
    answer:
      'Zero files are stored on our servers. MediaFlow is a stateless resolver: incoming video streams pass directly from the source content delivery network to your browser. URL resolution metadata is cached in Redis for up to 3 hours to prevent redundant queries.',
  },
  {
    question: 'How do I access the MediaFlow API?',
    answer:
      'Developers can query our JSON resolver directly via POST /api/resolve with a target URL. Standard rate limits apply. See our API Documentation and status dashboard for response schemas and integration examples.',
  },
];

export const SNAPYT_FAQS: FaqItem[] = [
  {
    question: 'Is it legal to download YouTube videos?',
    answer:
      'Only download content you own, have clear permission to use, or that YouTube itself provides a download button for. Do not bypass protections or save restricted content. This is not legal advice — please check local laws and YouTube’s Terms of Service.',
  },
  {
    question: 'Can I search for videos instead of pasting a link?',
    answer:
      'Yes. You can paste any direct URL or query by video title to discover publicly available videos and resolve direct streaming formats.',
  },
  {
    question: 'Can I download an entire playlist at once?',
    answer:
      'Playlists aren’t bulk-downloaded in a single batch to avoid network strain. To download videos from a playlist, open each video and copy its link to resolve individually.',
  },
  {
    question: 'Do you store downloaded videos or keep user logs?',
    answer:
      'No. Media is processed transiently on demand through direct memory pass-through pipes. We never preload, index, or permanently store third-party media files on our servers.',
  },
  {
    question: 'Does MediaFlow work on mobile devices?',
    answer:
      'Yes. It runs directly inside modern mobile browsers on iPhone (iOS Safari), iPad, Android (Chrome/Firefox), Windows, and macOS with zero app installs.',
  },
  {
    question: 'Why don’t I see an audio-only option for some videos?',
    answer:
      'Audio-only (MP3/M4A) appears when the source platform exposes an accessible separate audio track. If the provider restricts audio streams, only combined video options are shown.',
  },
  {
    question: 'Why does my link fail or show an error?',
    answer:
      'Common reasons include video privacy settings (private or unlisted with restrictions), geo-blocking, age gates, copyright removals, or DRM protections. Ensure the link opens in an incognito tab.',
  },
  {
    question: 'Can I download YouTube Shorts?',
    answer:
      'Yes. When public and permitted, Shorts links (youtube.com/shorts/...) resolve to standard Full HD 1080p MP4 format without watermarks.',
  },
  {
    question: 'Can I download in 4K or 1080p 60fps?',
    answer:
      'Higher resolutions appear whenever the original source upload provides them and your regional CDN exposes the stream. MediaFlow mirrors exact source quality without artificial upscaling.',
  },
  {
    question: 'Can I automate bulk downloads or use a scraper?',
    answer:
      'No. MediaFlow processes a single item at a time. Automated bulk downloading, scraping, or crawling is prohibited under our fair use policy.',
  },
  {
    question: 'How do I submit a DMCA or copyright takedown notice?',
    answer:
      'Use our contact page or email legal@mediaflow.app. Include the infringing URLs, proof of copyright ownership, and a declaration under penalty of perjury.',
  },
  {
    question: 'Does MediaFlow add watermarks or change file quality?',
    answer:
      'No. MediaFlow mirrors what the source provides bit-for-bit. We never inject watermarks, overlays, or re-compression artifacts.',
  },
  {
    question: 'Can I download private, paywalled, or member-only videos?',
    answer:
      'No. We do not support private, paywalled, rental/subscription, or DRM-encrypted streams. MediaFlow only processes publicly accessible media.',
  },
  {
    question: 'Is MediaFlow affiliated with YouTube or Google?',
    answer:
      'No. MediaFlow is an independent web utility and is not affiliated, authorized, or endorsed by YouTube or Google LLC. YouTube™ and Google™ are trademarks of their respective owners.',
  },
  {
    question: 'Where do downloaded files get saved on my device?',
    answer:
      'Files save to your browser’s default Downloads folder. On iPhone and iPad, tap the download icon in Safari to locate the file in the Files app → Downloads.',
  },
];

export interface FooterSection {
  title: string;
  links: { label: string; href: string }[];
}

export const FOOTER_COLUMNS: FooterSection[] = [
  {
    title: 'Tools',
    links: [
      { label: 'YouTube Video Downloader', href: '/youtube' },
      { label: 'YouTube Shorts Downloader', href: '/youtube-shorts-downloader' },
      { label: 'YouTube MP3 Downloader', href: '/youtube-mp3-downloader' },
      { label: 'Pinterest Video Downloader', href: '/pinterest' },
    ],
  },
  {
    title: 'Quick Help',
    links: [
      { label: 'How to download YouTube videos', href: '/how-it-works' },
      { label: 'How to download Shorts', href: '/youtube-shorts-downloader#how' },
      { label: 'How to download MP3', href: '/youtube-mp3-downloader#how' },
      { label: 'FAQ', href: '/faq' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Cookie Policy', href: '/legal/cookies' },
      { label: 'DMCA Takedown', href: '/contact#dmca' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About MediaFlow', href: '/about' },
      { label: 'Contact Support', href: '/contact' },
      { label: 'API Status', href: '/api-status' },
      { label: 'Sitemap', href: '/sitemap.xml' },
    ],
  },
];

export const AFFILIATE_OFFERS = [
  {
    id: 'nord-vpn',
    name: 'NordVPN Premium Shield',
    headline: 'Protect Your IP & Stream Anonymously',
    description: 'Keep your downloads private, bypass regional streaming throttles, and safeguard your data with military-grade encryption.',
    ctaText: 'Get 74% Off + 3 Extra Months',
    affiliateUrl: 'https://nordvpn.com',
    badge: 'Recommended for Streamers',
    icon: 'ShieldCheck',
  },
  {
    id: 'video-enhancer',
    name: 'Topaz AI Video Enhancer',
    headline: 'Upscale Your Videos to 4K & 8K',
    description: 'Breathe new life into 720p and 1080p clips using state-of-the-art neural upscaling and frame rate interpolation.',
    ctaText: 'Try AI Enhancer Free',
    affiliateUrl: 'https://topazlabs.com',
    badge: 'Creator Essential',
    icon: 'Sparkles',
  },
];
