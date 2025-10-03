import { Box } from "@mui/material";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Dashboard from "../components/Dashboard";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      {/* Header full width */}
      <Header />

      {/* Conteúdo dividido em Sidebar (20%) e Dashboard (80%) */}
      <Box display="flex" flexGrow={1} minHeight={0}>
        {/* Sidebar (20%) */}
        <Box width="15%" bgcolor="grey.100" borderRight="1px solid #ddd">
          <Sidebar />
        </Box>

        {/* Dashboard (80%) */}
        <Box width="85%" p={2} overflow="auto">
          <Dashboard />
        </Box>
      </Box>

      {/* Footer full width */}
      <Footer />
    </>
  );
}
