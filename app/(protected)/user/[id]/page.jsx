'use client';

import { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
    Mail, 
    MapPin, 
    Phone, 
    Calendar, 
    Grid, 
    Image as ImageIcon, 
    Video, 
    Eye, 
    Heart, 
    Users, 
    UserPlus,
    MoreHorizontal,
    ChevronRight,
    Play,
    Info,
    ArrowLeft
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage, AvatarIndicator, AvatarStatus } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { getUserWithPosts } from '@/app/api/getuserdetails/userdetails';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function UserProfilePage() {
    const params = useParams();
    const router = useRouter();
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

    const mediaPosts = useMemo(() => posts.map(post => ({
        ...post,
        mediaSrc: post.image || post.thumbnail || null,
        isVideo: !!post.video,
        isImage: !!post.image
    })), [posts]);

    if (loading) return <ProfileSkeleton />;
    if (error) return <div className="p-10 text-center text-red-500 font-medium bg-red-50 rounded-2xl m-6 border border-red-100">{error}</div>;
    if (!user) return <div className="p-10 text-center text-gray-500 font-medium">User not found</div>;

    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            {/* Header / Background Decoration */}
            <div className="h-64 bg-linear-to-r from-primary/20 via-primary/5 to-transparent relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(var(--primary),0.08),transparent)]" />
                <div className="max-w-7xl mx-auto px-6 pt-6">
                    <Button 
                        variant="ghost" 
                        className="bg-white/50 backdrop-blur-md hover:bg-white/80 font-bold" 
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 -mt-32 relative z-10">
                {/* --- Main Profile Section --- */}
                <Card className="border-none shadow-2xl shadow-primary/5 bg-white/80 backdrop-blur-xl overflow-hidden rounded-3xl">
                    <CardContent className="p-0">
                        <div className="p-6 md:p-10">
                            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
                                {/* Standard Premium Avatar */}
                                <div className="relative group">
                                    <Avatar className="size-40 md:size-48 border-4 border-white shadow-xl rounded-full bg-slate-100 transition-transform duration-300 hover:scale-[1.02]">
                                        <AvatarImage src={user.image || '/avatar.png'} alt={user.firstName} className="object-cover" />
                                        <AvatarFallback className="text-5xl font-black text-primary/20">
                                            {user.firstName?.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <AvatarIndicator className="bottom-4 right-2">
                                        <AvatarStatus variant="online" className="size-6 border-[4px] border-white shadow-sm" />
                                    </AvatarIndicator>
                                </div>

                                {/* User Meta Info */}
                                <div className="flex-1 space-y-4">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                                            {user.firstName} {user.lastName}
                                        </h1>
                                        <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-3 py-1 text-sm font-semibold rounded-full">
                                            @{user.userName}
                                        </Badge>
                                    </div>
                                    
                                    <p className="text-slate-600 text-lg leading-relaxed max-w-2xl font-medium">
                                        {user.bio || "Crafting digital experiences and exploring the world. Dedicated to high-quality visual storytelling."}
                                    </p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                        <div className="flex items-center gap-3 text-slate-500 bg-slate-50 p-3 rounded-2xl border border-slate-100/50">
                                            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary">
                                                <Mail size={18} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Email</span>
                                                <span className="text-sm font-semibold text-slate-700 truncate">{user.email}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-500 bg-slate-50 p-3 rounded-2xl border border-slate-100/50">
                                            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary">
                                                <Phone size={18} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Phone</span>
                                                <span className="text-sm font-semibold text-slate-700">{user.phoneCode} {user.phone}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-500 bg-slate-50 p-3 rounded-2xl border border-slate-100/50">
                                            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary">
                                                <MapPin size={18} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Location</span>
                                                <span className="text-sm font-semibold text-slate-700">{user.selectCountry || "Global Citizen"}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-500 bg-slate-50 p-3 rounded-2xl border border-slate-100/50">
                                            <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-primary">
                                                <Calendar size={18} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Joined</span>
                                                <span className="text-sm font-semibold text-slate-700">May 2024</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* --- Stats Row --- */}
                        <div className="grid grid-cols-3 border-t border-slate-100 bg-slate-50/50">
                            <StatCard label="Posts" value={posts.length} icon={<ImageIcon size={20} />} />
                            <StatCard label="Followers" value={user.followers || 0} icon={<Users size={20} />} />
                            <StatCard label="Following" value={user.following || 0} icon={<UserPlus size={20} />} />
                        </div>
                    </CardContent>
                </Card>

                {/* --- Content Tabs --- */}
                <div className="mt-12">
                    <Tabs defaultValue="all" className="w-full">
                        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                            <TabsList className="bg-slate-100 p-1 rounded-2xl h-14 border border-slate-200">
                                <TabsTrigger value="all" className="rounded-xl px-8 h-full data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm font-bold text-slate-500">
                                    <Grid className="mr-2 h-4 w-4" /> All
                                </TabsTrigger>
                                <TabsTrigger value="image" className="rounded-xl px-8 h-full data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm font-bold text-slate-500">
                                    <ImageIcon className="mr-2 h-4 w-4" /> Images
                                </TabsTrigger>
                                <TabsTrigger value="videos" className="rounded-xl px-8 h-full data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm font-bold text-slate-500">
                                    <Video className="mr-2 h-4 w-4" /> Videos
                                </TabsTrigger>
                            </TabsList>
                            
                        </div>

                        <TabsContent value="all" className="mt-0 focus-visible:ring-0">
                            <MediaGrid posts={mediaPosts} setActivePost={setActivePost} />
                        </TabsContent>
                        <TabsContent value="image" className="mt-0 focus-visible:ring-0">
                            <MediaGrid posts={mediaPosts.filter(p => p.isImage)} setActivePost={setActivePost} />
                        </TabsContent>
                        <TabsContent value="videos" className="mt-0 focus-visible:ring-0">
                            <MediaGrid posts={mediaPosts.filter(p => p.isVideo)} setActivePost={setActivePost} />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

            {/* --- Post Viewer Dialog --- */}
            <PostViewer activePost={activePost} setActivePost={setActivePost} />
        </div>
    );
}

// --- Sub-components for better organization ---

function StatCard({ label, value, icon }) {
    return (
        <div className="p-6 md:p-8 flex flex-col items-center justify-center gap-1 border-r last:border-r-0 border-slate-100 hover:bg-white transition-colors duration-300">
            <div className="text-slate-400 mb-2">{icon}</div>
            <span className="text-2xl md:text-3xl font-black text-slate-900 leading-none">{value.toLocaleString()}</span>
            <span className="text-xs uppercase tracking-widest font-bold text-slate-400">{label}</span>
        </div>
    );
}

function MediaGrid({ posts, setActivePost }) {
    if (posts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-300 mb-4">
                    <Info size={32} />
                </div>
                <h3 className="text-slate-900 font-bold text-xl">No content yet</h3>
                <p className="text-slate-500 font-medium">This user hasn't uploaded any media in this category.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {posts.map((post) => (
                <div
                    key={post._id}
                >
                    <Dialog>
                        <DialogTrigger asChild>
                            <div
                                className="group relative aspect-square cursor-pointer overflow-hidden rounded-[2rem] bg-slate-200 shadow-sm border border-slate-200"
                                onClick={() => setActivePost(post)}
                            >
                                {post.mediaSrc ? (
                                    <Image 
                                        src={post.mediaSrc} 
                                        alt={post.title} 
                                        fill 
                                        className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-75 group-hover:blur-[2px]" 
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full bg-slate-100 text-slate-300">No Media</div>
                                )}
                                
                                {/* Overlay on hover */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 bg-linear-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-5">
                                    <h4 className="text-white font-bold text-sm truncate mb-2">{post.title}</h4>
                                    <div className="flex items-center gap-4 text-white/90 text-xs font-bold">
                                        <div className="flex items-center gap-1.5"><Eye size={14} className="text-primary" /> {post.view || 0}</div>
                                        <div className="flex items-center gap-1.5"><Heart size={14} className="text-red-400 fill-red-400" /> 12</div>
                                    </div>
                                </div>

                                {post.isVideo && (
                                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-full p-2 text-white shadow-lg z-10">
                                        <Play size={14} fill="white" />
                                    </div>
                                )}
                            </div>
                        </DialogTrigger>
                    </Dialog>
                </div>
            ))}
        </div>
    );
}

function PostViewer({ activePost, setActivePost }) {
    return (
        <Dialog open={!!activePost} onOpenChange={(open) => !open && setActivePost(null)}>
            <DialogContent className="sm:max-w-5xl p-0 border-none bg-black/95 backdrop-blur-2xl overflow-hidden rounded-[2.5rem] shadow-2xl">
                <DialogTitle className="sr-only">{activePost?.title}</DialogTitle>
                <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[90vh]">
                    {/* Media Column */}
                    <div className="lg:col-span-8 bg-black flex items-center justify-center min-h-[50vh] relative">
                        {activePost?.isVideo ? (
                            <video controls autoPlay src={activePost.video} className="w-full h-full max-h-[85vh] object-contain" />
                        ) : activePost?.image ? (
                            <div className="relative w-full h-full min-h-[50vh] max-h-[85vh]">
                                <Image 
                                    src={activePost.image} 
                                    alt={activePost.title} 
                                    fill 
                                    className="object-contain" 
                                    priority
                                />
                            </div>
                        ) : (
                            <div className="text-slate-500">No Media Available</div>
                        )}
                    </div>

                    {/* Meta Column */}
                    <div className="lg:col-span-4 bg-white flex flex-col h-full overflow-y-auto">
                        <div className="p-8 space-y-6">
                            <div className="flex items-center justify-between">
                                <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-none font-bold">
                                    {activePost?.type || 'POST'}
                                </Badge>
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">
                                    2 hours ago
                                </span>
                            </div>

                            <div className="space-y-3">
                                <h2 className="text-2xl font-black text-slate-900 leading-tight">
                                    {activePost?.title || "Project Showcase"}
                                </h2>
                                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                                    {activePost?.description || "Experience the future of visual storytelling through this unique digital creation."}
                                </p>
                            </div>

                            <Separator className="bg-slate-100" />

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-1">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Views</span>
                                    <span className="text-xl font-black text-slate-900">{activePost?.view || 0}</span>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-1">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</span>
                                    <span className="text-xl font-black text-slate-900 truncate">Digital</span>
                                </div>
                            </div>

                            {/* <div className="pt-4 flex items-center gap-3">
                                <Button className="flex-1 rounded-2xl h-14 font-bold shadow-lg shadow-primary/20">
                                    <Heart className="mr-2 h-5 w-5" /> Appreciate
                                </Button>
                                <Button variant="outline" size="icon" className="h-14 w-14 rounded-2xl border-slate-200">
                                    <MoreHorizontal size={20} />
                                </Button>
                            </div> */}
                        </div>

                        {/* <div className="mt-auto p-8 bg-slate-50/50 border-t border-slate-100">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 text-center">Engagement insights</p>
                            <div className="flex items-center justify-between">
                                <div className="flex -space-x-3">
                                    {[1, 2, 3, 4].map(i => (
                                        <Avatar key={i} className="border-2 border-white w-8 h-8 shadow-sm">
                                            <AvatarImage src={`https://i.pravatar.cc/100?img=${i + 20}`} />
                                            <AvatarFallback>U</AvatarFallback>
                                        </Avatar>
                                    ))}
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary border-2 border-white shadow-sm">+8</div>
                                </div>
                                <span className="text-xs font-bold text-slate-500">12 people loved this</span>
                            </div>
                        </div> */}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function ProfileSkeleton() {
    return (
        <div className="min-h-screen bg-slate-50/50 pb-20">
            <div className="h-64 bg-slate-100 animate-pulse" />
            <div className="max-w-6xl mx-auto px-4 -mt-32">
                <div className="bg-white rounded-3xl p-10 shadow-xl space-y-8">
                    <div className="flex flex-col md:flex-row gap-8 items-center">
                        <Skeleton className="w-48 h-48 rounded-full" />
                        <div className="flex-1 space-y-4 w-full">
                            <Skeleton className="h-10 w-1/3" />
                            <Skeleton className="h-20 w-full" />
                            <div className="grid grid-cols-2 gap-4">
                                <Skeleton className="h-14 rounded-2xl" />
                                <Skeleton className="h-14 rounded-2xl" />
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-3 gap-6 pt-6">
                        <Skeleton className="h-24 rounded-2xl" />
                        <Skeleton className="h-24 rounded-2xl" />
                        <Skeleton className="h-24 rounded-2xl" />
                    </div>
                </div>
                <div className="mt-12 space-y-8">
                    <div className="flex justify-between">
                        <Skeleton className="h-14 w-96 rounded-2xl" />
                        <Skeleton className="h-14 w-32 rounded-2xl" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <Skeleton key={i} className="aspect-square rounded-[2rem]" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
