"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Settings,
  BarChart,
  ChevronsUpDown,
  ChevronRight,
} from "lucide-react";

const platformItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: LayoutDashboard,
    sub: [
      { title: "Overview", url: "/admin/dashboard/overview" },
      { title: "Stats", url: "/admin/dashboard/stats" },
      { title: "Reports", url: "/admin/dashboard/reports" }
    ],
  },
   {
    title: "Customer",
    url: "/admin",
    icon: LayoutDashboard,
    sub: [
      {title: "orders", url: "/admin/customers/orders"}
    ],
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: Users,
    sub: [
      { title: "All Users", url: "/admin/users/all" },
      { title: "Roles", url: "/admin/users/roles" },
      { title: "Permissions", url: "/admin/users/permissions" },
    ],
  },
  {
    title: "Analytics",
    url: "/admin/analytics",
    icon: BarChart,
    sub: [
      { title: "Traffic", url: "/admin/analytics/traffic" },
      { title: "Conversions", url: "/admin/analytics/conversions" },
      { title: "Retention", url: "/admin/analytics/retention" },
    ],
  },
  {
    title: "Docs",
    url: "/admin/docs",
    icon: BookOpen,
    sub: [
      { title: "Getting Started", url: "/admin/docs/getting-started" },
      { title: "API Reference", url: "/admin/docs/api-reference" },
      { title: "Changelog", url: "/admin/docs/changelog" },
    ],
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
    sub: [
      { title: "General", url: "/admin/settings/general" },
      { title: "Security", url: "/admin/settings/security" },
      { title: "Billing", url: "/admin/settings/billing" },
    ],
  },
];

const projectItems = [
  { title: "Design Engineering", url: "/admin/projects/design" },
  { title: "Sales & Marketing", url: "/admin/projects/sales" },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      {/* Header — Team switcher */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="h-12">
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-foreground text-background text-xs font-bold">
                  {(process.env.NEXT_PUBLIC_COMPANY_NAME ||
                    "A")[0].toUpperCase()}
                </div>
                <div className="flex flex-col gap-0.5 leading-none text-left">
                  <span className="font-semibold">
                    {process.env.NEXT_PUBLIC_COMPANY_NAME || "My Company"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Enterprise
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        {/* Platform group */}
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarMenu>
            {platformItems.map((item) => (
              <Collapsible
                key={item.title}
                defaultOpen={pathname.startsWith(item.url)}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <div className="flex items-center w-full">
                    {/* Clickable label — navigates to item.url */}
                    <SidebarMenuButton
                      asChild
                      isActive={pathname.startsWith(item.url)}
                      className="flex-1"
                    >
                      <Link href={item.url}>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>

                    {/* Chevron — only toggles the collapsible */}
                    <CollapsibleTrigger asChild>
                      <button className="ml-auto p-1 rounded hover:bg-sidebar-accent transition-colors">
                        <ChevronRight className="size-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                      </button>
                    </CollapsibleTrigger>
                  </div>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.sub.map((sub) => (
                        <SidebarMenuSubItem key={sub.title}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === sub.url}
                          >
                            <Link href={sub.url}>{sub.title}</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Projects group */}
        <SidebarGroup>
          <SidebarGroupLabel>Projects</SidebarGroupLabel>
          <SidebarMenu>
            {projectItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={pathname === item.url}>
                  <Link href={item.url}>
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer — User profile */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="h-12">
                  <Avatar className="size-8">
                    <AvatarImage src="/avatar.png" />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-0.5 leading-none text-left">
                    <span className="font-semibold text-sm">default</span>
                    <span className="text-xs text-muted-foreground">
                      default@example.com
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start" side="top">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}