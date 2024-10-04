import { Card, CardHeader, CardTitle, Skeleton } from '@/components/ui';
import { ErrorPlaceholder, NoDataPlaceholder } from '@/features/profile/components/profile-placeholders';
import { useList } from '@refinedev/core';
import React from 'react';

const DepartmentsProgramsPage: React.FC = () => {
    const { data: departmentsData, isLoading: isDepartmentsLoading, isError: isDepartmentsError } = useList({
        resource: 'vw_departments',
    });

    const { data: programsData, isLoading: isProgramsLoading, isError: isProgramsError } = useList({
        resource: 'vw_degree_programs',
    });

    if (isDepartmentsLoading || isProgramsLoading) {
        return <Skeleton />;
    }

    if (isDepartmentsError || isProgramsError) {
        return <ErrorPlaceholder message="Failed to load departments or programs." />;
    }

    return (
        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-1 lg:grid-cols-2">
            <div className="lg:col-span-1">
                <Card className="p-4 sm:p-6 bg-card text-card-foreground">
                    <CardHeader>
                        <CardTitle className="text-xl sm:text-2xl text-foreground">Departments</CardTitle>
                    </CardHeader>
                    {departmentsData?.data.length ? (
                        departmentsData.data.map((department) => (
                            <div key={department.id} className="mt-2">
                                <p className="text-sm sm:text-base text-foreground">{department.name}</p>
                            </div>
                        ))
                    ) : (
                        <NoDataPlaceholder message="No departments available." />
                    )}
                </Card>
            </div>
            <div className="lg:col-span-1">
                <Card className="p-4 sm:p-6 bg-card text-card-foreground">
                    <CardHeader>
                        <CardTitle className="text-xl sm:text-2xl text-foreground">Degree Programs</CardTitle>
                    </CardHeader>
                    {programsData?.data.length ? (
                        programsData.data.map((program) => (
                            <div key={program.id} className="mt-2">
                                <p className="text-sm sm:text-base text-foreground">{program.degree_name} - {program.degree_category}</p>
                            </div>
                        ))
                    ) : (
                        <NoDataPlaceholder message="No degree programs available." />
                    )}
                </Card>
            </div>
        </div>
    );
};

export default DepartmentsProgramsPage;