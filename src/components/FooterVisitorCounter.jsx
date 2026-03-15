import React, { useState, useEffect } from 'react';
import { Users } from 'lucide-react';

export default function FooterVisitorCounter() {
    const [visitors, setVisitors] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchVisitorCount();
        // Refresh every 30 seconds
        const interval = setInterval(fetchVisitorCount, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchVisitorCount = async () => {
        try {
            setError(null);
            const apiUrl = '/api/analytics-visitor-count.php';
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                console.warn(`Visitor counter response status: ${response.status}`);
                // If in development, fallback to a mock visitor count so the UI stays useful
                if (import.meta.env.DEV) {
                    const mock = {
                        unique_visitors: 1234,
                        total_views: 5678,
                        today_visitors: 12
                    };
                    setVisitors(mock);
                    setError(null);
                    setLoading(false);
                    console.info('Using mock visitor count (DEV)');
                    return;
                }
                setError(`HTTP ${response.status}`);
                setLoading(false);
                return;
            }

            const result = await response.json();
            console.log('Visitor count result:', result);

            if (result.success && result.data) {
                setVisitors(result.data);
                setError(null);
            } else {
                console.warn('Visitor count API returned:', result);
                setError('Unable to load visitor count');
            }
        } catch (err) {
            console.error('Error fetching visitor count:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-gray-500">
                <Users size={14} className="text-[#00e9fa] animate-pulse" />
                <span>Loading...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-gray-600">
                <Users size={14} className="text-gray-500 opacity-50" />
                <span className="opacity-50">—</span>
            </div>
        );
    }

    if (!visitors) {
        return null; // No data
    }

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-gray-500">
                <Users size={14} className="text-[#00e9fa]" />
                <span>Total Visitors</span>
            </div>
            <div className="text-[12px] font-mono font-bold text-[#00e9fa] tracking-wider">
                {visitors.unique_visitors.toLocaleString()}
            </div>
            <div className="text-[9px] font-mono text-gray-600 tracking-widest opacity-75">
                {visitors.total_views.toLocaleString()} pages • {visitors.today_visitors} today
            </div>
        </div>
    );
}
