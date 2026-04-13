import { defineConfig } from '@prisma/config';

export default defineConfig({
  schema: {
    kind: 'file',
    filePath: 'prisma/schema.prisma',
  },
  datasource: {
    // 這裡我們直接把網址寫死在設定檔裡，繞過所有驗證
    url: "你的Supabase完整網址", 
  },
});