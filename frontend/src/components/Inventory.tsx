import React, { useEffect, useState } from "react";
import { Grid, Box, Typography } from "@mui/material";

import Inventory2Icon from "@mui/icons-material/Inventory2";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

import Card from "./Card";
import InventoryTable from "./InventoryTable";
import type { Product } from "./InventoryTable";
import RecommendationsCard from "./RecommendationsCard";
import type { Recommendation } from "./RecommendationsCard";

const recommendations: Recommendation[] = [
    { type: 'Ações Urgentes', text: 'Monitore itens com estoque baixo regularmente' },
    { type: 'Planejamento', text: 'Considere reabastecer produtos com baixas quantidades' },
    { type: 'Otimização', text: 'Revise a estratégia de preços para itens com alto estoque' },
];

const Inventory: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [totalInStock, setTotalInStock] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInventoryData = async () => {
            try {
                setLoading(true);
                
                // Fetch products data
                const productsResponse = await fetch(
                    `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/products/?page=1&page_size=100`
                );
                
                if (!productsResponse.ok) {
                    throw new Error('Failed to fetch products data');
                }

                const productsData = await productsResponse.json();
                
                // Transform API data to Product interface
                const transformedProducts: Product[] = productsData.products.map((p: any) => ({
                    product_no: p.product_no,
                    product_name: p.product_name,
                    quantity: p.quantity,
                    price: p.price,
                }));

                setProducts(transformedProducts);

                // Fetch total in stock
                const stockResponse = await fetch(
                    `${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/products/in-stock`
                );
                
                if (!stockResponse.ok) {
                    throw new Error('Failed to fetch stock data');
                }

                const stockData = await stockResponse.json();
                setTotalInStock(stockData.in_stock);

            } catch (error) {
                console.error('Error fetching inventory data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchInventoryData();
    }, []);

    // Calculate metrics from actual data
    const lowStockItems = products.filter(p => p.quantity < 50).length;
    const criticalStockItems = products.filter(p => p.quantity < 20).length;

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Typography>Carregando dados de inventário...</Typography>
            </Box>
        );
    }

    return (
        <Box>
            <Typography
                variant="h5"
                sx={{
                    display: "flex",
                    justifyContent: "left",
                    fontWeight: 800,
                }}
            >
                Gerenciamento de Estoque
            </Typography>
            <Typography
                variant="subtitle1"
                sx={{
                    display: "flex",
                    justifyContent: "left",
                    fontWeight: "normal",
                    color: "#65758b",
                    marginBottom: "2%",
                }}
            >
                Controle inteligente com alertas
            </Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        title="Total em Estoque"
                        value={totalInStock.toString()}
                        icon={<Inventory2Icon />}
                        iconColor="primary"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        title="Itens Baixos"
                        value={lowStockItems.toString()}
                        icon={<WarningAmberIcon />}
                        iconColor="primary"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        title="Itens Críticos"
                        value={criticalStockItems.toString()}
                        icon={<ErrorOutlineIcon />}
                        iconColor="primary"
                    />
                </Grid>
            </Grid>

            <InventoryTable products={products} />

            <Box sx={{ mt: 3 }}>
                <RecommendationsCard recommendations={recommendations} />
            </Box>
        </Box>
    );
};

export default Inventory;