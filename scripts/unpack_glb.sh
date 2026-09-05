#!/usr/bin/env bash
# 处理 public/models 下生成结果：若是 GLB 二进制(.glb.zip 误命名)则改名；若是 zip 则解出 .glb
set -e
cd "$(dirname "$0")/../public/models" 2>/dev/null || { echo no dir; exit 0; }
for z in *.glb.zip; do
  [ -e "$z" ] || break
  id="${z%.glb.zip}"
  if head -c 4 "$z" | grep -q glTF; then
    mv -f "$z" "$id.glb"; echo "rename  -> $id.glb ($(du -h "$id.glb"|cut -f1))"; continue
  fi
  rm -rf "/tmp/unpack_$id"; mkdir -p "/tmp/unpack_$id"
  unzip -o "$z" -d "/tmp/unpack_$id" >/dev/null 2>&1 || true
  g=$(find "/tmp/unpack_$id" -iname "*.glb"|head -1)
  if [ -n "$g" ]; then mv -f "$g" "$id.glb"; echo "unpack  -> $id.glb ($(du -h "$id.glb"|cut -f1))"; else echo "  ! $id no glb"; fi
done
