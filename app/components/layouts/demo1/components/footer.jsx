'use client';

import { Container } from '@/components/common/container';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <Container>
        <div className="flex flex-col md:flex-row justify-center md:justify-between items-center gap-3 py-5">
          <div className="flex order-2 md:order-1  gap-2 font-normal text-sm">
            <span className="text-muted-foreground">{currentYear} &copy;</span>
            <p
              className="text-secondary-foreground hover:text-primary"
            >
              Wiqi Application
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
