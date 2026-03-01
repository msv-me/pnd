#!/bin/bash
# Fetches Instagram post images via the embed endpoint (no auth needed)
# Usage: ./scripts/fetch-instagram.sh

SHORTCODES=(
  DPejCmykSGL
  DPUB7R5Edyw
  C3lZyXRyNQs
  C3O_B2wOpZd
  C3Lh520PgEN
  CjYI1W5rlzZ
  Cg4q-p2rFom
)

OUTDIR="$(dirname "$0")/../public/images/instagram"
mkdir -p "$OUTDIR"

UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"

for code in "${SHORTCODES[@]}"; do
  if [ -f "$OUTDIR/${code}.jpg" ]; then
    echo "  Skip $code (already exists)"
    continue
  fi

  echo "Fetching $code..."
  # Get the 1080px image URL from the embed page
  IMG_URL=$(curl -s "https://www.instagram.com/p/${code}/embed/" \
    -H "User-Agent: $UA" \
    | grep -oE 'src="https://scontent[^"]*p1080x1080[^"]*"' \
    | head -1 \
    | sed 's/src="//;s/"$//' \
    | sed 's/&amp;/\&/g')

  if [ -z "$IMG_URL" ]; then
    # Fallback: get any scontent image that's not the profile pic (>150px)
    IMG_URL=$(curl -s "https://www.instagram.com/p/${code}/embed/" \
      -H "User-Agent: $UA" \
      | grep -oE 'src="https://scontent[^"]*"' \
      | grep -v 's150x150' \
      | head -1 \
      | sed 's/src="//;s/"$//' \
      | sed 's/&amp;/\&/g')
  fi

  if [ -n "$IMG_URL" ]; then
    curl -s -o "$OUTDIR/${code}.jpg" "$IMG_URL"
    SIZE=$(wc -c < "$OUTDIR/${code}.jpg" | tr -d ' ')
    echo "  Downloaded ${code}.jpg (${SIZE} bytes)"
  else
    echo "  FAILED: No image found for $code"
  fi

  sleep 1
done

echo ""
echo "Done. Images in $OUTDIR:"
ls -lh "$OUTDIR"/*.jpg 2>/dev/null
