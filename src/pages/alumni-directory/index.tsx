import { Avatar, Button, Card, CardContent, CardHeader, Skeleton } from '@/components/ui';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ErrorPlaceholder } from '@/features/profile/components/profile-placeholders';
import { useList } from '@refinedev/core';
import { ChevronLeftIcon, ChevronRightIcon, SearchIcon } from 'lucide-react';
import React, { useState } from 'react';

interface Alumni {
    id: string;
    profile_picture: string | null;
    first_name: string;
    middle_name: string | null;
    last_name: string;
    birth_date: string | null;
    year_batch: number;
    year_graduation: number;
    profile_description: string | null;
    location: string | null;
    created_at: string;
    updated_at: string;
    degree_id: string;
    degree_name: string;
    degree_category_id: string;
    degree_category: string;
}

const AlumniCard: React.FC<Alumni> = ({ 
    id, profile_picture, first_name, middle_name, last_name, year_batch, year_graduation, 
    profile_description, location, degree_name, degree_category 
}) => {
    return (
        <Card className="transition-shadow hover:shadow-md">
            <CardHeader className="flex flex-row items-center gap-4">
                <Avatar className="w-16 h-16">
                    <img src={profile_picture || '/default-avatar.png'} alt={`${first_name} ${last_name}`} />
                </Avatar>
                <div>
                    <h3 className="text-lg font-semibold">{first_name} {middle_name ? `${middle_name} ` : ''}{last_name}</h3>
                    <p className="text-sm text-muted-foreground">{degree_name}, {year_graduation}</p>
                </div>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="text-sm">
                    <span className="font-medium">Batch:</span> {year_batch}
                </div>
                {location && (
                    <div className="text-sm">
                        <span className="font-medium">Location:</span> {location}
                    </div>
                )}
                {profile_description && (
                    <div className="text-sm line-clamp-2">
                        <span className="font-medium">About:</span> {profile_description}
                    </div>
                )}
                <div className="text-sm">
                    <span className="font-medium">Degree Category:</span> {degree_category}
                </div>
                <Button variant="outline" className="w-full mt-2">View Profile</Button>
            </CardContent>
        </Card>
    );
};

const AlumniDirectoryPage: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(12);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<'last_name' | 'year_graduation'>('last_name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
    const [filterDegreeCategory, setFilterDegreeCategory] = useState<string>('');
    const [filterYearBatch, setFilterYearBatch] = useState<string>('');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const { data, isLoading, isError } = useList<Alumni>({
        resource: 'vw_alumni_directory',
        pagination: { current: currentPage, pageSize },
        sorters: [{ field: sortBy, order: sortOrder }],
        filters: [
            ...(searchTerm ? [{ field: 'last_name', operator: 'contains' as const, value: searchTerm }] : []),
            ...(filterDegreeCategory ? [{ field: 'degree_category', operator: 'eq' as const, value: filterDegreeCategory }] : []),
            ...(filterYearBatch ? [{ field: 'year_batch', operator: 'eq' as const, value: filterYearBatch }] : []),
        ],
    });

    const totalPages = data?.total ? Math.ceil(data.total / pageSize) : 0;

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {[...Array(12)].map((_, index) => (
                    <Skeleton key={index} className="h-48" />
                ))}
            </div>
        );
    }

    if (isError) {
        return <ErrorPlaceholder message="Failed to load alumni directory." />;
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight">Alumni Directory</h1>
                <p className="text-muted-foreground">Connect with your fellow alumni and expand your network.</p>
            </div>

            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <div className="relative w-full sm:w-64">
                    <SearchIcon className="absolute transform -translate-y-1/2 left-2 top-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search alumni..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8"
                    />
                </div>
                <div className="flex gap-2">
                    <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'last_name' | 'year_graduation')}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="last_name">Name</SelectItem>
                            <SelectItem value="year_graduation">Graduation Year</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as 'asc' | 'desc')}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Sort order" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="asc">Ascending</SelectItem>
                            <SelectItem value="desc">Descending</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
                        {viewMode === 'grid' ? 'List View' : 'Grid View'}
                    </Button>
                </div>
            </div>

            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {data?.data.map((alumnus) => (
                    <AlumniCard key={alumnus.id} {...alumnus} />
                ))}
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Alumni per page</p>
                    <Select
                        value={pageSize.toString()}
                        onValueChange={(value) => setPageSize(Number(value))}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={pageSize} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[12, 24, 36, 48].map((size) => (
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

export default AlumniDirectoryPage;