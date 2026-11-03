import { CreatePost } from "@/modules/dashboard/create";
import { auth } from "@clerk/nextjs/server";
import React from "react";

const CreatePostPage = async () => {
    const { isAuthenticated } = await auth();

    if (!isAuthenticated) {
        redirect("/sign-in");
    }

    return <CreatePost />;
};

export default CreatePostPage;
