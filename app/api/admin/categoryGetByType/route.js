import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type');
        
        if (!type) {
            return NextResponse.json({
                success: false,
                message: 'Type parameter is required'
            }, { status: 400 });
        }

        // Get authorization header
        const authHeader = request.headers.get('authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({
                success: false,
                message: 'Authorization token required'
            }, { status: 401 });
        }

        const token = authHeader.substring(7);

        // Make request to external API
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}api/admin/categoryGetByType?type=${type}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        
        if (!response.ok) {
            return NextResponse.json({
                success: false,
                message: data.message || 'Failed to fetch categories'
            }, { status: response.status });
        }

        return NextResponse.json(data);

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({
            success: false,
            message: 'Internal server error'
        }, { status: 500 });
    }
}