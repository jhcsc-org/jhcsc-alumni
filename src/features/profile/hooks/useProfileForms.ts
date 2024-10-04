import { TableType } from "@/types/dev.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { HttpError, useCreate, useList, useUpdate } from "@refinedev/core";
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { DegreeDetailsValues, EmploymentHistoryValues, PersonalInfoValues, degreeDetailsSchema, employmentHistorySchema, personalInfoSchema } from "../profile-schema";

export const useEditPersonalInfo = (alumni: TableType<"alumni"> | undefined, onSuccessCallback: () => void) => {
    const { mutate: updateAlumni, isLoading: isUpdating } = useUpdate<TableType<"alumni">, HttpError>({
        resource: "alumni",
        mutationOptions: {
            onSuccess: () => {
                onSuccessCallback();
            },
        }
    });

    const form = useForm<PersonalInfoValues>({
        resolver: zodResolver(personalInfoSchema),
        defaultValues: {
            first_name: alumni?.first_name || '',
            middle_name: alumni?.middle_name || '',
            last_name: alumni?.last_name || '',
            birth_date: alumni?.birth_date || '',
            profile_description: alumni?.profile_description || '',
            location: alumni?.location || '',
            profile_picture: alumni?.profile_picture || '',
        },
    });

    const onSubmit = (data: PersonalInfoValues) => {
        updateAlumni({
            id: alumni?.id || '',
            values: {
                ...alumni,
                ...data,
            },
        });
    };

    return {
        form,
        onSubmit,
        isUpdating,
    };
};

export const useEditDegreeDetails = (alumni: TableType<"alumni"> | undefined, onSuccessCallback: () => void) => {
    const { mutate: updateAlumni, isLoading: isUpdating } = useUpdate<TableType<"alumni">, HttpError>({
        resource: "alumni",
        mutationOptions: {
            onSuccess: () => {
                onSuccessCallback();
            },
        }
    });

    const { data: degreesData, isLoading: isDegreesLoading } = useList<TableType<"degrees"> & { degree_categories: TableType<"degree_categories"> }, HttpError>({
        resource: "degrees",
        meta: {
            select: "*, degree_categories(category_name)"
        }
    });

    const form = useForm<DegreeDetailsValues>({
        resolver: zodResolver(degreeDetailsSchema),
        defaultValues: {
            degree_id: alumni?.degree_id || 0,
            year_batch: alumni?.year_batch || new Date().getFullYear(),
            year_graduation: alumni?.year_graduation || new Date().getFullYear(),
        },
    });

    const onSubmit = (data: DegreeDetailsValues) => {
        updateAlumni({
            id: alumni?.id || '',
            values: {
                ...alumni,
                ...data,
            },
        });
    };

    return {
        form,
        degreesData,
        isDegreesLoading,
        onSubmit,
        isUpdating,
    };
};

export const useAddEmploymentHistory = (alumniId: string | undefined, onSuccessCallback: () => void) => {
    const { mutate: createEmployment, isLoading: isCreating } = useCreate<TableType<"employment_history">, HttpError>({
        resource: "employment_history",
        mutationOptions: {
            onSuccess: () => {
                onSuccessCallback();
            },
        }
    });

    const form = useForm<EmploymentHistoryValues>({
        resolver: zodResolver(employmentHistorySchema),
        defaultValues: {
            company_name: '',
            position: '',
            start_date: '',
            end_date: '',
        },
    });

    const onSubmit = (data: EmploymentHistoryValues) => {
        createEmployment({
            values: {
                ...data,
                alumni_user_id: alumniId,
            },
        });
    };

    return {
        form,
        onSubmit,
        isCreating,
    };
};

export const useEditProfileDrawer = (handleUpdateSuccess: () => void) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return {
        isDrawerOpen,
        setIsDrawerOpen,
    };
};

export const useEmploymentDrawer = (handleUpdateSuccess: () => void)  => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return {
        isDrawerOpen,
        setIsDrawerOpen,
    };
};

export const useProfilePictureDrawer = (handleUpdateSuccess: () => void) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return {
        isDrawerOpen,
        setIsDrawerOpen,
    };
};