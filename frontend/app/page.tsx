import { redirect } from 'next/navigation';

/**
 * Home Page
 * Redirects to /hotels page as the main entry point
 */
export default function HomePage() {
  redirect('/hotels');
}
