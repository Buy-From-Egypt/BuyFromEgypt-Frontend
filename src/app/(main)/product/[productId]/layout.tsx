import CompanyCard from "@/components/aside/company-card";
import VerticalNav from "@/components/aside/vertical-nav";
import Header from "@/components/header/header";
import ProductPage from "./page";

interface ProductLayoutProps {
  children: React.ReactNode;
  params: { productId: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function Layout({
  children,
  params: paramsPromise,
}: {
  children: React.ReactNode;
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await paramsPromise;
  return (
    <div>
      <Header />
      <main className="container mt-28 px-4">
        <div className="mt-6 flex items-start justify-between gap-4">
          <aside className="sticky top-28 w-1/5 flex flex-col items-start justify-center gap-4">
            <CompanyCard />
            <VerticalNav />
          </aside>
          <section className="w-full flex-1 ">
            <ProductPage params={{ productId }} />
          </section>
        </div>
      </main>
    </div>
  );
}
