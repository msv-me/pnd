export interface InstagramPost {
  shortcode: string;
  image_url: string;
  permalink: string;
  isVideo: boolean;
}

// Static list of Instagram posts in feed order.
// Thumbnails live in public/images/instagram/{shortcode}.jpg
// To refresh: run scripts/fetch-instagram.sh and update this list.
const POSTS: { shortcode: string; isVideo: boolean }[] = [
  { shortcode: "DPejCmykSGL", isVideo: false },
  { shortcode: "DPUB7R5Edyw", isVideo: false },
  { shortcode: "C3lZyXRyNQs", isVideo: false },
  { shortcode: "C3O_B2wOpZd", isVideo: false },
  { shortcode: "C3Lh520PgEN", isVideo: false },
  { shortcode: "C2Io8soy6F2", isVideo: true },
  { shortcode: "CzrTRjXr_pQ", isVideo: true },
  { shortcode: "Cq4Y6OtshmL", isVideo: true },
  { shortcode: "Cq1z9jFMHf-", isVideo: true },
  { shortcode: "CjYI1W5rlzZ", isVideo: false },
  { shortcode: "CiMSIbVjFqQ", isVideo: true },
  { shortcode: "Cg4q-p2rFom", isVideo: false },
  { shortcode: "CgzwwfFvyVC", isVideo: false },
  { shortcode: "CfneNGcrEBx", isVideo: false },
  { shortcode: "CfcX5Nuv_Xj", isVideo: false },
  { shortcode: "CeMqikxrnsv", isVideo: false },
  { shortcode: "Cdg4LimrhbC", isVideo: false },
  { shortcode: "CcwEuA2r-BX", isVideo: false },
  { shortcode: "CcmFC0Wrj4T", isVideo: false },
  { shortcode: "CcgdioHLafR", isVideo: false },
  { shortcode: "CccNOf0MNFW", isVideo: false },
  { shortcode: "CcZgMRzMwOp", isVideo: false },
  { shortcode: "CcWsCYDsA-G", isVideo: false },
  { shortcode: "CcRnODUsAIV", isVideo: false },
  { shortcode: "CbLHdAyrY3m", isVideo: false },
  { shortcode: "CbECShsLYj5", isVideo: false },
  { shortcode: "CYZY0rYrlNn", isVideo: false },
];

export function getInstagramPosts(): InstagramPost[] {
  return POSTS.map((post) => ({
    ...post,
    image_url: `/images/instagram/${post.shortcode}.jpg`,
    permalink: `https://www.instagram.com/p/${post.shortcode}/`,
  }));
}
