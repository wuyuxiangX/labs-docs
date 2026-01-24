import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { i18n } from '@/lib/i18n';

export function baseOptions(lang: string = 'zh'): BaseLayoutProps {
  const navTitle = {
    zh: 'SecondMe API',
    en: 'SecondMe API',
  };

  return {
    nav: {
      title: navTitle[lang as keyof typeof navTitle] || navTitle.zh,
    },
    i18n: true,
    links: [
      {
        type: 'menu',
        text: lang === 'zh' ? '语言' : 'Language',
        items: i18n.languages.map((l) => ({
          text: l === 'zh' ? '中文' : 'English',
          url: `/${l}/docs`,
          active: l === lang ? 'url' : 'none',
        })) as { text: string; url: string; active: 'url' | 'none' }[],
      },
    ],
  };
}
