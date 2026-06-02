import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Users,
  Award,
  Building2,
} from "lucide-react";

const base =
  "group flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors";

const active = "bg-sidebar-accent text-sidebar-foreground";

function Item({
  to,
  icon: Icon,
  label,
  badge,
}: {
  to: string;
  icon: typeof LayoutDashboard;
  label: string;
  badge?: string;
}) {
  return (
    <NavLink
      to={to}
      className={base}
      activeClassName={active}
      pendingClassName="opacity-80"
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span className={cn("truncate", "group-data-[state=collapsed]/sidebar:hidden")}>{label}</span>
      {badge ? (
        <Badge
          variant="secondary"
          className={cn("ml-auto text-[10px] font-mono", "group-data-[state=collapsed]/sidebar:hidden")}
        >
          {badge}
        </Badge>
      ) : null}
    </NavLink>
  );
}

export default function ProtocolSidebarNav() {
  return (
    <div className="flex flex-col gap-1">
      <Item to="/app/overview" icon={LayoutDashboard} label="Overview" />
      <Item to="/app/manuscripts" icon={FileText} label="Manuscripts" />
      <Item to="/app/reviews" icon={MessageSquare} label="Reviews" />
      <Item to="/app/reviewer-network" icon={Users} label="Reviewer Network" />
      <Item to="/app/credentials" icon={Award} label="Credentials" />
      <Item to="/app/institution-console" icon={Building2} label="Institution Console" badge="Admin" />
    </div>
  );
}

