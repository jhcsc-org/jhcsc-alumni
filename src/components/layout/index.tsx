import {
  ErrorPlaceholder,
  NoDataPlaceholder,
} from "@/features/profile/components/profile-placeholders";
import { cn } from "@/lib/utils";
import { WelcomePage } from "@/pages/welcome";
import { useList, useLogout, useMenu } from "@refinedev/core";
import { LogOutIcon, Menu } from "lucide-react";
import type { PropsWithChildren } from "react";
import { useEffect, useState } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import { useMediaQuery } from 'usehooks-ts';
import { Drawer } from 'vaul';
import { ModeToggle } from "../../components/mode-toggle";
import { Button } from "../../components/ui/button";
import { Skeleton } from "../ui";
import { Separator } from "../ui/separator";

const Header: React.FC<{
  hideLogo?: boolean;
}> = ({
  hideLogo = true,
}: {
  hideLogo?: boolean;
}) => (
  <div className="flex flex-row items-center justify-left">
    <h1 className="text-xl font-bold">
      {!hideLogo && (
        <i
          className="ph-light ph-graph dark:text-foreground"
          style={{
          fontSize: "2.5rem",
        }}
        />
      )}
    </h1>
  </div>
);

const Sidebar: React.FC = () => {
  const { mutate: logout } = useLogout();
  const { menuItems } = useMenu();

  return (
    <div className="flex flex-col h-full">
      <div className="items-center justify-between hidden px-4 pt-4 md:flex">
        <Header hideLogo={false} />
      </div>
      <nav className="flex-1 p-4 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.key}
            to={item.route ?? "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center px-2 py-1.5 mb-1.5 rounded-md text-sm",
                isActive
                  ? "font-medium bg-accent-10 dark:bg-accent-4 text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted dark:hover:bg-accent-4"
              )
            }
          >
            {item.icon}
            <span className="ml-2">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="flex flex-row justify-between gap-1 py-4 mx-4 border-t border-dashed border-border/65">
        <ModeToggle />
        <Button variant="outline" className="rounded-xl dark:bg-muted text-muted-foreground" onClick={() => logout()}>
          <LogOutIcon className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};

const AlumniSidebar: React.FC = () => {
  const { data, isLoading, isError } = useList({
    resource: "vw_alumni_directory",
  });

  return (
    <div>
      <div className="hidden lg:block">
        <Header />
      </div>
      <Separator className="hidden md:block" />
      {isLoading ? (
        <Skeleton />
      ) : isError ? (
        <ErrorPlaceholder message="Failed to load alumni list." />
      ) : data?.data.length ? (
        data.data.map((alumni) => (
          <div
            key={alumni.id}
            className="flex items-center px-4 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground"
          >
            <img
              src={alumni.profile_picture || "https://via.placeholder.com/150"}
              alt={`${alumni.first_name} ${alumni.last_name}`}
              className="w-8 h-8 rounded-full"
            />
            <span className="ml-2 text-foreground">
              {`${alumni.first_name} ${alumni.middle_name ? `${alumni.middle_name} ` : ""
                }${alumni.last_name}`}
            </span>
          </div>
        ))
      ) : (
        <NoDataPlaceholder message="No alumni information available." />
      )}
    </div>
  );
};

export const Layout: React.FC<PropsWithChildren> = ({ children }) => {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

  const isMobile = useMediaQuery("(max-width: 1023px)");

  useEffect(() => {
    if (!isMobile) {
      setLeftSidebarOpen(false);
      setRightSidebarOpen(false);
    }
  }, [isMobile]);

  const [searchParams] = useSearchParams();
  
  if (searchParams.get("wc") === "1") {
    return <WelcomePage />;
  }

  return (
    <div className="flex flex-col min-h-screen lg:flex-row">
      <header className="flex items-center justify-between p-4 border-b lg:hidden">
        <Button variant="ghost" size="icon" onClick={() => setLeftSidebarOpen(true)}>
          <Menu className="w-6 h-6" />
        </Button>
        <Header hideLogo={false} />
        <Button variant="ghost" size="icon" onClick={() => setRightSidebarOpen(true)}>
          <i className="text-2xl ph-light ph-users" />
        </Button>
      </header>
      {isMobile ? (
        <>
          <Drawer.Root direction="left" open={leftSidebarOpen} onOpenChange={setLeftSidebarOpen}>
            <Drawer.Portal>
              <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
              <Drawer.Content className="fixed inset-y-0 left-0 z-10 flex outline-none">
                <div className="bg-muted border border-border/10 rounded-[32px] w-[310px] grow mt-2 ml-2 mb-2 flex flex-col">
                  <Sidebar />
                </div>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
          <Drawer.Root direction="right" open={rightSidebarOpen} onOpenChange={setRightSidebarOpen}>
            <Drawer.Portal>
              <Drawer.Overlay className="fixed inset-0 bg-black/40 back" />
              <Drawer.Content className="fixed inset-y-0 right-0 z-10 flex outline-none">
                <div className="bg-muted border border-border/10 rounded-[36px] w-[310px] grow mt-2 mr-2 mb-2 p-5 flex flex-col">
                  <AlumniSidebar />
                </div>
              </Drawer.Content>
            </Drawer.Portal>
          </Drawer.Root>
        </>
      ) : (
        <>
          <div className="hidden bg-muted lg:flex lg:flex-col lg:w-64 lg:fixed lg:left-0 lg:top-0 lg:bottom-0 lg:border-r lg:border-dashed lg:border-border/65">
            <Sidebar />
          </div>
          <div className="hidden bg-muted lg:flex lg:flex-col lg:w-64 lg:fixed lg:right-0 lg:top-0 lg:bottom-0 lg:border-l lg:border-dashed lg:border-border/65">
            <AlumniSidebar />
          </div>
        </>
      )}
      <main className="flex-1 p-6 overflow-y-auto lg:ml-64 lg:mr-64">
        <div className="max-w-[1200px] mx-auto">{children}</div>
      </main>
    </div>
  );
};