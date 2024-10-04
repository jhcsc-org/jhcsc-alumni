import { Button, Card, CardHeader, ScrollArea, Skeleton } from '@/components/ui';
import { Input } from '@/components/ui/input';
import { MotionDialog, MotionDialogClose, MotionDialogContainer, MotionDialogContent, MotionDialogDescription, MotionDialogSubtitle, MotionDialogTitle, MotionDialogTrigger } from '@/components/ui/motion-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ErrorPlaceholder } from '@/features/profile/components/profile-placeholders';
import { Cross1Icon } from '@radix-ui/react-icons';
import { useList } from '@refinedev/core';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, MapPinIcon, SearchIcon } from 'lucide-react';
import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Event {
    id: string;
    title: string;
    description: string;
    event_datetime: string;
    location: string;
}

const EventCard: React.FC<Event> = ({ id, title, description, event_datetime, location }) => {
    return (
        <MotionDialog
            transition={{
                type: 'tween',
                stiffness: 500,
                damping: 30,
                mass: 1,
                ease: 'easeInOut',
                duration: 0.4,
            }}
        >
            <MotionDialogTrigger className="transition-shadow cursor-pointer hover:shadow-md focus-within:ring-2 focus-within:ring-primary">
                <Card tabIndex={0}>
                    <CardHeader className="space-y-2">
                        <h3 className="text-xl font-semibold line-clamp-2">{title}</h3>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <CalendarIcon className="w-4 h-4" />
                            <span>{new Date(event_datetime).toLocaleString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric',
                                hour: 'numeric',
                                minute: 'numeric',
                                hour12: true,
                            })}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <MapPinIcon className="w-4 h-4" />
                            <span>{location}</span>
                        </div>
                    </CardHeader>
                </Card>
            </MotionDialogTrigger>
            <MotionDialogContainer>
                <MotionDialogContent className="relative border w-full mx-4 sm:max-w-[500px] rounded-lg bg-card">
                    <div className="p-4 sm:p-6">
                        <MotionDialogTitle className="font-bold text-card-foreground">{title}</MotionDialogTitle>
                        <MotionDialogSubtitle>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <CalendarIcon className="w-4 h-4" />
                                <span>{new Date(event_datetime).toLocaleString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                    hour: 'numeric',
                                    minute: 'numeric',
                                    hour12: true,
                                })}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <MapPinIcon className="w-4 h-4" />
                                <span>{location}</span>
                            </div>
                        </MotionDialogSubtitle>
                        <MotionDialogDescription className="mt-4 text-sm text-foreground">
                            <ScrollArea className={"[&>[data-radix-scroll-area-viewport]]:max-h-[65vh]"}>
                                <Markdown remarkPlugins={[remarkGfm]}>{description}</Markdown>
                            </ScrollArea>
                        </MotionDialogDescription>
                    </div>
                    <MotionDialogClose className="absolute top-4 right-4 text-zinc-500">
                        <Cross1Icon />
                    </MotionDialogClose>
                </MotionDialogContent>
            </MotionDialogContainer>
        </MotionDialog>
    );
};

const EventsPage: React.FC = () => {
    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(6);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc');

    const { data, isLoading, isError } = useList<Event>({
        resource: 'vw_events',
        pagination: { current: currentPage, pageSize },
        sorters: [{ field: 'event_datetime', order: sortOrder }],
        filters: searchTerm ? [{ field: 'title', operator: 'contains', value: searchTerm }] : [],
    });

    const totalPages = data?.total ? Math.ceil(data.total / pageSize) : 0;

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, index) => (
                    <Skeleton key={index} className="h-64" />
                ))}
            </div>
        );
    }

    if (isError) {
        return <ErrorPlaceholder message="Failed to load events." />;
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Upcoming Events</h1>
                <p className="text-muted-foreground">Discover and join exciting events in your area.</p>
            </div>
            <div className="flex flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-64">
                    <SearchIcon className="absolute transform -translate-y-1/2 left-2 top-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search events..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>
                <Select
                    value={sortOrder}
                    onValueChange={(value) => setSortOrder(value as 'asc' | 'desc')}
                >
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by date" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="desc">Newest first</SelectItem>
                        <SelectItem value="asc">Oldest first</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {data?.data.map((event) => (
                    <EventCard
                        key={event.id}
                        id={event.id}
                        title={event.title}
                        description={event.description}
                        event_datetime={event.event_datetime}
                        location={event.location}
                    />
                ))}
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Events per page</p>
                    <Select
                        value={pageSize.toString()}
                        onValueChange={(value) => setPageSize(Number(value))}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={pageSize} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[6, 12, 24, 36].map((size) => (
                                <SelectItem key={size} value={size.toString()}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeftIcon className="w-4 h-4" />
                    </Button>
                    <div className="text-sm font-medium">
                        Page {currentPage} of {totalPages}
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        <ChevronRightIcon className="w-4 h-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default EventsPage;