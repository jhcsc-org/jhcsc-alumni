import { TableType } from "@/types/dev.types";
import { HttpError, useGetIdentity, useList, useOne } from "@refinedev/core";

export const useProfileData = () => {
    const { data: identity, isLoading: isIdentityLoading, isError: isIdentityError } = useGetIdentity<TableType<"users">>();

    const { data: alumniData, isLoading: isAlumniLoading, isError: isAlumniError, refetch: refetchAlumni } = useOne<TableType<"alumni">, HttpError>({
        resource: "alumni",
        id: identity?.id,
        queryOptions: {
            enabled: !!identity?.id,
        },
    });

    const alumni = alumniData?.data;

    const { data: degreeData, isLoading: isDegreeLoading, isError: isDegreeError } = useOne<TableType<"degrees">, HttpError>({
        resource: "degrees",
        id: alumni?.degree_id || 0,
        queryOptions: {
            enabled: !!alumni?.degree_id,
        },
    });

    const degree = degreeData?.data;

    const { data: contactSocialsData, isLoading: isContactSocialsLoading, isError: isContactSocialsError } = useList<TableType<"contact_socials">, HttpError>({
        resource: "contact_socials",
        filters: [
            {
                field: "alumni_user_id",
                operator: "eq",
                value: alumni?.id,
            },
        ],
        queryOptions: {
            enabled: !!alumni?.id,
        },
    });

    console.log(contactSocialsData);

    const contactSocials = contactSocialsData?.data;

    const { data: employmentHistoryData, isLoading: isEmploymentLoading, isError: isEmploymentError, refetch: refetchEmployment } = useList<TableType<"employment_history">, HttpError>({
        resource: "employment_history",
        filters: [
            {
                field: "alumni_user_id",
                operator: "eq",
                value: alumni?.id,
            },
        ],
        queryOptions: {
            enabled: !!alumni?.id,
        },
    });

    const employmentHistory = employmentHistoryData?.data;

    return {
        identity,
        isIdentityLoading,
        isIdentityError,
        alumni,
        isAlumniLoading,
        isAlumniError,
        degree,
        isDegreeLoading,
        isDegreeError,
        contactSocials,
        isContactSocialsLoading,
        isContactSocialsError,
        employmentHistory,
        isEmploymentLoading,
        isEmploymentError,
        refetchAlumni,
        refetchEmployment,
    };
};