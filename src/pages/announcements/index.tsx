import { Card, CardContent, CardHeader, ScrollArea, Skeleton } from '@/components/ui';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    MotionDialog,
    MotionDialogClose,
    MotionDialogContainer,
    MotionDialogContent,
    MotionDialogDescription,
    MotionDialogSubtitle,
    MotionDialogTitle,
    MotionDialogTrigger,
} from '@/components/ui/motion-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ErrorPlaceholder } from '@/features/profile/components/profile-placeholders';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, Cross1Icon } from "@radix-ui/react-icons";
import { useList } from '@refinedev/core';
import { motion } from 'framer-motion';
import Fuse from 'fuse.js';
import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Announcement {
    id: string;
    title: string;
    description: string;
    posted_date: string;
}

const AnnouncementCard: React.FC<Announcement> = ({ id, title, description, posted_date }) => {
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
                    <CardHeader className="space-y-1">
                        <div className="flex items-center justify-between">
                            <h2 id={`announcement-title-${id}`} className="text-xl font-semibold">{title}</h2>
                            <div className="flex items-center text-sm text-muted-foreground">
                                <CalendarIcon className="w-4 h-4 mr-1" />
                                <MotionDialogSubtitle>
                                    <p className="text-sm">
                                        {new Date(posted_date).toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })}
                                    </p>
                                </MotionDialogSubtitle>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="prose-sm prose max-w-none">
                            <Markdown remarkPlugins={[remarkGfm]}>{description}</Markdown>
                        </div>
                    </CardContent>
                </Card>
            </MotionDialogTrigger>
            <MotionDialogContainer>
                <MotionDialogContent className="relative h-auto border w-full max-w-[90%] sm:max-w-[500px] rounded-lg bg-card">
                    <div className="p-4 sm:p-6">
                        <MotionDialogTitle className="font-bold text-card-foreground">{title}</MotionDialogTitle>
                        <MotionDialogSubtitle>
                            <p className="text-sm">
                                {new Date(posted_date).toLocaleDateString('en-US', {
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                })}
                            </p>
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

const AnnouncementsPage: React.FC = () => {
    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(10);
    const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc');
    const [searchTerm, setSearchTerm] = React.useState('');
    const searchTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    const { data, isLoading, isError } = useList<Announcement>({
        resource: 'vw_announcements',
        pagination: { current: currentPage, pageSize },
        sorters: [{ field: 'posted_date', order: sortOrder }],
        // Remove the existing filter logic
    });

    const fuse = React.useMemo(() => {
        if (data?.data) {
            return new Fuse(data.data, {
                keys: ['title', 'description'],
                threshold: 0.3, // Adjust the threshold for fuzziness
            });
        }
        return null;
    }, [data]);

    const filteredData = React.useMemo(() => {
        if (fuse && searchTerm) {
            return fuse.search(searchTerm).map(result => result.item);
        }
        return data?.data || [];
    }, [fuse, searchTerm, data]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        searchTimeoutRef.current = setTimeout(() => {
            setSearchTerm(value);
        }, 300); // Adjust the delay as needed
    };

    const totalPages = filteredData.length ? Math.ceil(filteredData.length / pageSize) : 0;

    if (isLoading) {
        return <Skeleton className="w-full h-96" />;
    }

    if (isError) {
        return <ErrorPlaceholder message="Failed to load announcements." />;
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Announcements</h1>
                <p className="text-muted-foreground">Stay updated with the latest news and information.</p>
            </div>
            <div className="flex items-center justify-between gap-4">
                <Input
                    placeholder="Search announcements..."
                    onChange={handleSearchChange}
                    className="max-w-sm"
                />
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
            <motion.div
                className="grid grid-cols-1 gap-4"
                key={sortOrder}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            >
                {filteredData.map((announcement) => (
                    <AnnouncementCard
                        key={announcement.id}
                        id={announcement.id}
                        title={announcement.title}
                        description={announcement.description}
                        posted_date={announcement.posted_date}
                    />
                ))}
            </motion.div>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Rows per page</p>
                    <Select
                        value={pageSize.toString()}
                        onValueChange={(value) => setPageSize(Number(value))}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={pageSize} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[10, 20, 30, 40, 50].map((size) => (
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

export default AnnouncementsPage;