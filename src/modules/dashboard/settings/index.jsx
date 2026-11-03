"use client";

import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import { useEffect, useState } from "react";
import z from "zod";
import { api } from "../../../../convex/_generated/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AlertCircle, Loader2, User } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const usernameSchema = z.object({
    username: z
        .string()
        .min(3, "Username Must Be At Least 3 Characters")
        .max(20, "Username Must Be Less Than 20 Characters")
        .regex(
            /^[a-zA-Z0-9_-]+$/,
            "Username Can Only Contain Letters, Numbers, Underscores, And Hyphens",
        ),
});

export function Settings() {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { data: currentUser, isLoading } = useConvexQuery(
        api.users.getCurrentUser,
    );
    const updateUsername = useConvexMutation(api.users.updateUsername);

    // Form setup
    const form = useForm({
        resolver: zodResolver(usernameSchema),
        defaultValues: {
            username: "",
        },
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = form;

    useEffect(() => {
        if (currentUser) {
            reset({
                username: currentUser.username || "",
            });
        }
    }, [currentUser, reset]);

    const onSubmit = async (data) => {
        setIsSubmitting(true);

        try {
            await updateUsername.mutate({
                username: data.username,
            });

            toast.success("Username Updated Successfully!");
        } catch (error) {
            toast.error(error.message || "Failed To Update Username");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-purple-400 mx-auto" />
                    <p className="text-slate-400 mt-4">Loading Settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 p-4 lg:p-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold gradient-text-primary">
                    Settings
                </h1>
                <p className="text-slate-400 mt-2">
                    Manage Your Profile And Account Preferences
                </p>
            </div>

            {/* Username Settings */}
            <Card className="card-glass max-w-2xl">
                <CardHeader>
                    <CardTitle className="text-white flex items-center">
                        <User className="h-5 w-5 mr-2" />
                        Username Settings
                    </CardTitle>
                    <CardDescription>
                        Set Your Unique Username For Your Public Profile
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                    >
                        {/* Username */}
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-white">
                                Username
                            </Label>
                            <Input
                                id="username"
                                {...register("username")}
                                placeholder="Enter Your Username"
                                className="bg-slate-800 border-slate-600 text-white"
                            />

                            {/* Current Username */}
                            {currentUser?.username && (
                                <div className="text-sm text-slate-400">
                                    Current Username:{" "}
                                    <span className="text-white">
                                        @{currentUser.username}
                                    </span>
                                </div>
                            )}

                            {/* Username Help */}
                            <div className="text-xs text-slate-500">
                                3-20 Characters, Letters, Numbers, Underscores,
                                And Hyphens Only
                            </div>

                            {errors.username && (
                                <p className="text-red-400 text-sm flex items-center">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    {errors.username.message}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                variant="primary"
                                className="w-full sm:w-auto"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    "Update Username"
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
