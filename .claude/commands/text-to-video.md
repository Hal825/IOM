调用 Token Plan 文生视频 API，根据描述生成视频并自动下载到本地。
用户需求：$ARGUMENTS
## 步骤
1. 从用户需求中提取 prompt（视频描述）、model（默认 happyhorse-1.1-t2v）、resolution（默认 720P）、ratio（默认 16:9）、duration（默认 5 秒）。若用户明确指定了模型（如"模型=happyhorse-1.0-t2v"），必须严格使用用户指定的模型名。
2. 使用 Bash 工具执行以下脚本，一次性完成提交任务、等待完成、下载视频：
```bash
#!/bin/bash
set -e
TASK_RESPONSE=$(curl -s -X POST "https://token-plan.cn-beijing.maas.aliyuncs.com/api/v1/services/aigc/video-generation/video-synthesis" \
  -H "X-DashScope-Async: enable" \
  -H "Authorization: Bearer $ANTHROPIC_AUTH_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "<model>",
    "input": {"prompt": "<prompt>"},
    "parameters": {"resolution": "<resolution>", "ratio": "<ratio>", "duration": <duration>}
  }')
TASK_ID=$(echo "$TASK_RESPONSE" | grep -o '"task_id":"[^"]*"' | head -1 | cut -d'"' -f4)
if [ -z "$TASK_ID" ]; then echo "提交失败: $TASK_RESPONSE"; exit 1; fi
echo "任务已提交，ID: $TASK_ID，等待生成..."
while true; do
  sleep 15
  STATUS_RESPONSE=$(curl -s "https://token-plan.cn-beijing.maas.aliyuncs.com/api/v1/tasks/$TASK_ID" \
    -H "Authorization: Bearer $ANTHROPIC_AUTH_TOKEN")
  STATUS=$(echo "$STATUS_RESPONSE" | grep -o '"task_status":"[^"]*"' | cut -d'"' -f4)
  if [ "$STATUS" = "SUCCEEDED" ]; then
    VIDEO_URL=$(echo "$STATUS_RESPONSE" | grep -o '"video_url":"[^"]*"' | cut -d'"' -f4)
    OUTPUT="generated_$(date +%Y%m%d_%H%M%S).mp4"
    curl -s -o "$OUTPUT" "$VIDEO_URL"
    echo "视频已下载: $(pwd)/$OUTPUT"
    exit 0
  elif [ "$STATUS" = "FAILED" ]; then
    echo "生成失败: $STATUS_RESPONSE"; exit 1
  fi
  echo "生成中..."
done
```
3. 向用户展示生成的视频文件路径。