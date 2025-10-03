'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function UserDetailsPage() {
    const params = useParams();
    const userId = params.id;

    const [userPosts, setUserPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserPosts = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                if (!token) {
                    setError('Token missing');
                    return;
                }

                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}api/admin/getUserAllPost?userId=${userId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                const data = await res.json();
                if (data.success) {
                    setUserPosts(data.data.posts || []);
                } else {
                    setError(data.message || 'Failed to fetch posts');
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchUserPosts();
    }, [userId]);

    if (loading) return <div className="p-6">Loading user posts...</div>;
    if (error) return <div className="p-6 text-red-600">{error}</div>;

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-4">User Details & Posts</h1>

            {/* ✅ User Info */}
            {userPosts.length > 0 && (
                <div className="mb-6 p-4 border rounded">
                    <p><strong>User ID:</strong> {userId}</p>
                    <p><strong>Total Posts:</strong> {userPosts.length}</p>
                </div>
            )}

            {/* ✅ User Posts */}
            <div className="grid gap-4">
                {userPosts.map((post) => (
                    <div
                        key={post._id}
                        className="border rounded p-4 bg-white shadow-sm"
                    >
                        <h2 className="text-lg font-semibold">{post.title}</h2>
                        <p className="text-sm text-gray-500">Type: {post.type}</p>
                        <p className="text-sm text-gray-500">
                            Created: {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                        {post.image && (
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-32 h-32 mt-2 rounded object-cover border"
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
