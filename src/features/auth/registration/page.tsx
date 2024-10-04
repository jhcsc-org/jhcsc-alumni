"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import {
  Button,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  PasswordInput,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Textarea
} from "@/components/ui";

import {
  HttpError,
  RegisterPageProps,
  useActiveAuthProvider,
  useLink,
  useList,
  useRegister,
  useRouterContext,
  useRouterType,
  useTranslate
} from "@refinedev/core";

import {
  CheckIcon,
  ChevronLeftIcon,
  CloudUpload,
  Paperclip
} from "lucide-react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { TableType } from "@/types/dev.types";
import { supabaseClient } from "@/utility";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { EyeIcon } from "lucide-react";

type DivPropsType = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;
type FormPropsType = React.DetailedHTMLProps<
  React.FormHTMLAttributes<HTMLFormElement>,
  HTMLFormElement
>;

type RegisterProps = RegisterPageProps<
  DivPropsType,
  DivPropsType,
  FormPropsType
>;

const formSchema = z
  .object({
    email: z.string().email({ message: "Invalid email address" }),
    first_name: z.string().min(1, { message: "First name is required" }),
    middle_name: z.string().optional(),
    last_name: z.string().min(1, { message: "Last name is required" }),
    birth_date: z.string().refine((date) => {
      const parsedDate = new Date(date);
      return !Number.isNaN(parsedDate.getTime()) && parsedDate <= new Date() && calculateAge(parsedDate) >= 13;
    }, { message: "You must be at least 13 years old and birthdate cannot be in the future" }),
    year_batch: z.string().min(4, { message: "Batch year must be 4 digits" }),
    year_graduation: z.string().min(4, { message: "Graduation year must be 4 digits" }),
    degree_id: z.string(),
    location: z.string(),
    name_13: z.string().optional(),
    profile_description: z.string().optional(),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    confirm_password: z.string().min(6, { message: "Confirm Password must be at least 6 characters" }),
    profile_picture: z.string().optional(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

const FormInput: React.FC<{
  control: any;
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  type?: string;
  as?: React.ElementType;
  className?: string;
}> = ({
  control,
  name,
  label,
  placeholder,
  required = false,
  type = "text",
  as = Input,
  className,
}) => (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="mb-4">
          <FormLabel className="text-sm font-medium ">{label}</FormLabel>
          <FormControl>
            {as === PasswordInput ? (
              <div className="relative">
                <PasswordInput
                  placeholder={placeholder}
                  required={required}
                  {...field}
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => {/* Toggle password visibility */ }}
                >
                  {/* Eye icon for password visibility */}
                  <EyeIcon className="w-5 h-5 " />
                </button>
              </div>
            ) : (
              <Input
                placeholder={placeholder}
                required={required}
                type={type}
                {...field}
                className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            )}
          </FormControl>
          <FormMessage className="mt-1 text-xs text-red-500" />
        </FormItem>
      )}
    />
  );

enum RegistrationStep {
  PersonalInfo = 0,
  AcademicInfo = 1,
  ProfileDetails = 2,
  AccountSetup = 3,
  Review = 4,
}

const ReviewSection: React.FC<{ formValues: z.infer<typeof formSchema>, files: File[] | null }> = ({ formValues, files }) => {
  const { first_name, middle_name, last_name, birth_date: birthdate, year_batch, year_graduation, degree_id, location, profile_description, email } = formValues;
  const degreeLabel = "N/A";

  const renderSection = (title: string, items: { label: string; value: string | number | null }[]) => (
    <div className="text-sm">
      <h3 className="mb-2 font-semibold">{title}</h3>
      <dl className="grid grid-cols-4 gap-2">
        {items.map(({ label, value }, index) => (
          <div className="col-span-2" key={index}>
            <dt className="text-muted-foreground">{label}</dt>
            <dd>{value || "N/A"}</dd>
          </div>
        ))}
      </dl>
    </div>
  );

  return (
    <div className="space-y-4">
      {renderSection("Personal Information", [
        { label: "First Name", value: first_name },
        { label: "Middle Name", value: middle_name || null },
        { label: "Last Name", value: last_name },
        {
          label: "Birthdate", value: birthdate ? new Date(birthdate).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          }) : null
        },
      ])}
      <Separator />
      {renderSection("Academic Information", [
        { label: "Batch Year", value: year_batch },
        { label: "Graduation Year", value: year_graduation },
        { label: "Degree", value: degreeLabel },
      ])}
      <Separator />
      {renderSection("Profile Details", [
        { label: "Location", value: location },
        { label: "Description", value: profile_description || null },
      ])}
      <div>
        <h3 className="mb-2 text-sm font-semibold">Profile Pictures</h3>
        {files && files.length > 0 ? (
          <ul className="list-disc list-inside">
            {files.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No profile pictures uploaded</p>
        )}
      </div>
      <Separator />
      {renderSection("Contact Information", [
        { label: "Email", value: email },
      ])}
    </div>
  );
};

const pageVariants = {
  initial: { opacity: 0, filter: "blur(4px)", scale: 0.99, y: -5 },
  in: { opacity: 1, filter: "blur(0px)", scale: 1, y: 0 },
  out: { opacity: 0, filter: "blur(4px)", scale: 0.99, y: 5 },
};

const pageTransition = {
  ease: "anticipate",
  duration: 0.5,
};

const buttonVariants = {
  hover: { scale: 1 },
  tap: { scale: 1 },
};

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 25 : -25,
    opacity: 0,
    filter: "blur(4px)",
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  }),
  center: {
    x: 0,
    filter: "blur(0px)",
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 25 : -25,
    filter: "blur(4px)",
    opacity: 0,
  }),
};

export const RegisterForm: React.FC<RegisterProps> = ({
  providers,
  loginLink,
  wrapperProps,
  contentProps,
  renderContent,
  formProps,
  title = undefined,
  hideForm,
}) => {
  const routerType = useRouterType();
  const Link = useLink();
  const { Link: LegacyLink } = useRouterContext();

  const ActiveLink = routerType === "legacy" ? LegacyLink : Link;

  const translate = useTranslate();

  const authProvider = useActiveAuthProvider();
  const { mutate: register, isLoading } = useRegister({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });

  const [files, setFiles] = useState<File[] | null>(null);
  const [currentStep, setCurrentStep] = useState<RegistrationStep>(RegistrationStep.PersonalInfo);
  const [direction, setDirection] = useState(0);

  const dropZoneConfig = {
    maxFiles: 5,
    maxSize: 1024 * 1024 * 4,
    multiple: true,
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
  });

  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data: degreeData, isLoading: isLoadingDegree, isError: isErrorDegree } = useList<TableType<"degrees">, HttpError>({
    resource: "degrees",
    meta: {
      fields: ["id", "degree_name", "degree_category_id"]
    },
    filters: [
      {
        field: "degree_name",
        operator: "contains",
        value: searchQuery,
      },
    ],
  });

  const { data: categoryData, isLoading: isLoadingCategory, isError: isErrorCategory } = useList<TableType<"degree_categories">, HttpError>({
    resource: "degree_categories",
    meta: {
      fields: ["id", "category_name"]
    },
  });

  const listOfDegrees = degreeData?.data ?? [];
  const listOfCategories = categoryData?.data ?? [];

  const getDegreeLabel = (degreeId: string) => {
    const degree = listOfDegrees.find((d) => d.id.toString() === degreeId);
    const category = listOfCategories.find((c) => c.id === degree?.degree_category_id);
    return degree && category ? `${category.category_name} in ${degree.degree_name}` : "N/A";
  };

  const [registrationComplete, setRegistrationComplete] = useState(false); // Add this line

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const formData = new FormData();
      for (const [key, value] of Object.entries(values)) {
        formData.append(key, value || "");
      }

      if (files && files.length > 0) {
        for (const [index, file] of files.entries()) {
          formData.append(`profile_picture_${index}`, file);
        }
      }
      register({
        email: values.email,
        password: values.password,
        options: {
          data: {
            ...values,
            email: undefined,
            password: undefined,
            confirm_password: undefined,
            birth_date: new Date(values.birth_date).toISOString().split('T')[0],
          }
        },
      }, {
        onError: (error: any) => {
          toast.error(error?.message || "Failed to register.");
        },
      });
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  };

  const renderLink = (link: string, text?: string, className?: string) => (
    <ActiveLink to={link} className={cn("text-foreground hover:underline", className)}>
      {text}
    </ActiveLink>
  );

  const test = async () => {
    const { data, error } = await supabaseClient.rpc("get_user_info", {
      user_id: "user_id"
    });
    console.log(data);
  }

  const [showForm, setShowForm] = useState(false);

  const handleGetStarted = () => {
    setShowForm(true);
    setCurrentStep(RegistrationStep.PersonalInfo);
  };

  const handleBackToGetStarted = () => {
    setShowForm(false);
    setCurrentStep(RegistrationStep.PersonalInfo);
    form.reset();
  };

  const renderGetStarted = () => {
    return (
      <motion.div
        className="flex p-6 md:min-h-screen"
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
      >
        <div className="hidden rounded-lg lg:block lg:w-1/2 bg-gradient-to-br from-green-300 via-green-700 to-lime-500">
        </div>
        <div className="flex items-center justify-center w-full p-12 lg:w-1/2">
          <div className="flex flex-col items-center justify-center w-full max-w-md">
            <i className="text-7xl ph-light ph-graph dark:text-foreground" />
            <motion.h1
              className="mb-8 text-4xl font-medium text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Join the Alumni Network.
            </motion.h1>
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Button
                onClick={handleGetStarted}
                variant="outline"
                className="flex items-center justify-center w-full py-3 mb-4 rounded-full"
              >
                Get Started
              </Button>
            </motion.div>
            <motion.div
              className="text-sm text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <span className="">Already have an account? </span>
              {renderLink("/login", "Sign in here", "text-accent hover:underline")}
            </motion.div>
            <motion.div
              className="mt-8 text-xs text-center "
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {renderLink("#", "Terms of Use", "hover:underline")} | {renderLink("#", "Privacy Policy", "hover:underline")}
            </motion.div>
          </div>
        </div>
      </motion.div>
    );
  };

  const getStepContent = (step: RegistrationStep) => {
    switch (step) {
      case RegistrationStep.PersonalInfo:
        return (
          <div className="flex flex-col items-start justify-center w-full">
            <div className="grid w-full grid-cols-1">
              <FormInput
                control={form.control}
                name="first_name"
                label="First Name"
                placeholder="Enter your first name"
                required
              />
              <FormInput
                control={form.control}
                name="middle_name"
                label="Middle Name"
                placeholder="Enter your middle name"
              />
              <FormInput
                control={form.control}
                name="last_name"
                label="Last Name"
                placeholder="Enter your last name"
                required
              />
            </div>
            <div className="w-full mt-4">
              <FormField
                control={form.control}
                name="birth_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Birthdate</FormLabel>
                    <div className="grid grid-cols-3 gap-2">
                      <Select
                        onValueChange={(value) => {
                          const currentDate = field.value ? new Date(field.value) : new Date();
                          currentDate.setMonth(months.indexOf(value));
                          field.onChange(currentDate.toISOString());
                        }}
                        value={field.value ? months[new Date(field.value).getMonth()] : undefined}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Month" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {months.map((month) => (
                            <SelectItem key={month} value={month}>
                              {month}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormControl>
                        <Select
                          onValueChange={(value) => {
                            const day = Number.parseInt(value, 10);
                            const currentDate = field.value ? new Date(field.value) : new Date();
                            currentDate.setDate(day);
                            field.onChange(currentDate.toISOString());
                          }}
                          value={field.value ? new Date(field.value).getDate().toString() : undefined}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="DD" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Array.from({ length: 31 }, (_, i) => (i + 1).toString()).map((day) => (
                              <SelectItem key={day} value={day}>
                                {day}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="YYYY"
                          className="w-full text-sm"
                          onChange={(e) => {
                            const year = Number.parseInt(e.target.value, 10);
                            const currentDate = field.value ? new Date(field.value) : new Date();
                            currentDate.setFullYear(year);
                            field.onChange(currentDate.toISOString());
                          }}
                          value={field.value ? new Date(field.value).getFullYear() : ''}
                        />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        );

      case RegistrationStep.AcademicInfo:
        return (
          <div className="flex flex-col items-start justify-center w-full">
            <div className="grid w-full grid-cols-1">
              <FormInput
                control={form.control}
                name="year_batch"
                label="Batch Year"
                placeholder="Enter your batch year"
                required
                type="number"
              />
              <FormInput
                control={form.control}
                name="year_graduation"
                label="Year of Graduation"
                placeholder="Enter your graduation year"
                required
                type="number"
              />
              {degreeSelector}
            </div>
          </div>
        );

      case RegistrationStep.ProfileDetails:
        return (
          <div className="flex flex-col items-start justify-center w-full">
            <div className="grid w-full grid-cols-1">
              <FormInput
                control={form.control}
                name="location"
                label="Location"
                placeholder="Enter your location"
                required
              />
              <FormInput
                control={form.control}
                name="profile_description"
                label="Description"
                placeholder="Tell us about yourself"
                as={Textarea}
                className="resize-none"
              />
              <FormField
                control={form.control}
                name="profile_picture"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Profile Picture</FormLabel>
                    <FormControl>
                      <FileUploader
                        value={files}
                        onValueChange={setFiles}
                        dropzoneOptions={dropZoneConfig}
                        className="relative p-4 border-2 border-gray-300 border-dashed rounded-lg"
                      >
                        <FileInput className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                          <CloudUpload className="w-6 h-6 " />
                          <span className="mt-2 ">
                            Drag & drop files here or click to upload
                          </span>
                        </FileInput>
                        <FileUploaderContent>
                          {files && files.length > 0 && (
                            <div className="mt-4 space-y-2">
                              {files.map((file, i) => (
                                <FileUploaderItem key={i} index={i}>
                                  <Paperclip className="w-4 h-4 mr-2 " />
                                  <span>{file.name}</span>
                                </FileUploaderItem>
                              ))}
                            </div>
                          )}
                        </FileUploaderContent>
                      </FileUploader>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        );

      case RegistrationStep.AccountSetup:
        return (
          <div className="flex flex-col items-start justify-center w-full">
            <div className="grid w-full grid-cols-1">
              <FormInput
                control={form.control}
                name="email"
                label="Email"
                placeholder="Enter your email"
                required
                type="email"
              />
              <FormInput
                control={form.control}
                name="password"
                label="Password"
                placeholder="Enter your password"
                required
                as={PasswordInput}
              />
              <FormInput
                control={form.control}
                name="confirm_password"
                label="Confirm Password"
                placeholder="Confirm your password"
                required
                as={PasswordInput}
              />
            </div>
          </div>
        );

      case RegistrationStep.Review:
        return (
          <div className="flex flex-col items-start justify-center w-full">
            <div className="w-full">
              <ReviewSection formValues={form.getValues()} files={files} />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const handleNext = async () => {

    let stepFields: (keyof z.infer<typeof formSchema>)[] = [];

    switch (currentStep) {
      case RegistrationStep.PersonalInfo:
        stepFields = ["first_name", "last_name", "birth_date"];
        break;
      case RegistrationStep.AcademicInfo:
        stepFields = ["year_batch", "year_graduation", "degree_id"];
        break;
      case RegistrationStep.ProfileDetails:
        stepFields = ["location"];
        break;
      case RegistrationStep.AccountSetup:
        stepFields = ["email", "password", "confirm_password"];
        break;
      default:
        stepFields = [];
    }

    const isValid = await form.trigger(stepFields);
    if (isValid) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    } else {
      toast.error("Please fix the errors before proceeding.");
    }
  };

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentStep((prev) => prev - 1);
  };

  const renderStepIndicators = () => {
    const steps = [
      "Details",
      "Academic",
      "Profile",
      "Account",
      "Review",
    ];

    return steps[currentStep];
  };

  const degreeSelector = (
    <FormField
      control={form.control}
      name="degree_id"
      render={({ field }) => {
        return (
          <FormItem className="flex flex-col">
            <FormLabel>Degree</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    // biome-ignore lint/a11y/useSemanticElements: This is a custom combobox
                    role="combobox"
                    className={cn(
                      "w-full justify-between",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value
                      ? getDegreeLabel(field.value)
                      : "Select Degree"}
                    <CaretSortIcon className="w-4 h-4 ml-2 opacity-50 shrink-0" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Search degree..."
                    className="h-9"
                    onValueChange={(value) => setSearchQuery(value)}
                  />
                  <CommandList>
                    <CommandEmpty>No degree found.</CommandEmpty>
                    <CommandGroup>
                      {isLoadingDegree ? <CommandItem>Loading...</CommandItem> : listOfDegrees.map((degree) => (
                        <CommandItem
                          value={degree.degree_name}
                          key={degree.id}
                          onSelect={() => {
                            form.setValue("degree_id", degree.id.toString())
                          }}
                        >
                          {getDegreeLabel(degree.id.toString())}
                          <CheckIcon
                            className={cn(
                              "ml-auto h-4 w-4",
                              degree.id.toString() === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormDescription>
              Select your degree program.
            </FormDescription>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );

  const content = (
    <div className="h-full sm:h-auto" {...contentProps}>
      <AnimatePresence mode="wait">
        {!showForm ? (
          renderGetStarted()
        ) : (
          <motion.div
            key="form"
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="flex flex-col items-center justify-start w-full h-full max-w-md px-8 py-12 mx-auto shadow-none"
          >
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} {...formProps} className="flex flex-col justify-between w-full h-full space-y-4">
                <div>
                  <motion.div
                    className="flex items-center justify-start mb-4"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h1 className="text-3xl font-bold">{renderStepIndicators()}</h1>
                  </motion.div>
                  <AnimatePresence custom={direction} mode="wait">
                    <motion.div
                      key={currentStep}
                      custom={direction}
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        x: { type: "spring", stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 },
                      }}
                    >
                      {getStepContent(currentStep)}
                    </motion.div>
                  </AnimatePresence>
                  {currentStep === RegistrationStep.AccountSetup && (
                    <motion.div
                      className="mt-2 text-xs "
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <p>Password must:</p>
                      <ul className="pl-5 list-disc">
                        <li>At least 8 characters</li>
                        <li>One uppercase and lowercase letter</li>
                        <li>Contains a number or special character</li>
                        <li>Passwords match</li>
                      </ul>
                    </motion.div>
                  )}
                </div>
                <motion.div
                  className="flex justify-between"
                  initial={{ opacity: 0, filter: "blur(4px)", scale: 0.99, y: -5 }}
                  animate={{ opacity: 1, filter: "blur(0px)", scale: 1, y: 0 }}
                  exit={{ opacity: 0, filter: "blur(4px)", scale: 0.99, y: 5 }}
                >
                  {currentStep === RegistrationStep.PersonalInfo && (
                    <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                      <Button type="button" variant="ghost" onClick={handleBackToGetStarted}>
                        <ChevronLeftIcon className="w-4 h-4 mr-2" />
                        Back
                      </Button>
                    </motion.div>
                  )}
                  {currentStep > RegistrationStep.PersonalInfo && (
                    <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                      <Button type="button" variant="ghost" onClick={handlePrevious}>
                        <ChevronLeftIcon className="w-4 h-4 mr-2" />
                        Previous
                      </Button>
                    </motion.div>
                  )}
                  {currentStep < RegistrationStep.Review && (
                    <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                      <Button type="button" onClick={handleNext}>
                        Next
                      </Button>
                    </motion.div>
                  )}
                  {currentStep === RegistrationStep.Review && (
                    <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                      <Button type="submit" disabled={isLoading} className="ml-auto">
                        {isLoading ? "Submitting..." : "Submit"}
                      </Button>
                    </motion.div>
                  )}
                </motion.div>
              </form>
            </Form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="h-full overflow-x-hidden" {...wrapperProps}>
      {renderContent ? renderContent(content, title) : content}
    </div>
  );
};