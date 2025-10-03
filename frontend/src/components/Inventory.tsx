import React from "react";
import { Grid, Box, Typography } from "@mui/material";

import Inventory2Icon from "@mui/icons-material/Inventory2";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

import Card from "./Card";
import InventoryTable from "./InventoryTable";
import type { Product } from "./InventoryTable";
import RecommendationsCard from "./RecommendationsCard"
import type { Recommendation } from "./RecommendationsCard"

const products: Product[] = [
    {
        id: "A",
        name: "Product A",
        quantity: 245,
        minStock: 100,
        weeklySales: 45,
        remainingDays: 38,
        status: "Normal",
    },
    {
        id: "B",
        name: "Product B",
        quantity: 87,
        minStock: 100,
        weeklySales: 32,
        remainingDays: 19,
        status: "Low",
    },
    {
        id: "C",
        name: "Product C",
        quantity: 23,
        minStock: 50,
        weeklySales: 15,
        remainingDays: 11,
        status: "Critical",
    },
    {
        id: "D",
        name: "Product D",
        quantity: 456,
        minStock: 200,
        weeklySales: 28,
        remainingDays: 113,
        status: "Normal",
    },
    {
        id: "E",
        name: "Product E",
        quantity: 189,
        minStock: 150,
        weeklySales: 42,
        remainingDays: 31,
        status: "Normal",
    },
    {
        id: "F",
        name: "Product F",
        quantity: 67,
        minStock: 80,
        weeklySales: 18,
        remainingDays: 26,
        status: "Low",
    },
    {
        id: "G",
        name: "Product G",
        quantity: 12,
        minStock: 40,
        weeklySales: 8,
        remainingDays: 10,
        status: "Critical",
    },
    {
        id: "H",
        name: "Product H",
        quantity: 334,
        minStock: 150,
        weeklySales: 38,
        remainingDays: 61,
        status: "Normal",
    },
];

const recommendations: Recommendation[] = [
    { type: 'Urgent Action', text: 'Restock **Product C** and **Product G** within the next 48 hours' },
    { type: 'Planning', text: '**Product B** will need replenishment in 2 weeks based on sales trends' },
    { type: 'Optimization', text: '**Product D** has excessive stock; consider running promotions' },
  ];

const Inventory: React.FC = () => {
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
                Inventory management
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
                Intelligent control with predictive alerts
            </Typography>
            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        title="Total em Estoque"
                        value="1413"
                        icon={<Inventory2Icon />}
                        iconColor="primary"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        title="Itens Baixos"
                        value="2"
                        icon={<WarningAmberIcon />}
                        iconColor="primary"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card
                        title="Itens Críticos"
                        value="2"
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
