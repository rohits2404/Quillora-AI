"use client";

import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileText, Filter, PlusCircle, Search, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { PostCard } from "@/components/post-card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function Posts() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [selectedPost, setSelectedPost] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Data fetching
    const { data: posts, isLoading } = useConvexQuery(api.posts.getUserPosts);
    const deletePost = useConvexMutation(api.posts.deletePost);
    const duplicatePost = useConvexMutation(api.posts.duplicate);

    // Filter and sort posts
    const filteredPosts = useMemo(() => {
        if (!posts) return [];

        let filtered = posts.filter((post) => {
            // Search filter
            const matchesSearch = post.title
                .toLowerCase()
                .includes(searchQuery.toLowerCase());

            // Status filter
            const matchesStatus =
                statusFilter === "all" || post.status === statusFilter;

            return matchesSearch && matchesStatus;
        });

        // Sort posts
        filtered.sort((a, b) => {
            switch (sortBy) {
                case "newest":
                    return b.createdAt - a.createdAt;
                case "oldest":
                    return a.createdAt - b.createdAt;
                case "mostViews":
                    return b.viewCount - a.viewCount;
                case "mostLikes":
                    return b.likeCount - a.likeCount;
                case "alphabetical":
                    return a.title.localeCompare(b.title);
                default:
                    return b.createdAt - a.createdAt;
            }
        });

        return filtered;
    }, [posts, searchQuery, statusFilter, sortBy]);

    // Handle post actions
    const handleEditPost = (post) => {
        router.push(`/dashboard/posts/edit/${post._id}`);
    };

    const handleDeletePost = (post) => {
        setSelectedPost(post);
    };

    const confirmDeletePost = async () => {
        if (!selectedPost || isDeleting) return;

        setIsDeleting(true);

        try {
            await deletePost.mutate({ id: selectedPost._id });
            toast.success("Post Deleted Successfully");
            setSelectedPost(null);
        } catch (error) {
            toast.error("Failed To Delete Post");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDuplicatePost = async (post) => {
        try {
            await duplicatePost.mutate({ id: post._id });
            toast.success("Post Duplicated Successfully");
        } catch (error) {
            toast.error("Failed To Duplicate Post");
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto"></div>
                    <p className="text-slate-400 mt-4">Loading Your Posts...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-4 lg:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold gradient-text-primary">
                        My Posts
                    </h1>
                    <p className="text-slate-400 mt-2">
                        Manage And Track Your Content Performance
                    </p>
                </div>

                <Link href="/dashboard/create">
                    <Button variant="primary">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Create New Post
                    </Button>
                </Link>
            </div>

            {/* Filters and Search */}
            <Card className="card-glass">
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search Posts..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-slate-800 border-slate-600"
                            />
                        </div>

                        {/* Status Filter */}
                        <Select
                            value={statusFilter}
                            onValueChange={setStatusFilter}
                        >
                            <SelectTrigger className="w-full md:w-40 bg-slate-800 border-slate-600">
                                <Filter className="h-4 w-4 mr-2" />
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="published">
                                    Published
                                </SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Sort */}
                        <Select value={sortBy} onValueChange={setSortBy}>
                            <SelectTrigger className="w-full md:w-40 bg-slate-800 border-slate-600">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">
                                    Newest First
                                </SelectItem>
                                <SelectItem value="oldest">
                                    Oldest First
                                </SelectItem>
                                <SelectItem value="mostViews">
                                    Most Views
                                </SelectItem>
                                <SelectItem value="mostLikes">
                                    Most Likes
                                </SelectItem>
                                <SelectItem value="alphabetical">
                                    A-Z
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Posts Grid */}
            {filteredPosts.length === 0 ? (
                <Card className="card-glass">
                    <CardContent className="p-12 text-center">
                        <FileText className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-white mb-2">
                            {searchQuery || statusFilter !== "all"
                                ? "No Posts Found"
                                : "No Posts Yet"}
                        </h3>
                        <p className="text-slate-400 mb-6">
                            {searchQuery || statusFilter !== "all"
                                ? "Try Adjusting Your Search Or Filters"
                                : "Create Your First Post To Get Started"}
                        </p>
                        {!searchQuery && statusFilter === "all" && (
                            <Link href="/dashboard/create">
                                <Button variant="primary">
                                    <PlusCircle className="h-4 w-4 mr-2" />
                                    Create Your First Post
                                </Button>
                            </Link>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredPosts.map((post) => (
                        <PostCard
                            key={post._id}
                            post={post}
                            showActions={true}
                            showAuthor={false}
                            onEdit={handleEditPost}
                            onDelete={handleDeletePost}
                            onDuplicate={handleDuplicatePost}
                        />
                    ))}
                </div>
            )}
            <AlertDialog
                open={!!selectedPost}
                onOpenChange={(open) => {
                    if (!open && !isDeleting) {
                        setSelectedPost(null);
                    }
                }}
            >
                <AlertDialogContent className="bg-slate-900 border border-slate-700 text-white max-w-md">
                    <AlertDialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center">
                                <Trash2 className="h-6 w-6 text-red-400" />
                            </div>

                            <div>
                                <AlertDialogTitle className="text-xl font-semibold text-white">
                                    Delete Post?
                                </AlertDialogTitle>
                                <p className="text-sm text-slate-400 mt-1">
                                    This Action Cannot Be Undone.
                                </p>
                            </div>
                        </div>

                        <AlertDialogDescription className="text-slate-400 pt-3">
                            Are You Sure You Want To Delete{" "}
                            <span className="font-semibold text-white">
                                "{selectedPost?.title}"
                            </span>
                            ? All Associated Post Data May Be Permanently
                            Removed.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter className="mt-4">
                        <AlertDialogCancel
                            disabled={isDeleting}
                            className="bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white"
                        >
                            Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault();
                                confirmDeletePost();
                            }}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700 text-white border-0"
                        >
                            {isDeleting ? (
                                <>
                                    <span className="h-4 w-4 mr-2 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Post
                                </>
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
