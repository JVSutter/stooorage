import React from 'react';
import { Paper, Typography, Box, List, ListItem, ListItemText } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import { styled } from '@mui/material/styles';

// Importa tipos do arquivo principal (Dashboard)
export type RecommendationType = 'Urgent Action' | 'Planning' | 'Optimization';

export interface Recommendation {
  type: RecommendationType;
  text: string;
}

interface RecommendationsCardProps {
  recommendations: Recommendation[];
}

const StyledListItem = styled(ListItem)(({ theme }) => ({
  alignItems: 'flex-start',
  paddingLeft: 0,
  paddingTop: theme.spacing(0.5),
  paddingBottom: theme.spacing(0.5),
}));

const renderTextWithBold = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};


const RecommendationsCard: React.FC<RecommendationsCardProps> = ({ recommendations }) => (
  <Box sx={{ backgroundColor: "#fff", borderRadius: "1%", boxShadow: "none", border: "1px solid #e0e0e0", p: "1%" }}>
    <Box display="flex" alignItems="center" mb={1}>
      <WarningIcon sx={{ color: 'success.main', mr: 1 }} />
      <Typography variant="subtitle1" component="h2" sx={{ fontWeight: 'bold', color: 'success.main' }}>
        Recomendações da IA
      </Typography>
    </Box>

    <List dense disablePadding>
      {recommendations.map((rec, index) => (
        <StyledListItem key={index}>
          <ListItemText>
            <Typography component="span" variant="body2" sx={{ fontWeight: 'bold' }}>
              {rec.type}:{' '}
            </Typography>
            <Typography component="span" variant="body2">
              {renderTextWithBold(rec.text)}
            </Typography>
          </ListItemText>
        </StyledListItem>
      ))}
    </List>
  </Box>
);

export default RecommendationsCard;