"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import {
    Button,
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    Input,
    PasswordInput
} from "@/components/ui";

import {
    useActiveAuthProvider,
    useLink,
    useLogin,
    useRouterContext,
    useRouterType,
    useTranslate
} from "@refinedev/core";

import { cn } from "@/lib/utils";
import { ChevronLeftIcon, EyeIcon } from "lucide-react";

type DivPropsType = React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
>;
type FormPropsType = React.DetailedHTMLProps<
    React.FormHTMLAttributes<HTMLFormElement>,
    HTMLFormElement
>;

type LoginProps = {
    wrapperProps?: DivPropsType;
    contentProps?: DivPropsType;
    formProps?: FormPropsType;
    title?: string;
    renderContent?: (content: React.ReactNode, title?: string) => React.ReactNode;
};

const formSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

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

enum LoginStep {
    Welcome = 0,
    Login = 1,
}

export const LoginPage: React.FC<LoginProps> = ({
    wrapperProps,
    contentProps,
    renderContent,
    formProps,
    title = "Log Back In",
}) => {
    const routerType = useRouterType();
    const Link = useLink();
    const { Link: LegacyLink } = useRouterContext();

    const ActiveLink = routerType === "legacy" ? LegacyLink : Link;

    const translate = useTranslate();

    const renderLink = (link: string, text?: string, className?: string) => (
        <ActiveLink to={link} className={cn("text-foreground hover:underline", className)}>
            {text}
        </ActiveLink>
    );

    const authProvider = useActiveAuthProvider();
    const { mutate: login, isLoading } = useLogin({
        v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onBlur",
    });

    const [currentStep, setCurrentStep] = useState<LoginStep>(LoginStep.Welcome);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            login({
                email: values.email,
                password: values.password,
            }, {
                onError: (error: any) => {
                    toast.error(error?.message || "Failed to login.");
                },
            });
        } catch (error) {
            console.error("Form submission error", error);
            toast.error("Failed to submit the form. Please try again.");
        }
    };

    const handleGetStarted = () => {
        setCurrentStep(LoginStep.Login);
    };

    const renderWelcome = () => (
        <motion.div
            className="flex p-6 md:min-h-screen"
            initial="initial"
            animate="in"
            exit="out"
            variants={{
                initial: { opacity: 0, filter: "blur(4px)", scale: 0.99, y: -5 },
                in: { opacity: 1, filter: "blur(0px)", scale: 1, y: 0 },
                out: { opacity: 0, filter: "blur(4px)", scale: 0.99, y: 5 },
            }}
            transition={{
                type: "tween",
                ease: "anticipate",
                duration: 0.5,
            }}
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
                        Reconnect with your Alumni.
                    </motion.h1>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Button
                            onClick={handleGetStarted}
                            variant="outline"
                            className="flex items-center justify-center w-full py-3 mb-4 rounded-full"
                        >
                            Continue with Email
                        </Button>
                    </motion.div>
                    <motion.div
                        className="text-sm text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <span className="">
                            Don't have an account?{" "}
                        </span>
                        {renderLink("/register", "Register here", "text-accent hover:underline")}
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

    const renderLoginForm = () => (
        <motion.div
            key="form"
            initial="initial"
            animate="in"
            exit="out"
            variants={{
                initial: { opacity: 0, x: -20 },
                in: { opacity: 1, x: 0 },
                out: { opacity: 0, x: 20 },
            }}
            transition={{
                type: "tween",
                ease: "anticipate",
                duration: 0.5,
            }}
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
                            <h1 className="text-3xl font-bold">{title}</h1>
                        </motion.div>
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
                    </div>
                    <motion.div
                        className="flex justify-between"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <Button type="button" variant="secondary" onClick={() => setCurrentStep(LoginStep.Welcome)} className="mr-4">
                            <ChevronLeftIcon className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                        <Button type="submit" disabled={isLoading} className="ml-auto">
                            {isLoading ? "Logging in..." : "Login"}
                        </Button>
                    </motion.div>
                </form>
            </Form>
        </motion.div>
    );

    const content = (
        <div className="h-full sm:h-auto" {...contentProps}>
            <AnimatePresence mode="wait">
                {currentStep === LoginStep.Welcome ? renderWelcome() : renderLoginForm()}
            </AnimatePresence>
        </div>
    );

    return (
        <div className="h-full overflow-x-hidden" {...wrapperProps}>
            {renderContent ? renderContent(content, title) : content}
        </div>
    );
};