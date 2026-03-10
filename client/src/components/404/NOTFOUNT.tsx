import { UsePostLogout, getSessionId } from "@/api/auth.api";
import HomeIcon from "@mui/icons-material/Home";
import LogoutIcon from "@mui/icons-material/Logout";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import toast from "react-hot-toast";
import { SSO_LOGIN_URL } from "../auth-gate/AuthGate";

const returnUrl = encodeURIComponent(window.location.origin);
export default function NotFound() {
  const logoutMutation = UsePostLogout();
  const sessionId = getSessionId();

  const navigate = useNavigate();

  const handleHome = () => {
    navigate({});
  };

  const handleLogout = () => {
    if (!sessionId) return toast.error("Session Id is Missing ,");

    logoutMutation.mutate(sessionId, {
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: () => {
        localStorage.removeItem("app_session_id");
        localStorage.removeItem("user");
        window.location.href = `${SSO_LOGIN_URL}&redirect_uri=${returnUrl}`;
      },
    });
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f5f5f5",
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          p: 5,
          bgcolor: "white",
          borderRadius: 3,
          boxShadow: 3,
          maxWidth: 400,
        }}
      >
        <Typography variant="h1" fontWeight="bold" color="primary">
          404
        </Typography>

        <Typography variant="h5" sx={{ mt: 2 }}>
          Page Not Found
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          The page you are looking for doesn't exist or has been moved.
        </Typography>

        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          sx={{ mt: 4 }}
        >
          <Button
            variant="contained"
            startIcon={<HomeIcon />}
            onClick={handleHome}
          >
            Home
          </Button>

          <Button
            variant="outlined"
            color="error"
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
