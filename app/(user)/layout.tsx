import { GNB } from "@/components/layout/gnb"
import { MobileMenu } from "@/components/layout/mobile-menu"

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GNB />
      <MobileMenu />
      <main className="mx-auto min-h-screen max-w-2xl px-4 pt-0 lg:pt-16">
        {children}
      </main>
    </>
  )
}
