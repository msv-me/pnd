export interface InstagramPost {
  shortcode: string;
  image_url: string;
  permalink: string;
}

// Static list of Instagram post shortcodes.
// Images live in public/images/instagram/{shortcode}.jpg
// To refresh: run scripts/fetch-instagram.sh and update this list.
const POST_SHORTCODES = [
  "DPejCmykSGL",
  "DPUB7R5Edyw",
  "C3lZyXRyNQs",
  "C3O_B2wOpZd",
  "C3Lh520PgEN",
  "CjYI1W5rlzZ",
  "Cg4q-p2rFom",
];

export function getInstagramPosts(): InstagramPost[] {
  return POST_SHORTCODES.map((shortcode) => ({
    shortcode,
    image_url: `/images/instagram/${shortcode}.jpg`,
    permalink: `https://www.instagram.com/p/${shortcode}/`,
  }));
}
