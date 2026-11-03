import { Settings } from "@/modules/dashboard/settings";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/dist/server/api-utils";
import React from "react";

const DashbaordSettingsPage = async () => {
    const { isAuthenticated } = await auth();

    if (!isAuthenticated) {
        redirect("/sign-in");
    }

    return <Settings />;
};

export default DashbaordSettingsPage;
