import {
    Avatar,
    AvatarImage,
    Button,
    Card,
    CardHeader,
    CardTitle,
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
    FileInput,
    FileUploader,
    FileUploaderItem,
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
    Label,
    ScrollArea,
    Skeleton
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { TableType } from "@/types/dev.types";
import { supabaseClient } from "@/utility";
import { zodResolver } from "@hookform/resolvers/zod";
import { DashIcon, Link1Icon, Pencil1Icon } from "@radix-ui/react-icons";
import { useGetIdentity, useList, useOne, useUpdate } from "@refinedev/core";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useMediaQuery } from "usehooks-ts";
import * as z from "zod";




const useProfileData = () => {
    const { data: identity, isLoading: isIdentityLoading, isError: isIdentityError } = useGetIdentity<TableType<"users">>();

    const { data: alumniData, isLoading: isAlumniLoading, isError: isAlumniError, refetch: refetchAlumni } = useOne<TableType<"alumni">, any>({
        resource: "alumni",
        id: identity?.id,
        queryOptions: {
            enabled: !!identity?.id,
        },
    });

    const alumni = alumniData?.data;

    const { data: degreeData, isLoading: isDegreeLoading, isError: isDegreeError } = useOne<TableType<"degrees">, any>({
        resource: "degrees",
        id: alumni?.degree_id || 0,
        queryOptions: {
            enabled: !!alumni?.degree_id,
        },
    });

    const degree = degreeData?.data;

    const { data: contactSocialsData, isLoading: isContactSocialsLoading, isError: isContactSocialsError } = useList<TableType<"contact_socials">, any>({
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

    const contactSocials = contactSocialsData?.data;

    const { data: employmentHistoryData, isLoading: isEmploymentLoading, isError: isEmploymentError, refetch: refetchEmployment } = useList<TableType<"employment_history">, any>({
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


type ProfileData = ReturnType<typeof useProfileData>;

const ProfileContext = createContext<ProfileData | undefined>(undefined);

const useProfileContext = () => {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error("useProfileContext must be used within a ProfileProvider");
    }
    return context;
};


const formSchema = z.object({
    first_name: z.string().min(1).max(100),
    middle_name: z.string().max(100).nullable(),
    last_name: z.string().min(1).max(100),
    birth_date: z.string().nullable(),
    year_batch: z.number().nullable(),
    year_graduation: z.number().nullable(),
    profile_description: z.string().max(150).nullable(),
    location: z.string().max(255).nullable(),
});

type FormValues = z.infer<typeof formSchema>;

const useProfileForm = (userId: string, initialData: Partial<FormValues>, previousProfilePicture: string | null) => {
    const { mutateAsync: updateProfile, isLoading: isUpdating } = useUpdate<FormValues>({
        resource: "alumni",
    });

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData,
    });

    console.log(form.formState.errors);

    const handleProfileUpdate = useCallback(async (values: FormValues) => {
        try {
            await updateProfile(
                { id: userId, values },
            );
            toast.success("Profile information updated successfully!");
        } catch (error) {
            console.error("Error updating profile information:", error);
            toast.error("Failed to update profile information. Please try again.");
        }
    }, [updateProfile, userId]);

    const handleProfilePictureUpload = useCallback(async (file: File) => {
        try {
            const path = `${userId}/${new Date().getTime()}`;
            const { error } = await supabaseClient.storage
                .from("profile_pictures")
                .upload(path, file, { upsert: true });
            if (error) throw error;

            const { data: publicUrlData } = supabaseClient.storage
                .from("profile_pictures")
                .getPublicUrl(path);

            if (!publicUrlData?.publicUrl) {
                throw new Error("Failed to retrieve public URL after upload.");
            }

            await updateProfile(
                {
                    id: userId,
                    values: { profile_picture: publicUrlData.publicUrl },
                },
            );
            toast.success("Profile picture updated successfully!");


            if (previousProfilePicture && previousProfilePicture !== publicUrlData.publicUrl) {
                try {
                    const url = new URL(previousProfilePicture);
                    const pathname = url.pathname.replace('/storage/v1/object/public/', '');

                    const { error: deleteError } = await supabaseClient.storage
                        .from("profile_pictures")
                        .remove([pathname]);

                    if (deleteError) {
                        console.error("Error deleting old profile picture:", deleteError);
                        toast.error("Profile picture updated, but failed to delete the old one.");
                    }
                } catch (deleteError) {
                    console.error("Error parsing old profile picture URL:", deleteError);
                    toast.error("Profile picture updated, but failed to process the old one.");
                }
            }
        } catch (error) {
            console.error("Error uploading profile picture:", error);
            toast.error("Failed to update profile picture. Please try again.");
        }
    }, [updateProfile, userId, previousProfilePicture]);

    return { form, handleProfileUpdate, handleProfilePictureUpload, isUpdating };
};


const InfoItem: React.FC<{ label: React.ReactNode; value: React.ReactNode }> = ({ label, value }) => (
    <div className="flex justify-between">
        <span>{label}</span>
        <span>{value}</span>
    </div>
);


const ProfileForm: React.FC<{
    className?: string;
    userId: string;
    form: ReturnType<typeof useForm<FormValues>>;
    onProfilePictureUpload: (file: File) => Promise<void>;
    onProfileUpdate: (values: FormValues) => Promise<void>;
    isUpdating: boolean;
    profilePlaceholder: string;
    onClose: () => void;
}> = React.memo(({ className, userId, form, onProfilePictureUpload, onProfileUpdate, isUpdating, profilePlaceholder, onClose }) => {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    useEffect(() => {
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreviewUrl(objectUrl);


            return () => URL.revokeObjectURL(objectUrl);
        }
        setPreviewUrl(null);
    }, [file]);

    const onSubmit = async (values: FormValues) => {
        const updatedValues = {
            ...values,
            year_batch: values.year_batch ? Number(values.year_batch) : null,
            year_graduation: values.year_graduation ? Number(values.year_graduation) : null,
        };

        if (file) {
            setIsUploading(true);
            try {
                await onProfilePictureUpload(file);
            } catch (error) {
                console.error("Error uploading profile picture:", error);
            } finally {
                setIsUploading(false);
            }
        }
        await onProfileUpdate(updatedValues);
        onClose();
    };

    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    const handleFileChange = useCallback((files: File[] | null) => {
        if (files && files.length > 0) {
            const selectedFile = files[0];
            if (selectedFile.size > MAX_FILE_SIZE) {
                toast.error("File size exceeds the 5MB limit. Please choose a smaller file.");
                return;
            }
            setFile(selectedFile);
        } else {
            setFile(null);
        }
    }, []);

    const formFields = useMemo(() => [
        { name: 'first_name', label: 'First Name', type: 'text' },
        { name: 'middle_name', label: 'Middle Name', type: 'text' },
        { name: 'last_name', label: 'Last Name', type: 'text' },
        { name: 'birth_date', label: 'Birth Date', type: 'date' },
        { name: 'year_batch', label: 'Year Batch', type: 'number' },
        { name: 'year_graduation', label: 'Year of Graduation', type: 'number' },
        { name: 'profile_description', label: 'Profile Description', type: 'text' },
        { name: 'location', label: 'Location', type: 'text' },
    ], []);

    return (
        <ScrollArea className="h-[80vh] pb-10">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-2 mx-3", className)}>
                    <div>
                        <Label htmlFor="profile-picture">Profile Picture</Label>
                        <FileUploader
                            value={file ? [file] : null}
                            onValueChange={handleFileChange}
                            dropzoneOptions={{ maxFiles: 1, accept: { 'image/*': ['.png', '.jpg', '.jpeg'] } }}
                        >
                            <FileInput>
                                <div className="flex flex-col items-center justify-center py-5 text-center">
                                    <Avatar className="w-24 h-24 mb-4">
                                        <AvatarImage src={previewUrl || profilePlaceholder} alt="Profile" />
                                    </Avatar>
                                    {file ? (
                                        <FileUploaderItem index={0}>{file.name}</FileUploaderItem>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">
                                            Drag & drop or click to select a new profile picture
                                        </p>
                                    )}
                                </div>
                            </FileInput>
                        </FileUploader>
                    </div>
                    {formFields.map(({ name, label, type }) => (
                        <FormField
                            key={name}
                            control={form.control}
                            name={name as keyof FormValues}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{label}</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            type={type}
                                            value={field.value ?? ''}
                                            onChange={(e) => {
                                                const value = e.target.value;
                                                if (type === 'number') {
                                                    field.onChange(value === '' ? null : Number(value));
                                                } else {
                                                    field.onChange(value);
                                                }
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ))}
                    <Button type="submit" className="w-full mt-4" disabled={isUploading || isUpdating}>
                        {isUploading ? "Uploading..." : isUpdating ? "Saving..." : "Save changes"}
                    </Button>
                </form>
            </Form>
        </ScrollArea>
    );
});


const EditProfileDialog: React.FC = React.memo(() => {
    const { alumni } = useProfileContext();
    const userId = alumni?.id || '';
    const profilePlaceholder = alumni?.profile_picture || 'https://via.placeholder.com/150';
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const { form, handleProfileUpdate, handleProfilePictureUpload, isUpdating } = useProfileForm(userId, {
        first_name: alumni?.first_name ?? '',
        middle_name: alumni?.middle_name ?? undefined,
        last_name: alumni?.last_name ?? '',
        birth_date: alumni?.birth_date ?? null,
        profile_description: alumni?.profile_description ?? undefined,
        location: alumni?.location ?? undefined,
        year_batch: alumni?.year_batch ?? undefined,
        year_graduation: alumni?.year_graduation ?? undefined,
    }, alumni?.profile_picture ?? null);

    const [isOpen, setIsOpen] = useState(false);
    const dialogProps = useMemo(() => ({
        open: isOpen,
        onOpenChange: setIsOpen,
    }), [isOpen]);

    const content = (
        <ProfileForm
            userId={userId}
            form={form}
            onProfileUpdate={handleProfileUpdate}
            onProfilePictureUpload={handleProfilePictureUpload}
            isUpdating={isUpdating}
            profilePlaceholder={profilePlaceholder}
            onClose={() => setIsOpen(false)}
        />
    );

    if (isDesktop) {
        return (
            <Dialog {...dialogProps}>
                <DialogTrigger asChild>
                    <Button variant="outline">Edit Profile</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                        <DialogDescription>
                            Update your profile information and picture. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    {content}
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer {...dialogProps}>
            <DrawerTrigger asChild>
                <Button variant="outline" size="sm">Edit Profile</Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left">
                    <DrawerTitle>Edit Profile</DrawerTitle>
                    <DrawerDescription>
                        Update your profile information and picture. Click save when you're done.
                    </DrawerDescription>
                </DrawerHeader>
                {React.cloneElement(content, { className: "px-4" })}
            </DrawerContent>
        </Drawer>
    );
});


const ProfileInfoCard: React.FC = () => {
    const { alumni, isAlumniLoading, isAlumniError, degree } = useProfileContext();
    const [profilePicture, setProfilePicture] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (alumni) {
            setProfilePicture(alumni.profile_picture || 'https://via.placeholder.com/150');
        }
    }, [alumni]);

    return (
        <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-start">
                {isAlumniLoading ? (
                    <Skeleton className="w-24 h-24 mb-4 rounded-full sm:mb-0 sm:mr-4" />
                ) : isAlumniError ? (
                    <ErrorPlaceholder message="Failed to load alumni information." />
                ) : alumni ? (
                    <>
                        <div className="relative mb-4 sm:mb-0 sm:mr-4">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Avatar className="w-24 h-24 border-2 cursor-pointer border-border">
                                        <AvatarImage src={profilePicture} alt={`${alumni.first_name} ${alumni.last_name}`} className="object-cover" />
                                    </Avatar>
                                </DialogTrigger>
                                <DialogClose>
                                    <DialogContent className="flex flex-row items-center justify-center w-full h-full bg-transparent border-none rounded-none max-w-none">
                                        <Avatar className="w-72 h-72">
                                            <AvatarImage src={profilePicture} alt={`${alumni.first_name} ${alumni.last_name}`} className="object-cover" />
                                        </Avatar>
                                    </DialogContent>
                                </DialogClose>
                            </Dialog>
                        </div>
                        <div className="flex-1 w-full">
                            <div className="flex flex-row items-start justify-between w-full gap-2 sm:flex-row sm:items-center">
                                <CardTitle className="inline-flex items-center gap-2 text-xl font-bold sm:text-2xl">
                                    {`${alumni.first_name} ${alumni.middle_name ? `${alumni.middle_name} ` : ''}${alumni.last_name}`}
                                </CardTitle>
                                <EditProfileDialog />
                            </div>
                            <h1 className="flex items-center mt-2 text-sm">
                                <p>{degree?.degree_name || 'N/A'}</p>
                            </h1>
                            <p className="mt-2 text-sm text-muted-foreground">
                                {alumni.profile_description || 'No description provided.'}
                            </p>
                        </div>
                    </>
                ) : (
                    <NoDataPlaceholder message="No alumni information available." />
                )}
            </CardHeader>
        </Card>
    );
};


const ContactSocialsCard: React.FC = () => {
    const { contactSocials, isContactSocialsLoading, isContactSocialsError } = useProfileContext();

    return (
        <Card>
            <CardHeader>
                {isContactSocialsLoading ? (
                    <div className="space-y-4">
                        <Skeleton className="w-full h-4" />
                        <Skeleton className="w-3/4 h-4" />
                    </div>
                ) : isContactSocialsError ? (
                    <ErrorPlaceholder message="Failed to load contact socials." />
                ) : contactSocials && contactSocials.length > 0 ? (
                    <div className="flex flex-col space-y-4">
                        {contactSocials.map((social) => (
                            <InfoItem
                                key={social.id}
                                label={<p className="inline-flex items-center gap-2 text-md"><Link1Icon className="mb-1" />{social.platform_name}</p>}
                                value={
                                    <div className="inline-flex items-center gap-2 text-sm break-all">
                                        <a href={social.link} target="_blank" rel="noopener noreferrer" className="hover:underline">
                                            {social.link}
                                        </a>
                                    </div>
                                }
                            />
                        ))}
                    </div>
                ) : (
                    <NoDataPlaceholder message="No contact socials available." />
                )}
            </CardHeader>
        </Card>
    );
};


const EmploymentHistoryCard: React.FC = () => {
    const { employmentHistory, isEmploymentLoading, isEmploymentError } = useProfileContext();

    return (
        <Card >
            <CardHeader>
                <div className="flex flex-col gap-2">
                    {employmentHistory && employmentHistory.length > 0 ? (
                        <div className="flex items-center justify-between">
                            <CardTitle className="font-semibold">Employment History</CardTitle>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => console.log('add employment')}
                            >
                                <Pencil1Icon className="w-4 h-4" aria-hidden="true" />
                            </Button>
                        </div>
                    ) : null}
                    <div>
                        {isEmploymentLoading ? (
                            <div className="space-y-4">
                                <Skeleton className="w-full h-4" />
                                <Skeleton className="w-3/4 h-4" />
                            </div>
                        ) : isEmploymentError ? (
                            <ErrorPlaceholder message="Failed to load employment history." />
                        ) : employmentHistory && employmentHistory.length > 0 ? (
                            <div className="relative">
                                <div className="absolute top-1 bottom-0 left-[7px] w-[1.5px] bg-border" />
                                {employmentHistory.map((job) => (
                                    <div key={job.id} className="relative pl-12 mb-6">
                                        <div className="absolute left-0.5 top-1 w-3 h-3 rounded-full bg-accent" />
                                        <div className="text-sm text-gray-500">{new Date(job.start_date || '').getFullYear()}</div>
                                        <div className="font-semibold">{job.company_name}</div>
                                        <div className="flex flex-wrap items-center text-sm text-gray-600">
                                            <span>{new Date(job.start_date || '').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                            <DashIcon className="mx-1" />
                                            <span>{job.end_date ? new Date(job.end_date || '').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Present'}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <NoDataPlaceholder message="No employment history available." />
                        )}
                    </div>
                </div>
            </CardHeader>
        </Card>
    );
};


const ErrorPlaceholder: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex items-center justify-center p-4 text-red-500">
        {message}
    </div>
);


const NoDataPlaceholder: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex items-center justify-center p-4 text-gray-500">
        {message}
    </div>
);


const ProfilePage: React.FC = () => {
    const profileData = useProfileData();

    return (
        <ProfileContext.Provider value={profileData}>
            <div className="flex flex-col gap-4">
                <ProfileInfoCard />
                <ContactSocialsCard />
                <EmploymentHistoryCard />
            </div>
        </ProfileContext.Provider>
    );
};

export default ProfilePage;
