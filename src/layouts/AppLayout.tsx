import { Outlet } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import ProtocolSidebarNav from "@/components/ProtocolSidebarNav";
import TopBar from "@/components/TopBar";
import LogoMark from "@/components/LogoMark";

export default function AppLayout() {
  return (
    <SidebarProvider defaultOpen>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarHeader className="px-3 py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 grid place-items-center text-foreground">
              <LogoMark className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-sm font-semibold leading-tight text-sidebar-foreground">JournalsPro</div>
              <div className="text-[11px] text-muted-foreground font-mono leading-tight">Protocol Console</div>
            </div>
          </div>
        </SidebarHeader>
        <Separator />
        <SidebarContent className="px-2 py-2">
          <ProtocolSidebarNav />
        </SidebarContent>
        <SidebarFooter className="px-3 py-3">
          <div className="text-[11px] text-muted-foreground font-mono">
            Light-first • Verifiable protocol • Privacy-preserving reviews
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <TopBar left={<SidebarTrigger />} />
        <main className="min-h-[calc(100svh-56px)] bg-background">
          <div className="container max-w-6xl px-6 py-8">
            <Outlet />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

