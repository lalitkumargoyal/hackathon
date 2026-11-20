import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-4 py-6 text-sm text-text-secondary lg:px-10">
        <p>ProductSphere · Considered essentials.</p>
        <nav className="flex items-center gap-3" aria-label="Footer">
          <Link href="/products" className="text-text-primary">Shop</Link>
          <span aria-hidden="true">/</span>
          <Link href="/about" className="text-text-primary">About</Link>
        </nav>
      </div>
    </footer>
  );
}
