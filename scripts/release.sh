#!/bin/bash
# Builds, signs with Developer ID, notarizes, and publishes NoScroll as a GitHub release.
# Version comes from extension/manifest.json. Usage: TEAM_ID=ABCDE12345 scripts/release.sh
set -euo pipefail
cd "$(dirname "$0")/.."

: "${TEAM_ID:?Set TEAM_ID to your Apple Developer team ID}"
NOTARY_PROFILE="${NOTARY_PROFILE:-noscroll-notary}"
VERSION=$(node -p "require('./extension/manifest.json').version")
OUT=build/release
ZIP="$OUT/NoScroll-$VERSION.zip"

if [ -n "$(git status --porcelain)" ]; then
  echo "Commit your changes first; the release is tagged at HEAD." >&2
  exit 1
fi

rm -rf "$OUT"
mkdir -p "$OUT"

xcodebuild archive \
  -project NoScroll/NoScroll.xcodeproj -scheme NoScroll -configuration Release \
  -archivePath "$OUT/NoScroll.xcarchive" \
  DEVELOPMENT_TEAM="$TEAM_ID" MARKETING_VERSION="$VERSION" \
  -allowProvisioningUpdates

cat > "$OUT/ExportOptions.plist" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>method</key><string>developer-id</string>
  <key>teamID</key><string>$TEAM_ID</string>
  <key>signingStyle</key><string>automatic</string>
</dict>
</plist>
PLIST

xcodebuild -exportArchive \
  -archivePath "$OUT/NoScroll.xcarchive" -exportPath "$OUT" \
  -exportOptionsPlist "$OUT/ExportOptions.plist" -allowProvisioningUpdates

ditto -c -k --keepParent "$OUT/NoScroll.app" "$ZIP"
xcrun notarytool submit "$ZIP" --keychain-profile "$NOTARY_PROFILE" --wait
xcrun stapler staple "$OUT/NoScroll.app"

# Re-zip so the download carries the stapled ticket and opens offline.
rm "$ZIP"
ditto -c -k --keepParent "$OUT/NoScroll.app" "$ZIP"

git push
gh release create "v$VERSION" "$ZIP" --title "No Scroll $VERSION" --generate-notes
