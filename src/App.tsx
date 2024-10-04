import {
  Authenticated,
  ErrorComponent,
  Refine
} from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { BellIcon, CalendarIcon, CoinsIcon, GraduationCapIcon, HomeIcon, UserIcon, UsersIcon } from "lucide-react";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import "./App.css";
import authProvider from "./authProvider";
import { Layout } from "./components/layout";
import { useTheme } from "./components/theme-provider";
import { Toaster } from "./components/ui";
import { AuthPage } from "./features/auth";
import AlumniDirectoryPage from "./pages/alumni-directory";
import AnnouncementsPage from "./pages/announcements";
import DepartmentsProgramsPage from "./pages/departments-programs";
import EventsPage from "./pages/events";
import FundraisingPage from "./pages/fundraising";
import HomePage from "./pages/home";
import ProfilePage from "./pages/profile";
import { dataProvider, liveProvider } from "./providers/supabase";
import { supabaseClient } from "./utility";

function App() {
  const { theme } = useTheme();
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <Refine
          dataProvider={dataProvider(supabaseClient)}
          liveProvider={liveProvider(supabaseClient)}
          authProvider={authProvider}
          routerProvider={routerBindings}
          resources={[
            {
              name: "home",
              list: "/",
              meta: {
                label: "Home",
                icon: <HomeIcon className="w-4 h-4" />,
              },
            },
            {
              name: "profile",
              list: "/profile",
              edit: "/profile/edit",
              meta: {
                label: "Profile",
                icon: <UserIcon className="w-4 h-4" />,
              },
            },
            {
              name: "announcements",
              list: "/announcements",
              meta: {
                label: "Announcements",
                icon: <BellIcon className="w-4 h-4" />,
              },
            },
            {
              name: "events",
              list: "/events",
              meta: {
                label: "Events",
                icon: <CalendarIcon className="w-4 h-4" />,
              },
            },
            {
              name: "fundraising",
              list: "/fundraising",
              meta: {
                label: "Fundraising",
                icon: <CoinsIcon className="w-4 h-4" />,
              },
            },
            {
              name: "departments-programs",
              list: "/departments-programs",
              meta: {
                icon: <GraduationCapIcon className="w-4 h-4" />,
                hide: true,
              },
            },
            {
              name: "alumni-directory",
              list: "/alumni-directory",
              meta: {
                label: "Directory",
                icon: <UsersIcon className="w-4 h-4" />,
              },
            },
          ]}
          options={{
            syncWithLocation: true,
            warnWhenUnsavedChanges: true,
            useNewQueryKeys: true,
            projectId: "g0Omx0-zVsBWz-12OXHO",
            reactQuery: {
              clientConfig: {
                defaultOptions: {
                  queries: {
                    networkMode: "offlineFirst",
                  },
                  mutations: {
                    networkMode: "offlineFirst"
                  },
                }
              }
            }
          }}
        >
          <Routes>
            <Route
              element={
                <Authenticated
                  key="authenticated-inner"
                  fallback={<CatchAllNavigate to="/login" />}
                >
                  <Layout>
                    <Outlet />
                  </Layout>
                </Authenticated>
              }
            >
              <Route index element={<HomePage />} />
              <Route path="/profile" element={<ProfilePage />}>
                <Route path="edit" element={<ProfilePage />} />
              </Route>
              <Route path="/announcements" element={<AnnouncementsPage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/fundraising" element={<FundraisingPage />} />
              <Route path="/departments-programs" element={<DepartmentsProgramsPage />} />
              <Route path="/alumni-directory" element={<AlumniDirectoryPage />} />
              <Route path="*" element={<ErrorComponent />} />
            </Route>
            <Route
              element={
                <Authenticated
                  key="authenticated-outer"
                  fallback={<Outlet />}
                >
                  <NavigateToResource />
                </Authenticated>
              }
            >
              <Route
                path="/login"
                element={
                  <AuthPage
                    type="login"
                    renderContent={(content) => (
                      <div>
                        {content}
                      </div>
                    )}
                  />
                }
              />
              <Route
                path="/register"
                element={<AuthPage type="register" />}
              />
              <Route
                path="/forgot-password"
                element={<AuthPage type="forgotPassword" />}
              />
            </Route>
          </Routes>
          <RefineKbar />
          <UnsavedChangesNotifier />
          <DocumentTitleHandler />
        </Refine>
        <Toaster theme={theme as "dark" | "light" | "system" | undefined} />
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;