import { useState, useEffect } from 'react';

interface MonthlySalesData {
    month: string;
    month_start: string;
    transactions: number;
    quantity_sold: number;
    revenue: number;
}

interface SalesApiResponse {
    period: string;
    summary: {
        total_transactions: number;
        total_quantity_sold: number;
        total_revenue: number;
    };
    monthly_breakdown: MonthlySalesData[];
}

export const useMonthlySales = (months: number = 80) => {
    const [data, setData] = useState<MonthlySalesData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSalesData = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/products/sales/last-months?months=${months}`
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch sales data');
                }

                const result: SalesApiResponse = await response.json();
                setData(result.monthly_breakdown);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
                console.error('Error fetching sales data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchSalesData();
    }, [months]);

    return { data, loading, error };
};