import React from "react";
import { Card, Typography, Avatar, Box } from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

interface InfoCardProps {
  title: string;
  value: string | number;
  description?: string;
  percentageChange?: number; // para controlar cor verde/vermelho
  icon?: React.ReactNode;
  iconColor?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' | string;
}

const InfoCard: React.FC<InfoCardProps> = ({ 
  title, 
  value, 
  description,
  percentageChange,
  icon,
  iconColor = "primary"
}) => {
  const getAvatarColor = (color: string) => {
    const themeColors: Record<string, string> = {
      primary: 'primary.main',
      secondary: 'secondary.main',
      success: 'success.main',
      error: 'error.main',
      warning: 'warning.main',
      info: 'info.main',
    };
    return themeColors[color] || color;
  };

  return (
    <Card 
      sx={{ 
        minWidth: 250, 
        borderRadius: 2, 
        border: "1px solid #e0e0e0", 
        p: 2, 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: 3, // sombra padrão do MUI
        }
      }}
    >
      {/* Lado esquerdo com textos */}
      <Box>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h5" fontWeight="bold">
          {value}
        </Typography>
        {description && (
          <Box display="flex" alignItems="center" gap={0.5}>
            {percentageChange !== undefined && percentageChange >= 0 && (
              <ArrowUpwardIcon fontSize="small" sx={{ color: "success.main" }} />
            )}
            <Typography 
              variant="body2" 
              // sx={{ color: percentageChange !== undefined && percentageChange >= 0 ? "#00FF00" : "error.main" }}
            >
              {description}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Ícone à direita */}
      {icon && (
        <Avatar 
          sx={{ 
            background: "linear-gradient(135deg, hsl(217 91% 60%), hsl(217 91% 70%));",
            bgcolor: getAvatarColor(iconColor), 
            color: "white", 
            width: 40, 
            height: 40 
          }}
        >
          {icon}
        </Avatar>
      )}
    </Card>
  );
};

export default InfoCard;
