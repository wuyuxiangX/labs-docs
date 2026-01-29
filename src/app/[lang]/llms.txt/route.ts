import { source } from '@/lib/source';
import { i18n } from '@/lib/i18n';
import { notFound } from 'next/navigation';

export const revalidate = false;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ lang: string }> }
) {
  const { lang } = await params;

  if (!i18n.languages.includes(lang)) {
    notFound();
  }

  const lines: string[] = [];
  lines.push(`# Documentation (${lang === 'zh' ? '中文' : 'English'})`);
  lines.push('');

  for (const page of source.getPages(lang)) {
    lines.push(`- [${page.data.title}](${page.url}): ${page.data.description || ''}`);
  }

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}

export function generateStaticParams() {
  return i18n.languages.map((lang) => ({ lang }));
}
