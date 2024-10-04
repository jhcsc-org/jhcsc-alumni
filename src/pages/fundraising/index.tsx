import { Button, Card, CardContent, CardHeader, Skeleton } from '@/components/ui';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ErrorPlaceholder } from '@/features/profile/components/profile-placeholders';
import { useList } from '@refinedev/core';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon, DollarSignIcon, MapPinCheckInsideIcon, SearchIcon, UsersIcon } from 'lucide-react';
import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface FundraisingCampaign {
    id: string;
    title: string;
    description: string;
    event_datetime: string;
    location: string;
    created_at: string;
    updated_at: string;
    goal: number;
    deadline: string;
    current_amount: number;
    donor_count: number;
}

const FundraisingCard: React.FC<FundraisingCampaign> = ({ 
    id, title, description, event_datetime, location, goal, deadline, current_amount, donor_count 
}) => {
    const progress = (current_amount / goal) * 100;
    const isActive = new Date(deadline) > new Date();

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter' || event.key === ' ') {
            console.log(`Campaign ${id} selected`);
        }
    };

    const handleClick = () => {
        console.log(`Campaign ${id} clicked`);
    };

    return (
        <Card
            className={`transition-shadow cursor-pointer hover:shadow-lg focus-within:ring-2 focus-within:ring-primary ${
                isActive ? 'bg-card' : 'bg-muted'
            }`}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            onClick={handleClick}
        >
            <CardHeader className="space-y-2">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold line-clamp-1">{title}</h3>
                    <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                        isActive ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'
                    }`}>
                        {isActive ? 'Active' : 'Ended'}
                    </span>
                </div>
                <div className="flex flex-col space-y-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{new Date(event_datetime).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                        })} - {new Date(deadline).toLocaleDateString('en-US', {
                            month: 'long',
                            day: 'numeric',
                        })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPinCheckInsideIcon className="w-4 h-4" />
                        <span>{location}</span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="prose-sm prose max-w-none line-clamp-2 h-[100px] overflow-hidden">
                    <Markdown remarkPlugins={[remarkGfm]}>
                        {description.length > 150 ? `${description.slice(0, 150)}...` : description}
                    </Markdown>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{current_amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} / {goal.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>
                <div className="flex justify-between text-sm text-card-foreground">
                    <div className="flex items-center">
                        <DollarSignIcon className="w-4 h-4 mr-1" />
                        <span>{Math.round(progress)}% funded</span>
                    </div>
                    <div className="flex items-center">
                        <UsersIcon className="w-4 h-4 mr-1" />
                        <span>{donor_count} donors</span>
                    </div>
                </div>
                {isActive && (
                    <Button className="w-full">Donate Now</Button>
                )}
            </CardContent>
        </Card>
    );
};

const FundraisingPage: React.FC = () => {
    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(6);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc');
    const [filterStatus, setFilterStatus] = React.useState<'all' | 'active' | 'ended'>('all');

    const { data, isLoading, isError } = useList<FundraisingCampaign>({
        resource: 'vw_fundraising_campaigns',
        pagination: { current: currentPage, pageSize },
        sorters: [{ field: 'event_datetime', order: sortOrder }],
        filters: [
            ...(searchTerm ? [{ field: 'title', operator: 'contains' as const, value: searchTerm }] : []),
            ...(filterStatus !== 'all' ? [{ 
                field: 'deadline', 
                operator: filterStatus === 'active' ? 'gt' as const : 'lt' as const, 
                value: new Date().toISOString() 
            }] : []),
        ],
    });

    const totalPages = data?.total ? Math.ceil(data.total / pageSize) : 0;

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, index) => (
                    <Skeleton key={index} className="h-80" />
                ))}
            </div>
        );
    }

    if (isError) {
        return <ErrorPlaceholder message="Failed to load fundraising campaigns." />;
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Fundraising Campaigns</h1>
                <p className="text-muted-foreground">Support our causes and make a difference in the community.</p>
            </div>
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <div className="relative w-full sm:w-64">
                    <SearchIcon className="absolute transform -translate-y-1/2 left-2 top-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search campaigns..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>
                <div className="flex gap-2">
                    <Select
                        value={filterStatus}
                        onValueChange={(value) => setFilterStatus(value as 'all' | 'active' | 'ended')}
                    >
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Filter" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="ended">Ended</SelectItem>
                        </SelectContent>
                    </Select>
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
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {data?.data.map((campaign) => (
                    <FundraisingCard
                        key={campaign.id}
                        {...campaign}
                    />
                ))}
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Campaigns per page</p>
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

export default FundraisingPage;