import { TanStackDevtools } from "@tanstack/react-devtools";
import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import NotFound from "@/components/404/NOTFOUNT";
import LogoutButton from "@/components/logout/Logout";
import {
  AppBar,
  Box,
  Container,
  Divider,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import "../styles.css";

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFound,
});

function RootComponent() {
  return (
    <>
      {/* GLOBAL HEADER */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(8px)", // Glass effect
          borderBottom: "1px solid",
          borderColor: "divider",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            disableGutters
            sx={{
              justifyContent: "space-between",
              minHeight: "64px !important",
            }}
          >
          <Stack spacing={0}>
  {/* MAIN LOGO */}
  <Typography
    variant="h4"
    sx={{
      fontWeight: 950,
      color: "orange",
      letterSpacing: "-2px",
      lineHeight: 1,
      display: "flex",
      alignItems: "baseline",
    }}
  >
    MAGADH_<span style={{ color: "#0ea5e9" }}>TICKETS</span>
  </Typography>

  {/* SUB-TEXT SYSTEM DATA */}
  <Stack 
    direction="row" 
    spacing={1.5} 
    alignItems="center" 
    sx={{ 
      mt: 0.5, // Tiny gap for breathing room
      pl: 0.2  // Slight offset to align with the 'M'
    }}
  >
    {/* Status Indicator */}
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.7 }}>
      <Box
        sx={{
          width: 6,
          height: 6,
          bgcolor: "#22c55e",
          borderRadius: "50%",
          boxShadow: "0 0 8px rgba(34, 197, 94, 0.4)",
          animation: "pulse 2s infinite ease-in-out",
          "@keyframes pulse": {
            "0%": { opacity: 0.5, transform: "scale(1)" },
            "50%": { opacity: 1, transform: "scale(1.2)" },
            "100%": { opacity: 0.5, transform: "scale(1)" },
          },
        }}
      />
      <Typography
        variant="caption"
        sx={{
          color: "#64748b",
          fontFamily: "'JetBrains Mono', 'Roboto Mono', monospace",
          fontWeight: 800,
          fontSize: "0.65rem",
          letterSpacing: "0.5px"
        }}
      >
        SYS_ACTIVE
      </Typography>
    </Box>

    <Divider
      orientation="vertical"
      flexItem
      sx={{ height: 10, my: "auto", bgcolor: "#e2e8f0" }}
    />

    {/* Metadata Readout */}
    <Typography
      variant="caption"
      sx={{
        color: "#94a3b8",
        fontFamily: "monospace",
        fontSize: "0.65rem",
        letterSpacing: "-0.2px",
        opacity: 0.8
      }}
    >
      LOGISTICS // IT_INFRA
    </Typography>
  </Stack>
</Stack>

            {/* ACTION AREA */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <LogoutButton />
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* PAGE CONTENT */}
      <Box component="main" sx={{ minHeight: "100vh", bgcolor: "#f8fafc" }}>
        <Container maxWidth="lg" sx={{ py: 3 }}>
          <Outlet />
        </Container>
      </Box>

      {/* DEV TOOLS */}
      <TanStackDevtools
        config={{ position: "bottom-right" }}
        plugins={[
          { name: "TanStack Router", render: <TanStackRouterDevtoolsPanel /> },
        ]}
      />
    </>
  );
}
