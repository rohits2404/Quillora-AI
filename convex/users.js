import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export async function getCurrentUserOrNull(ctx) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return await ctx.db
        .query("users")
        .withIndex("by_token", (q) =>
            q.eq("tokenIdentifier", identity.tokenIdentifier),
        )
        .unique();
}

export async function getCurrentUserOrThrow(ctx) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
        throw new Error("Not Authenticated");
    }

    const user = await ctx.db
        .query("users")
        .withIndex("by_token", (q) =>
            q.eq("tokenIdentifier", identity.tokenIdentifier),
        )
        .unique();

    if (!user) {
        throw new Error("User Not Found");
    }

    return user;
}

export const store = mutation({
    args: {},
    handler: async (ctx) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Called storeUser Without Authentication Present");
        }

        if (!identity.email) {
            throw new Error(
                "Email Missing From Clerk Identity. Check Clerk Session Token Claims.",
            );
        }

        const user = await ctx.db
            .query("users")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier),
            )
            .unique();

        if (user !== null) {
            const updates = { lastActiveAt: Date.now() };

            if (identity.name && identity.name !== user.name) {
                updates.name = identity.name;
            }
            if (identity.email !== user.email) {
                updates.email = identity.email;
            }
            if (identity.pictureUrl && identity.pictureUrl !== user.imageUrl) {
                updates.imageUrl = identity.pictureUrl;
            }

            await ctx.db.patch(user._id, updates);
            return user._id;
        }

        return await ctx.db.insert("users", {
            name: identity.name ?? "Anonymous",
            email: identity.email,
            tokenIdentifier: identity.tokenIdentifier,
            ...(identity.pictureUrl ? { imageUrl: identity.pictureUrl } : {}),
            createdAt: Date.now(),
            lastActiveAt: Date.now(),
        });
    },
});

export const getCurrentUser = query({
    args: {},
    handler: async (ctx) => {
        return await getCurrentUserOrThrow(ctx);
    },
});

export const updateUsername = mutation({
    args: {
        username: v.string(),
    },
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx);

        const username = args.username.trim().toLowerCase();

        if (username.length < 3 || username.length > 20) {
            throw new Error("Username Must Be Between 3 And 20 Characters");
        }

        if (!/^[a-z0-9_-]+$/.test(username)) {
            throw new Error(
                "Username Can Only Contain Letters, Numbers, Underscores, And Hyphens",
            );
        }

        if (username !== user.username) {
            const existingUser = await ctx.db
                .query("users")
                .withIndex("by_username", (q) => q.eq("username", username))
                .unique();

            if (existingUser) {
                throw new Error("Username Is Already Taken");
            }
        }

        await ctx.db.patch(user._id, {
            username,
            lastActiveAt: Date.now(),
        });

        return user._id;
    },
});

export const getByUsername = query({
    args: { username: v.string() },
    handler: async (ctx, args) => {
        const username = args.username.trim().toLowerCase();
        if (!username) return null;

        const user = await ctx.db
            .query("users")
            .withIndex("by_username", (q) => q.eq("username", username))
            .unique();

        if (!user) return null;

        return {
            _id: user._id,
            name: user.name,
            username: user.username,
            imageUrl: user.imageUrl,
            createdAt: user.createdAt,
        };
    },
});
