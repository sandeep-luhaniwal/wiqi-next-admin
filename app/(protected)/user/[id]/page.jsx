'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import Image from 'next/image';
import { getUserWithPosts } from '@/app/api/getuserdetails/userdetails';

export default function UserProfilePage() {
    const params = useParams();
    const userId = params.id;

    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activePost, setActivePost] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                if (!token) throw new Error('Token missing');

                const { user, posts } = await getUserWithPosts(userId, token);
                setUser(user);
                setPosts(posts);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchUserData();
    }, [userId]);

    if (loading) {
        return (
            <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                    <Skeleton className="w-20 h-20 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="w-full h-40 rounded-lg" />
                    ))}
                </div>
            </div>
        );
    }

    if (error) return <div className="p-6 text-red-600">{error}</div>;

    const mediaPosts = posts.map(post => ({
        ...post,
        mediaSrc: post.image || post.thumbnail || null,
        isVideo: !!post.video,
        isImage: !!post.image
    }));

    return (
        <div className="p-4 md:p-5 lg:p-6 mx-auto">
            {/* User Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 sm:items-center gap-6 mb-6">
                <Avatar className="w-[240px] h-[240px] mx-auto">
                    <AvatarImage src={user.image || '/avatar.png'} alt={user.firstName} />
                    <AvatarFallback>{user.firstName?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                    <h1 className="text-2xl text-primary font-bold">{user.firstName} {user.lastName}</h1>
                    <p className="text-foreground">@{user.userName}</p>
                    <p className="text-foreground/70">{user.bio || "No bio available"}</p>
                    <div className="flex gap-6 text-sm mt-2">
                        <span><strong>{posts.length}</strong> posts</span>
                        <span><strong>{user.followers || 0}</strong> followers</span>
                        <span><strong>{user.following || 0}</strong> following</span>
                    </div>
                    <div className="text-sm mt-1 flex flex-col gap-1 text-foreground">
                        <p>Email: <span className='text-foreground/70'>{user.email}</span></p>
                        <p>Country: <span className='text-foreground/70'>{user.selectCountry}</span></p>
                        <p>Phone: <span className='text-foreground/70'>{user.phoneCode} {user.phone}</span></p>
                    </div>
                </div>
            </div>

            <Separator className="mb-6" />

            {/* Tabs */}
            <Tabs defaultValue="all" className="space-y-4">
                <TabsList className={'max-w-max p-1.5'}>
                    <TabsTrigger className={'bg-primary text-white px-10 py-2 hover:text-white duration-300'} value="all">All</TabsTrigger>
                    <TabsTrigger className={'bg-primary text-white px-10 py-2 hover:text-white duration-300'} value="image">Image</TabsTrigger>
                    <TabsTrigger className={'bg-primary text-white px-10 py-2 hover:text-white duration-300'} value="videos">Videos</TabsTrigger>
                </TabsList>

                {/* All Posts */}
                <TabsContent value="all">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {mediaPosts.map(post => (
                            <Dialog key={post._id}>
                                <DialogTrigger asChild>
                                    <div
                                        className="relative cursor-pointer group overflow-hidden rounded-lg bg-gray-100 h-40 flex items-center justify-center"
                                        onClick={() => setActivePost(post)}
                                    >
                                        {post.mediaSrc ? (
                                            <Image width={400} height={500} src={post.mediaSrc} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                        ) : (
                                            <span className="text-gray-400">No Media</span>
                                        )}
                                        {post.isVideo && (
                                            <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 6h16M4 18h16" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </DialogTrigger>

                                {activePost && activePost._id === post._id && (
                                    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-0">
                                        <DialogTitle className="sr-only">{post.title}</DialogTitle>
                                        <div className="relative w-full flex flex-col items-center">
                                            {post.isVideo ? (
                                                <video
                                                    controls
                                                    src={post.video}
                                                    className="w-full h-[70vh] object-contain bg-black"
                                                />
                                            ) : post.image ? (
                                                <Image width={400} height={500}
                                                    src={post.image}
                                                    alt={post.title}
                                                    className="w-full max-w-full h-[70vh] object-contain"
                                                />
                                            ) : (
                                                <div className="w-full h-64 flex items-center justify-center">No Media</div>
                                            )}

                                            {/* Post Details */}
                                            <div className="p-4 w-full max-w-full">
                                                <h2 className="text-lg font-semibold">{post.title}</h2>
                                                <p className="text-gray-500 text-sm">{post.type}</p>
                                                <p className="text-gray-400 text-xs">Views: {post.view}</p>
                                            </div>
                                        </div>
                                    </DialogContent>
                                )}

                            </Dialog>
                        ))}
                    </div>
                </TabsContent>

                {/* Images Only */}
                <TabsContent value="image">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {mediaPosts.filter(p => p.isImage).map(post => (
                            <Dialog key={post._id}>
                                <DialogTrigger asChild>
                                    <div
                                        className="relative cursor-pointer group overflow-hidden rounded-lg bg-gray-100 h-40 flex items-center justify-center"
                                        onClick={() => setActivePost(post)}
                                    >
                                        <Image width={400} height={500} src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                    </div>
                                </DialogTrigger>

                                {activePost && activePost._id === post._id && (
                                    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-0">
                                        <DialogTitle className="sr-only">{post.title}</DialogTitle>

                                        <div className="relative w-full flex flex-col items-center">
                                            <Image width={400} height={500}
                                                src={post.image}
                                                alt={post.title}
                                                className="w-full h-auto object-contain"
                                            />

                                            <div className="p-4 w-full max-w-full">
                                                <h2 className="text-lg font-semibold">{post.title}</h2>
                                                <p className="text-gray-500 text-sm">{post.type}</p>
                                                <p className="text-gray-400 text-xs">Views: {post.view}</p>
                                            </div>
                                        </div>
                                    </DialogContent>
                                )}

                            </Dialog>
                        ))}
                    </div>
                </TabsContent>

                {/* Videos Only */}
                <TabsContent value="videos">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {mediaPosts.filter(p => p.isVideo).map(post => (
                            <Dialog key={post._id}>
                                <DialogTrigger asChild>
                                    <div
                                        className="relative cursor-pointer group overflow-hidden rounded-lg bg-gray-100 h-40 flex items-center justify-center"
                                        onClick={() => setActivePost(post)}
                                    >
                                        <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                        <div className="absolute top-2 right-2 bg-black/50 rounded-full p-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 6h16M4 18h16" />
                                            </svg>
                                        </div>
                                    </div>
                                </DialogTrigger>

                                {activePost && activePost._id === post._id && (
                                    <DialogContent className="max-w-3xl p-0">
                                        <DialogTitle className="sr-only">{post.title}</DialogTitle>
                                        <video controls src={post.video} className="w-full h-auto" />
                                        <div className="p-4">
                                            <h2 className="text-lg font-semibold">{post.title}</h2>
                                            <p className="text-gray-500 text-sm">{post.type}</p>
                                            <p className="text-gray-400 text-xs">Views: {post.view}</p>
                                        </div>
                                    </DialogContent>
                                )}
                            </Dialog>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
