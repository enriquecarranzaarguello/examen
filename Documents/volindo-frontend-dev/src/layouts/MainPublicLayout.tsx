import type { ReactNode } from 'react';
import { Header, Footer } from '@components';
import { Inter } from '@next/font/google';

const inter = Inter({ subsets: ['latin'] });

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="mainLayout">
      <Header noLogin={true} />
      <main className={`mainLayout__content ${inter.className}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export const getLayout = (page: ReactNode) => <MainLayout>{page}</MainLayout>;

export default MainLayout;
