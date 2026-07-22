#!/bin/bash
# Pulse 版本号升级脚本
# 用法: ./scripts/bump-version.sh 0.7.0
# 会自动更新 package.json 和 vite.config.ts 的版本号

set -e

if [ -z "$1" ]; then
  echo "用法: $0 <新版本号>"
  echo "示例: $0 0.7.0"
  exit 1
fi

NEW_VERSION="$1"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

# 验证版本号格式
if ! echo "$NEW_VERSION" | grep -qE '^[0-9]+\.[0-9]+\.[0-9]+$'; then
  echo "❌ 版本号格式错误，需为 x.y.z 格式，如 0.7.0"
  exit 1
fi

echo "🔄 升级版本号: $(git describe --tags 2>/dev/null || echo 'unknown') → $NEW_VERSION"

# 更新 package.json
cd "$PROJECT_DIR"
sed -i "s/\"version\": \".*\"/\"version\": \"$NEW_VERSION\"/" package.json

# 更新 vite.config.ts 中的 __APP_VERSION__
sed -i "s/__APP_VERSION__: JSON.stringify('.*')/__APP_VERSION__: JSON.stringify('$NEW_VERSION')/" vite.config.ts

echo "✅ 版本号已更新为 $NEW_VERSION"
echo ""
echo "下一步:"
echo "  git add -A"
echo "  git commit -m \"v$NEW_VERSION - ...\""
echo "  git tag v$NEW_VERSION"
echo "  npm run build"
