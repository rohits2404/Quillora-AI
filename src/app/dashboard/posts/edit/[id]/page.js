import { EditPost } from "@/modules/dashboard/posts/edit";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const EditPostPage = async () => {
    const { isAuthenticated } = await auth();

    if (!isAuthenticated) {
        redirect("/sign-in");
    }

    return <EditPost />;
};

export default EditPostPage;
