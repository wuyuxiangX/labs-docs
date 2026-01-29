import { redirect } from 'next/navigation';

export const revalidate = false;

export async function GET() {
  redirect('/zh/llms-full.txt');
}
