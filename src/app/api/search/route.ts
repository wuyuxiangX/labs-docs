import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';

export const { GET } = createFromSource(source, {
  localeMap: {
    zh: 'english', // Orama 不支持中文，使用 English tokenizer 处理中文内容
    en: 'english',
  },
});
