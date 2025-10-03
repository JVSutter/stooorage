import React from "react";
import { Grid } from "@mui/material";

import WarningIcon from "@mui/icons-material/Warning";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ForecastGraph from "./ForecastGraph";

import Card from "./Card";

const Forecast: React.FC = () => {
    return (
        <Grid container spacing={2} sx={{ mb: 4 }}>
            {/* Coluna do gráfico */}
            <Grid item xs={8}>
                <ForecastGraph />
            </Grid>

            {/* Coluna dos cards */}
            <Grid item xs={4}>
                <Grid container direction="column" spacing={2}>
                    <Grid item>
                        <Card
                            title="Crescimento Previsto"
                            value="Confiança: 78%"
                            description="Produto C pode esgotar em 12 dias baseado na tendência"
                            icon={<WarningIcon />}
                            iconColor="primary"
                        />
                    </Grid>
                    <Grid item>
                        <Card
                            title="Pico de Demanda"
                            value="Confiança 92%"
                            description="Alta demanda esperada no Produto A na semana 2"
                            icon={<WarningIcon />}
                            iconColor="primary"
                        />
                    </Grid>
                    <Grid item>
                        <Card
                            title="Estoque crítico"
                            value="Confiança: 78%"
                            description="Produto C pode esgotar em 12 dias baseado na tendência"
                            icon={<WarningIcon />}
                            iconColor="primary"
                        />
                    </Grid>
                    <Grid item>
                        <Card
                            title="Oportunidade Sazonal"
                            value="Confiança: 85%"
                            description="Padrão indica aumento de 15% no final de semana"
                            icon={<WarningIcon />}
                            iconColor="primary"
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default Forecast;
