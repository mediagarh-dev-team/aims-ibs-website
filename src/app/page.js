import MainHome from '@/components/Home/MainHome';
import { getSeoData } from '@/lib/getSeoData';

export async function generateMetadata() {
  return getSeoData('home');
}

async function getHomePageContent() {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL?.startsWith('http')
        ? process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
        : 'http://localhost:3000';

    const res = await fetch(`${baseUrl}/api/pages/home`, {
      next: { revalidate: 60 }, // revalidate every 60 seconds
    });

    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const homeData = await getHomePageContent();
  return <MainHome data={homeData} />;
}
