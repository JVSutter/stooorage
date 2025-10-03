import { useState, useEffect } from 'react';

interface CardData {
  totalInStock: number;
  monthRevenue: number;
  growth: number;
  alerts: number;
  loading: boolean;
  error: string | null;
}

const API_BASE_URL = 'http://localhost:8000';

export const useCardData = () => {
  const [data, setData] = useState<CardData>({
    totalInStock: 0,
    monthRevenue: 0,
    growth: 0,
    alerts: 0,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setData(prev => ({ ...prev, loading: true }));

        // Buscar total em estoque
        const stockResponse = await fetch(`${API_BASE_URL}/products/in-stock`);
        const stockData = await stockResponse.json();

        // Buscar vendas do mês atual
        const salesResponse = await fetch(`${API_BASE_URL}/products/sales/last-months?months=1`);
        const salesData = await salesResponse.json();

        // Buscar crescimento
        const growthResponse = await fetch(`${API_BASE_URL}/products/sales/growth?months=5`);
        const growthData = await growthResponse.json();

        // Buscar alertas
        const alertsResponse = await fetch(`${API_BASE_URL}/products/stock-alerts`);
        const alertsData = await alertsResponse.json();

        setData({
          totalInStock: stockData.in_stock,
          monthRevenue: salesData.summary.total_revenue,
          growth: growthData.growth_percentage,
          alerts: alertsData.total_alerts,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('Error fetching card data:', error);
        setData(prev => ({
          ...prev,
          loading: false,
          error: 'Erro ao carregar dados',
        }));
      }
    };

    fetchData();
  }, []);

  return data;
};