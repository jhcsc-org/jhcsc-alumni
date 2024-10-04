import { Button } from "@/components/ui";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Marquee from "@/components/ui/marquee";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { TableType } from "@/types/dev.types";
import { BaseRecord, HttpError, useGetIdentity, useList } from "@refinedev/core";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { Calendar, CalendarDays, CoinsIcon, Mail, MapPin, Newspaper, Search, User } from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const HomePage = () => {
    const { data: user, isLoading: isUserLoading } = useGetIdentity<SupabaseUser>();
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const getGreeting = () => {
        const hour = currentTime.getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 18) return "Good Afternoon";
        return "Good Evening";
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    };

    // Fetch Recent Announcements
    const { data: announcementsData, isLoading: isAnnouncementsLoading } = useList<TableType<"vw_announcements"> & BaseRecord, HttpError, TableType<"vw_announcements"> & BaseRecord>({
        resource: "vw_announcements",
    });

    // Fetch Upcoming Events
    const { data: eventsData, isLoading: isEventsLoading } = useList<TableType<"vw_events"> & BaseRecord, HttpError, TableType<"vw_events"> & BaseRecord>({
        resource: "vw_events",
    });

    // Fetch Fundraising Highlights
    const { data: fundraisingData, isLoading: isFundraisingLoading } = useList<TableType<"vw_fundraising_projects"> & BaseRecord, HttpError, TableType<"vw_fundraising_projects"> & BaseRecord>({
        resource: "vw_fundraising_projects",
    });

    // Fetch Alumni Spotlight
    const { data: alumniData, isLoading: isAlumniLoading } = useList<TableType<"vw_alumni_directory"> & BaseRecord, HttpError, TableType<"vw_alumni_directory"> & BaseRecord>({
        resource: "vw_alumni_directory",
        filters: [
            {
                field: "year_batch",
                value: user?.user_metadata?.year_batch,
                operator: "eq",
            },
        ],
    });

    // Fetch Recent Contributions
    const { data: contributionsData, isLoading: isContributionsLoading } = useList<TableType<"vw_fundraising_contributions"> & BaseRecord, HttpError, TableType<"vw_fundraising_contributions"> & BaseRecord>({
        resource: "vw_fundraising_contributions",
    });

    const quickLinks = [
        {
            Icon: User,
            name: "Profile",
            description: "View and update your profile information",
            href: "/profile",
            cta: "Go to Profile",
            className: "sm:col-span-full lg:col-span-1 lg:row-span-2 text-xs",
        },
        {
            Icon: Newspaper,
            name: "News",
            description: "Stay updated with the latest alumni news",
            href: "/news",
            cta: "Read News",
            className: "sm:col-span-full lg:col-span-1 lg:row-span-1 text-xs",
        },
        {
            Icon: Search,
            name: "Search",
            description: "Find alumni, events, and more",
            href: "/search",
            cta: "Start Searching",
            className: "sm:col-span-full lg:col-span-2 lg:row-span-1 text-xs",
        },
        {
            Icon: Calendar,
            name: "Events",
            description: "Browse and register for upcoming events",
            href: "/events",
            cta: "View Events",
            className: "sm:col-span-full lg:col-span-2 lg:row-span-1 text-xs",
        },
        {
            Icon: CoinsIcon,
            name: "Fundraising",
            description: "View upcoming fundraising events",
            href: "/fundraising",
            cta: "View Fundraising",
            className: "sm:col-span-full lg:col-span-1 lg:row-span-1 text-xs",
        },
    ];

    const AnnouncementCard = ({
        title,
        description,
    }: {
        title: string;
        description: string;
    }) => {
        return (
            <figure
                className={cn(
                    "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
                    "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
                    "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
                )}
            >
                <div className="flex flex-col">
                    <figcaption className="text-sm font-medium dark:text-white">
                        {title}
                    </figcaption>
                </div>
                <blockquote className="mt-2 text-sm">{description}</blockquote>
            </figure>
        );
    };

    return (
        <div>
            {isUserLoading ? (
                <div className="mb-6">
                    <Skeleton className="w-3/4 h-40 mb-2" />
                    <Skeleton className="w-1/2 h-5 mb-2" />
                    <Skeleton className="w-2/3 h-5 mb-2" />
                    <Skeleton className="w-1/3 h-5" />
                </div>
            ) : (
                <Card className="mb-6 bg-accent-10 text-primary-foreground transform-gpu dark:bg-background dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]">
                    <CardHeader>
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                                <div>
                                    <CardTitle className="text-2xl font-bold sm:text-3xl">{getGreeting()}, {user?.user_metadata?.first_name}</CardTitle>
                                    <p className="mt-1 text-sm text-primary-foreground/80 sm:text-base">It's great to see you again!</p>
                                    <p className="mt-1 text-sm text-primary-foreground/80 sm:text-xs">Current time: {formatTime(currentTime)}</p>
                                </div>
                                <div className="flex-col hidden sm:flex sm:items-end">
                                    <Button size="sm" variant="link" className="text-background sm:w-auto">
                                        <NavLink to="/alumni-directory">
                                            Update Profile
                                        </NavLink>
                                    </Button>
                                    <Button size="sm" variant="link" className="text-background sm:w-auto">
                                        <NavLink to="/alumni-directory">
                                            View Alumni Directory
                                        </NavLink>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <div className="flex items-center text-primary-foreground/90">
                                    <Mail className="w-4 h-4 mr-2 shrink-0" />
                                    <span className="text-sm truncate sm:text-base">{user?.email}</span>
                                </div>
                                <div className="flex items-center text-primary-foreground/90">
                                    <MapPin className="w-4 h-4 mr-2 shrink-0" />
                                    <span className="text-sm truncate sm:text-base">{user?.user_metadata?.location || 'Location not set'}</span>
                                </div>
                                <div className="flex items-center text-primary-foreground/90">
                                    <CalendarDays className="w-4 h-4 mr-2 shrink-0" />
                                    <span className="text-sm sm:text-base">Class of {user?.user_metadata?.year_batch}</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
            <h2 className="mb-2 text-2xl font-semibold">Recent Announcements</h2>
            <div className="relative flex flex-col items-center justify-center w-full overflow-hidden rounded-lg bg-background">
                {isAnnouncementsLoading ? (
                    <div className="flex items-center justify-center w-full h-full">
                        <Skeleton className="w-3/4 h-40" />
                    </div>
                ) : (
                    <>
                        <Marquee pauseOnHover className="[--duration:120s]">
                            {announcementsData?.data.slice(0, Math.ceil(announcementsData.data.length / 2)).map((item) => (
                                <AnnouncementCard key={item.id} title={item.title ?? ''} description={item.description ?? ''} />
                            ))}
                        </Marquee>
                        <Marquee reverse pauseOnHover className="[--duration:120s]">
                            {announcementsData?.data.slice(Math.ceil(announcementsData.data.length / 2)).map((item) => (
                                <AnnouncementCard key={item.id} title={item.title ?? ''} description={item.description ?? ''} />
                            ))}
                        </Marquee>
                        <div className="absolute inset-y-0 left-0 w-1/3 pointer-events-none bg-gradient-to-r from-white dark:from-background" />
                        <div className="absolute inset-y-0 right-0 w-1/3 pointer-events-none bg-gradient-to-l from-white dark:from-background" />
                    </>
                )}
            </div>
            <h2 className="mt-2 mb-4 text-2xl font-semibold">Quick Links</h2>
            <div className="flex flex-col items-center justify-center w-full">
                <BentoGrid className="grid-cols-1 grid-rows-5 mb-8 sm:grid-cols-4 lg:grid-rows-2">
                    {quickLinks.map((link, index) => (
                        <BentoCard background={undefined} key={index} {...link} />
                    ))}
                </BentoGrid>
            </div>
            <div className="grid grid-cols-1 gap-4 mb-4 lg:grid-cols-2">
                {/* Upcoming Events */}
                <div>
                    <h2 className="mb-2 text-xl font-semibold">Upcoming Events</h2>
                    <div className="space-y-2">
                        {isEventsLoading ? (
                            Array(3).fill(0).map((_, index) => (
                                <Card key={index} className="">
                                    <CardContent className="flex items-center p-2">
                                        <div className="w-full">
                                            <Skeleton className="w-3/4 h-5 mb-2" />
                                            <Skeleton className="w-1/2 h-4" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            eventsData?.data.map((item) => (
                                <Card key={item.id} className="">
                                    <CardContent className="flex items-center p-4">
                                        <div>
                                            <h3 className="font-semibold">{item.title}</h3>
                                            <p className="text-sm text-muted-foreground">{new Date(item.event_datetime || '').toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric',
                                            })}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </div>

                {/* Fundraising Highlights */}
                <div>
                    <h2 className="mb-2 text-xl font-semibold">Fundraising Highlights</h2>
                    <div className="space-y-2">
                        {isFundraisingLoading ? (
                            Array(3).fill(0).map((_, index) => (
                                <Card key={index} className="">
                                    <CardContent className="p-2">
                                        <div className="flex flex-col justify-between">
                                            <Skeleton className="w-3/4 h-5 mb-2" />
                                            <Skeleton className="w-1/2 h-4" />
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            fundraisingData?.data.map((item) => (
                                <Card key={item.id} className="">
                                    <CardContent className="p-4">
                                        <div className="flex flex-col justify-between">
                                            <h3 className="font-semibold">{item.title}</h3>
                                            <p className="text-sm text-muted-foreground">
                                                ${item.goal?.toLocaleString() ?? 'N/A'} / {item.deadline ? new Date(item.deadline).toLocaleDateString() : 'N/A'}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </div>
            <h2 className="mb-2 text-xl font-semibold">Alumni Spotlight</h2>
            <div className="grid grid-cols-1 gap-2 mb-4 md:grid-cols-2">
                {isAlumniLoading ? (
                    Array(2).fill(0).map((_, index) => (
                        <Card key={index} className="">
                            <CardContent className="flex items-center p-4">
                                <Skeleton className="w-16 h-16 mr-4 rounded-full" />
                                <div className="w-full">
                                    <Skeleton className="w-3/4 h-6 mb-2" />
                                    <Skeleton className="w-1/2 h-4 mb-1" />
                                    <Skeleton className="w-1/4 h-4" />
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    alumniData?.data.map((item) => (
                        <Card key={item.id} className="">
                            <CardContent className="flex items-center p-4">
                                <Avatar className="w-16 h-16 mr-4">
                                    <AvatarImage src={item.profile_picture ?? undefined} alt={item.first_name ?? 'Unknown'} className="object-cover" />
                                    <AvatarFallback>{item.first_name ? item.first_name[0] : 'U'}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-lg font-semibold">{`${item.first_name ?? 'Unknown'} ${item.middle_name ? `${item.middle_name} ` : ''}${item.last_name ?? ''}`}</h3>
                                    <p className="mb-1 text-sm text-muted-foreground">{`Class of ${item.year_graduation ?? 'N/A'}`}</p>
                                    <NavLink to="#" className="text-sm text-primary hover:underline">
                                        View Profile
                                    </NavLink>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
            {/* <h2 className="mb-2 text-xl font-semibold">Recent Contributions</h2>
            <Card className="">
                <CardContent className="p-4">
                    {isContributionsLoading ? (
                        Array(3).fill(0).map((_, index) => (
                            <div key={index} className={`flex items-center ${index !== 0 ? 'mt-4' : ''}`}>
                                <Skeleton className="w-10 h-10 mr-2 rounded-full" />
                                <div className="w-full">
                                    <Skeleton className="w-1/2 h-5 mb-1" />
                                    <Skeleton className="w-3/4 h-4" />
                                </div>
                            </div>
                        ))
                    ) : (
                        contributionsData?.data.map((item, index) => (
                            <div key={item.contribution_id} className={`flex items-center ${index !== 0 ? 'mt-4' : ''}`}>
                                <Avatar className="w-10 h-10 mr-2">
                                    <AvatarImage src={`https://i.pravatar.cc/150?img=${index + 3}`} alt={item.first_name ?? 'Unknown'} />
                                    <AvatarFallback>{item.first_name ? item.first_name[0] : 'U'}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-semibold">{`${item.first_name ?? 'Unknown'} ${item.last_name ?? ''}`}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Donated <span className="font-medium text-primary">${item.amount}</span> on {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card> */}
        </div>
    );
};

export default HomePage;