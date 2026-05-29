import { Bell, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Topbar({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border bg-background/70 px-4 backdrop-blur-xl md:px-8">
      <div>
        <h1 className="font-display text-lg font-semibold">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative hidden md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search insights, habits…"
            className="h-10 w-72 rounded-full border border-border bg-surface pl-9 pr-4 text-sm outline-none transition focus:border-primary focus:shadow-glow"
          />
        </div>
        <button className="grid h-10 w-10 place-items-center rounded-full border border-border bg-surface text-muted-foreground hover:text-foreground">
          <Bell className="h-4 w-4" />
        </button>
        <Avatar className="h-10 w-10 border border-border">
          <AvatarFallback className="bg-primary text-primary-foreground">M</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}