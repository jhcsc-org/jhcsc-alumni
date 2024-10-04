import { Button } from "@/components/ui";
import { useGetIdentity, useNavigation } from "@refinedev/core";
import { User } from "@supabase/supabase-js";
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from "react-router-dom";

const variants = {
    container: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 1 }
    },
    title: {
        initial: { y: -15, opacity: 0, filter: "blur(10px)" },
        animate: { y: 0, opacity: 1, filter: "blur(0px)" },
        transition: { delay: 0.8, duration: 0.8, stiffness: 100 }
    },
    buttonContainer: {
        initial: { y: -15, opacity: 0, filter: "blur(10px)" },
        animate: { y: 0, opacity: 1, filter: "blur(0px)" },
        transition: { delay: 1, duration: 1, stiffness: 100 }
    },
    button: {
        initial: { y: -15, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { delay: 1, duration: 1, stiffness: 100 }
    }
};

const WelcomeContent: React.FC = () => {
    const { data, isLoading } = useGetIdentity<User>();
    const [name, setName] = useState<string | undefined>(undefined);
    const [searchParams] = useSearchParams();
    const navigate = useNavigation();

    useEffect(() => {
        if (!isLoading && data?.user_metadata.first_name) {
            setName(data.user_metadata.first_name);
        }
    }, [isLoading, data]);

    if (isLoading || !name) {
        return (
            <div className="absolute flex items-center justify-center w-screen h-screen bg-background">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <motion.div
            className="absolute flex flex-col items-start justify-center w-screen h-screen p-4 bg-background"
            {...variants.container}
        >
            <motion.h1
                className="mx-auto mb-6 text-2xl text-center sm:mb-8 sm:text-3xl md:text-4xl"
                {...variants.title}
            >
                Hi {name}!<br/>Glad that you're here.
            </motion.h1>
            <motion.div
                className="flex flex-col mx-auto space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4"
                {...variants.buttonContainer}
            >
                <Button variant="outline" onClick={() => navigate.push("/")} className="w-full px-8 py-2 bg-transparent sm:w-auto">
                    Continue
                </Button>
            </motion.div>
        </motion.div>
    );
};

const WelcomePage: React.FC = () => {
    return <WelcomeContent />;
};

export { WelcomeContent, WelcomePage };

