import { GNB } from "@/components/layout/gnb"
import { MobileMenu } from "@/components/layout/mobile-menu"
import { BottomTabBar } from "@/components/layout/bottom-tab-bar"

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GNB />
      <MobileMenu />
      <main className="mx-auto min-h-screen max-w-2xl px-4 pb-20 pt-[calc(3.5rem+env(safe-area-inset-top))] lg:max-w-5xl lg:px-8 lg:pb-0 lg:pt-16">
        {children}
      </main>
      <BottomTabBar />
    </>
  )
}
