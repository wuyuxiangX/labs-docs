import { getPageImage, source, getLLMText } from '@/lib/source';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import { notFound } from 'next/navigation';
import { getMDXComponents } from '@/mdx-components';
import type { Metadata } from 'next';
import { createRelativeLink } from 'fumadocs-ui/mdx';
import { LLMCopyButton, PromptCopyButton, ViewOptions } from '@/components/ai/page-actions';
import { SECONDME_NEXTJS_PROMPT } from '@/lib/prompts/secondme-nextjs';
import { VERCEL_DEPLOY_PROMPT } from '@/lib/prompts/vercel-deploy';

interface PageProps {
  params: Promise<{ lang: string; slug?: string[] }>;
}

export default async function Page({ params }: PageProps) {
  const { lang, slug } = await params;
  const page = source.getPage(slug, lang);
  if (!page) notFound();

  const MDX = page.data.body;
  const gitConfig = {
    user: 'mindverse',
    repo: 'labs-docs',
    branch: 'main',
  };

  // Check if this is the index page (快速入门)
  const isIndexPage = !slug || slug.length === 0 || (slug.length === 1 && slug[0] === 'index');

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription className="mb-0">{page.data.description}</DocsDescription>
      <div className="flex flex-row gap-2 items-center border-b pb-6">
        <LLMCopyButton markdownUrl={`/${lang}/llms.mdx/docs/${slug?.join('/') || ''}`} />
        {isIndexPage && (
          <>
            <PromptCopyButton content={SECONDME_NEXTJS_PROMPT} label="Copy Dev Prompt" />
            <PromptCopyButton content={VERCEL_DEPLOY_PROMPT} label="Copy Deploy Prompt" />
          </>
        )}
        <ViewOptions
          markdownUrl={`/${lang}/llms.mdx/docs/${slug?.join('/') || ''}`}
          githubUrl={`https://github.com/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/content/docs/${lang}/${slug?.join('/') || 'index'}.mdx`}
        />
      </div>
      <DocsBody>
        <MDX
          components={getMDXComponents({
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const page = source.getPage(slug, lang);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getPageImage(page).url,
    },
  };
}
