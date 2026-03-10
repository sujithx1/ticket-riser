import { UseGetDeveolper } from "@/api/api";
import type { CreateTicketFormValues, IssuePriority } from "@/types/types";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CancelIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline"; // Professional thin look
import SendIcon from "@mui/icons-material/Send";
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import React, { useRef, useState } from "react";
// const developers = [
//   { name: "Sujith", role: "Frontend Developer" },
//   { name: "Anita", role: "Full Stack Developer" },
//   { name: "Kiran", role: "QA Engineer" },
// ];

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTicketFormValues) => void;
}
export default function CreateTicketDialog({ open, onClose, onSubmit }: Props) {
  const { data: developers, isLoading: developerLoading } = UseGetDeveolper();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as IssuePriority,
    assignee: {
      name: "",
      id: "",
      role: {
        name: "",
        id: "",
      },
    },
  });

  // File Preview State
  const [pendingFiles, setPendingFiles] = useState<
    { file: File; preview: string }[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // User Context
  const currentUser = { name: "Sujith", role: "Developer" };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setPendingFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFormSubmit = () => {
    if (!formData.title) return;

    const finalData = {
      ...formData,
      attachments: pendingFiles.map((f) => f.file.name),
      author: currentUser.name,
      createdAt: new Date(),

      assignee: {
        name: formData.assignee.name,
        id: formData.assignee.id,
        role: {
          name: formData.assignee.role.name,
          id: formData.assignee.role.id,
        },
      },
    };

    onSubmit(finalData);
    setPendingFiles([]);
    setFormData({
      title: "",
      description: "",
      priority: "medium",
      assignee: {
        name: "",
        id: "",
        role: {
          name: "",
          id: "",
        },
      },
    });
    onClose();
  };

  const handleFieldChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: "24px",
          p: 1,
          border: "1px solid #e2e8f0",
          bgcolor: "#fff",
        },
      }}
    >
      <DialogTitle
        sx={{
          p: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 900, color: "#0f172a", letterSpacing: "-1px" }}
          >
            NEW_ISSUE_<span style={{ color: "#0ea5e9" }}>UPLINK</span>
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
            <Avatar
              sx={{
                width: 18,
                height: 18,
                bgcolor: "#0ea5e9",
                fontSize: "10px",
              }}
            >
              S
            </Avatar>
            <Typography
              variant="caption"
              sx={{ color: "#64748b", fontWeight: 700 }}
            >
              OPERATOR: {currentUser.name} // {currentUser.role}
            </Typography>
          </Stack>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider sx={{ borderStyle: "dashed", mx: 3 }} />

      <DialogContent sx={{ p: 4 }}>
        <Stack spacing={3}>
          {/* Title Input */}
          <TextField
            fullWidth
            label="SUBJECT_LINE"
            placeholder="What is the anomaly?"
            variant="outlined"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
          />

          {/* Description */}
          <TextField
            fullWidth
            multiline
            rows={4}
            label="INTEL_DESCRIPTION"
            placeholder="Provide technical details..."
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
          />
          <Box>
            <Typography
              variant="caption"
              sx={{
                fontWeight: 800,
                color: "#94a3b8",
                mb: 1,
                display: "block",
              }}
            >
              PRIORITY_LEVEL
            </Typography>
            <ToggleButtonGroup
              value={formData.priority}
              exclusive
              onChange={(e, nextValue) => {
                if (nextValue !== null)
                  handleFieldChange("priority", nextValue);
              }}
              fullWidth
              sx={{
                height: "40px",
                "& .MuiToggleButton-root": {
                  borderRadius: "10px",
                  border: "1px solid #e2e8f0",
                  textTransform: "none",
                  fontWeight: 700,
                  color: "#64748b",
                  "&.Mui-selected": {
                    bgcolor:
                      formData.priority === "high"
                        ? "#fee2e2"
                        : formData.priority === "medium"
                          ? "#e0f2fe"
                          : "#f0fdf4",
                    color:
                      formData.priority === "high"
                        ? "#ef4444"
                        : formData.priority === "medium"
                          ? "#0ea5e9"
                          : "#22c55e",
                    borderColor: "transparent",
                    "&:hover": { opacity: 0.8 },
                  },
                },
              }}
            >
              <ToggleButton value="low">Low</ToggleButton>
              <ToggleButton value="medium">Medium</ToggleButton>
              <ToggleButton value="high">High</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Assign Developer */}
          <Box>
            {/* Modern Label Styling */}
            <Typography
              variant="caption"
              sx={{
                fontWeight: 700,
                color: "#64748b",
                mb: 1,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                textTransform: "uppercase",
                letterSpacing: "0.5px",
              }}
            >
              <PersonOutlineIcon sx={{ fontSize: 14 }} /> Assign Developer
            </Typography>

            <Autocomplete
              options={developers || []}
              loading={developerLoading}
              getOptionLabel={(option) => option.name}
              value={formData.assignee}
              onChange={(_, value) => handleFieldChange("assignee", value)}
              // Customizing the Input Field to show Avatar when selected
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={
                    !formData.assignee ? "Search team members..." : ""
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      bgcolor: "#f8fafc", // Soft background
                      transition: "all 0.2s ease",
                      "&:hover": { bgcolor: "#f1f5f9" },
                      "&.Mui-focused": {
                        bgcolor: "#fff",
                        boxShadow: "0 0 0 4px rgba(25, 118, 210, 0.1)",
                      },
                    },
                  }}
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: formData.assignee ? (
                      <InputAdornment position="start" sx={{ pl: 1 }}>
                        <Avatar
                          sx={{
                            width: 22,
                            height: 22,
                            fontSize: 10,
                            bgcolor: "primary.main",
                            fontWeight: 700,
                          }}
                        >
                          {formData.assignee.name[0]}
                        </Avatar>
                      </InputAdornment>
                    ) : (
                      params.InputProps.startAdornment
                    ),
                  }}
                />
              )}
              // Premium Dropdown List Styling
              renderOption={(props, option) => (
                <Box
                  component="li"
                  {...props}
                  sx={{
                    px: "12px !important",
                    py: "8px !important",
                    "&:hover": { bgcolor: "#f1f5f9 !important" },
                  }}
                >
                  <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                    sx={{ width: "100%" }}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        fontSize: 14,
                        fontWeight: 700,
                        bgcolor: "primary.light",
                        color: "primary.main",
                      }}
                    >
                      {option.name[0]}
                    </Avatar>

                    <Box sx={{ flexGrow: 1 }}>
                      <Typography
                        sx={{
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          color: "#1e293b",
                        }}
                      >
                        {option.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "#64748b", display: "block", mt: -0.5 }}
                      >
                        {option.role.name || "Developer"}
                      </Typography>
                    </Box>

                    {/* Optional: Add a "Current Workload" badge */}
                    <Chip
                      label="Active"
                      size="small"
                      sx={{
                        height: 20,
                        fontSize: "0.65rem",
                        fontWeight: 800,
                        bgcolor: "#f0fdf4",
                        color: "#16a34a",
                        border: "1px solid #dcfce7",
                      }}
                    />
                  </Stack>
                </Box>
              )}
            />
          </Box>
          {/* File Uplink Area */}
          <Box
            sx={{
              p: 2,
              bgcolor: "#f8fafc",
              borderRadius: "16px",
              border: "1px solid #e2e8f0",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: 800,
                color: "#94a3b8",
                mb: 1,
                display: "block",
              }}
            >
              ATTACH_ASSETS
            </Typography>

            {/* Image Preview Gallery */}
            {pendingFiles.length > 0 && (
              <Stack
                direction="row"
                spacing={1}
                sx={{ mb: 2, flexWrap: "wrap", gap: 1 }}
              >
                {pendingFiles.map((pf, idx) => (
                  <Box
                    key={idx}
                    sx={{ position: "relative", width: 64, height: 64 }}
                  >
                    <img
                      src={pf.preview}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "8px",
                        border: "1px solid #cbd5e1",
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => removeFile(idx)}
                      sx={{
                        position: "absolute",
                        top: -8,
                        right: -8,
                        bgcolor: "#ef4444",
                        color: "#fff",
                        p: 0.2,
                        "&:hover": { bgcolor: "#dc2626" },
                      }}
                    >
                      <CancelIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                ))}
              </Stack>
            )}

            <Button
              variant="outlined"
              startIcon={<AttachFileIcon />}
              onClick={() => fileInputRef.current?.click()}
              sx={{
                borderRadius: "8px",
                textTransform: "none",
                borderColor: "#cbd5e1",
                color: "#64748b",
              }}
            >
              Add Files
            </Button>
            <input
              type="file"
              multiple
              hidden
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
            />
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 4, pt: 0 }}>
        <Button onClick={onClose} sx={{ color: "#94a3b8", fontWeight: 700 }}>
          Abort
        </Button>
        <Button
          variant="contained"
          onClick={handleFormSubmit}
          disabled={!formData.title}
          endIcon={<SendIcon />}
          sx={{
            bgcolor: "#0ea5e9",
            borderRadius: "12px",
            px: 4,
            fontWeight: 700,
            textTransform: "none",
          }}
        >
          Transmit Intel
        </Button>
      </DialogActions>
    </Dialog>
  );
}
