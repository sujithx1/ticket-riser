import { getSessionId, UsePostLogout } from "@/api/auth.api";
import LogoutIcon from "@mui/icons-material/LogoutOutlined";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import { SSO_LOGIN_URL } from "../auth-gate/AuthGate";
const returnUrl = encodeURIComponent(window.location.origin);
export default function LogoutButton() {
  const logoutMutation = UsePostLogout();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const handleLogout = () => {
    // Clear your local storage or auth state here
    const app_session_id = getSessionId();

    console.log("app session id", app_session_id);

    logoutMutation.mutate(app_session_id!, {
      onSuccess: () => {
        localStorage.removeItem("app_session_id");
        localStorage.removeItem("user");
        window.location.href = `${SSO_LOGIN_URL}&redirect_uri=${returnUrl}`;
      },
      onError: (error) => {
        console.log("error", error);

        toast.error(error.message);
      },
    });

    toast.success("Logged out successfully 👋");
    setOpen(false);
    navigate({
      to: "/",
    });
  };

  return (
    <>
      {/* The Trigger Button - Ghost Style */}
      <Button
        variant="text"
        onClick={() => setOpen(true)}
        startIcon={<LogoutIcon sx={{ fontSize: 20 }} />}
        sx={{
          color: "#ef4444", // Red color for exit action
          textTransform: "none",
          fontWeight: 700,
          borderRadius: "12px",
          px: 2,
          "&:hover": {
            bgcolor: "#fef2f2", // Soft red tint
            color: "#dc2626",
          },
        }}
      >
        Logout
      </Button>

      {/* Confirmation Dialog - Modern Airy Style */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{
          sx: { borderRadius: "20px", p: 1, maxWidth: "400px" },
        }}
      >
        <DialogTitle
          sx={{ fontWeight: 800, fontSize: "1.25rem", color: "#1e293b" }}
        >
          Confirm Logout
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#64748b", fontWeight: 500 }}>
            Are you sure you want to end your session? You will need to login
            again to access your tasks.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button
            onClick={() => setOpen(false)}
            sx={{
              borderRadius: "10px",
              color: "#64748b",
              fontWeight: 700,
              textTransform: "none",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleLogout}
            variant="contained"
            color="error"
            sx={{
              borderRadius: "10px",
              fontWeight: 700,
              textTransform: "none",
              px: 3,
              boxShadow: "0 4px 12px rgba(239, 68, 68, 0.2)",
            }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
