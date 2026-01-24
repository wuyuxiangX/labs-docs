import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

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
  };
}
