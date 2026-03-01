const INSTAGRAM_USERNAME = "prepsnotdead";
const IG_APP_ID = "936619743392459";

export interface InstagramPost {
  id: string;
  shortcode: string;
  caption?: string;
  image_url: string;
  permalink: string;
  is_video: boolean;
}

export async function getInstagramPosts(
  limit = 12
): Promise<InstagramPost[]> {
  try {
    const res = await fetch(
      `https://i.instagram.com/api/v1/users/web_profile_info/?username=${INSTAGRAM_USERNAME}`,
      {
        headers: {
          "User-Agent":
            "Instagram 275.0.0.27.98 Android (33/13; 420dpi; 1080x2400; samsung; SM-G991B; o1s; exynos2100)",
          "X-IG-App-ID": IG_APP_ID,
          "Sec-Fetch-Site": "same-origin",
          "Sec-Fetch-Mode": "cors",
          "Sec-Fetch-Dest": "empty",
        },
      }
    );
    if (!res.ok) {
      console.error(`Instagram API returned ${res.status}`);
      return [];
    }

    const data = await res.json();
    const edges =
      data?.data?.user?.edge_owner_to_timeline_media?.edges ?? [];

    return edges
      .slice(0, limit)
      .filter((e: any) => e.node.__typename !== "GraphVideo")
      .map((e: any) => ({
        id: e.node.id,
        shortcode: e.node.shortcode,
        caption:
          e.node.edge_media_to_caption?.edges?.[0]?.node?.text ?? "",
        image_url: e.node.display_url,
        permalink: `https://www.instagram.com/p/${e.node.shortcode}/`,
        is_video: e.node.is_video,
      }));
  } catch (err) {
    console.error("Failed to fetch Instagram posts:", err);
    return [];
  }
}
