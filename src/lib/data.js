import {
    Users,
    BarChart3,
    PenTool,
    Eye,
    Calendar,
    Shield,
    TrendingUp,
    Settings,
    Search,
    ImageIcon,
} from "lucide-react";

export const features = [
    {
        icon: PenTool,
        title: "AI Writing Assistant",
        desc: "Get Smart Suggestions For Titles, Content, And SEO Optimization",
        color: "from-purple-500 to-blue-500",
    },
    {
        icon: Users,
        title: "Community Building",
        desc: "Grow Your Audience With Followers, Comments, And Engagement Tools",
        color: "from-green-500 to-yellow-500",
    },
    {
        icon: BarChart3,
        title: "Analytics & Insights",
        desc: "Track Performance With Detailed View Counts And Engagement Metrics",
        color: "from-yellow-500 to-orange-500",
    },
    {
        icon: Calendar,
        title: "Content Scheduling",
        desc: "Plan And Schedule Your Content With Real-Time Updates",
        color: "from-orange-500 to-red-500",
    },
    {
        icon: ImageIcon,
        title: "AI Image Transformations",
        desc: "Transform Images With Background Removal, Smart Crop, And Text Overlays",
        color: "from-red-500 to-purple-500",
    },
    {
        icon: Search,
        title: "Content Discovery",
        desc: "Explore Trending Content And Discover New Creators In Your Feed",
        color: "from-emerald-500 to-green-500",
    },
];

export const socialProofStats = [
    { metric: "50K+", label: "Active Creators", icon: Users },
    { metric: "2M+", label: "Published Posts", icon: PenTool },
    { metric: "10M+", label: "Monthly Readers", icon: Eye },
    { metric: "99.9%", label: "Uptime", icon: Shield },
];

export const testimonials = [
    {
        name: "Sarah Chen",
        role: "Tech Blogger",
        company: "@TechInsights",
        imageId: "1580489944761-15a19d654956",
        content:
            "Creatr Transformed How I Create Content. The AI Writing Assistant Saves Me Hours Every Week.",
        rating: 5,
    },
    {
        name: "Marcus Johnson",
        role: "Newsletter Creator",
        company: "@MarketingWeekly",
        imageId: "1507003211169-0a1dd7228f2d",
        content:
            "The Email Newsletter Features Are Incredible. My Subscriber Growth Increased By 300% In Just 3 Months.",
        rating: 5,
    },
    {
        name: "Elena Rodriguez",
        role: "Content Strategist",
        company: "@CreativeSpace",
        imageId: "1544005313-94ddf0286df2",
        content:
            "Best Investment I've Made For My Content Business. The Analytics Help Me Understand What My Audience Loves.",
        rating: 5,
    },
];

export const platformTabs = [
    {
        title: "Content Creation",
        icon: PenTool,
        description:
            "AI-Powered Writing Tools That Help You Create Engaging Content Faster Than Ever Before.",
        features: [
            "Smart Title Suggestions",
            "Content Optimization",
            "SEO Recommendations",
            "Plagiarism Detection",
        ],
    },
    {
        title: "Audience Growth",
        icon: TrendingUp,
        description:
            "Build And Engage Your Community With Powerful Audience Management Tools.",
        features: [
            "Follower Analytics",
            "Engagement Tracking",
            "Community Insights",
            "Growth Recommendations",
        ],
    },
    {
        title: "Content Management",
        icon: Settings,
        description:
            "Organize And Manage Your Content With Comprehensive Tools And Analytics.",
        features: [
            "Draft System",
            "Post Scheduling",
            "Content Analytics",
            "Media Management",
        ],
    },
];
