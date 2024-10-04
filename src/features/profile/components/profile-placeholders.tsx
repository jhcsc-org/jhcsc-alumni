import { ExclamationTriangleIcon, InfoCircledIcon } from '@radix-ui/react-icons';
import React from 'react';

export const NoDataPlaceholder: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex flex-row items-center justify-center gap-1">
        <InfoCircledIcon className="text-muted-foreground" />
        <p className="text-sm text-muted-foreground">{message}</p>
    </div>
);

export const ErrorPlaceholder: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex flex-col items-center justify-center gap-1">
        <ExclamationTriangleIcon className="w-6 h-6 text-destructive" />
        <p className="text-sm text-red-500">{message}</p>
    </div>
);