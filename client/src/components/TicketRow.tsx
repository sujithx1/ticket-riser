import { UsePostComment } from "@/api/api";
import type { Comment, Issue } from "@/types/types";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CancelIcon from "@mui/icons-material/Cancel";
import FilePresentIcon from "@mui/icons-material/FilePresent";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import SendIcon from "@mui/icons-material/Send";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Collapse,
  IconButton,
  Stack,
  TableCell,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid"; // Using Grid2 for stable layouts
import React, { useRef, useState } from "react";

interface TicketRowProps {
  row: Issue;
  initialComments: Comment[];
}

export const TicketRow = ({ row, initialComments }: TicketRowProps) => {
  const postcreatecommentMuntation = UsePostComment();
  const [open, setOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  // Local state to manage comments for this specific row
  const [comments, setComments] = useState<Comment[]>(initialComments || []);
  const [pendingFiles, setPendingFiles] = useState<
    { file: File; preview: string }[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleTransmit = () => {
    if (!newComment.trim() && pendingFiles.length === 0) return;

    // Simulate the object structure for your Drizzle 'issueComments' table
    const newEntry = {
      // id: new Date().toISOString(),
      issueId: row.id,
      // userName: currentUser.name,
      // userRole: currentUser.role,
      comment: newComment,
      // commentType: "user",
      attachments: pendingFiles.map((f) => ({
        name: f.file.name,
        url: f.preview,
      })),

      // createdAt: new Date(),
    };

    // Send the new entry to the server
    postcreatecommentMuntation.mutate(newEntry, {
      onSuccess: (data) => {
        setComments((prev: Comment[]) => [...prev, data]);

        // Clear the form
        setNewComment("");
        setPendingFiles([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
      },
    });

    // Update local state to show it working immediately
  };

  return (
    <React.Fragment>
      {/* HEADER ROW */}
      <TableRow
        onClick={() => setOpen(!open)}
        sx={{
          cursor: "pointer",
          // When open, add a subtle blue tint and a left-side "Active" border
          bgcolor: open ? "rgba(14, 165, 233, 0.04)" : "inherit",
          borderLeft: open ? "4px solid #0ea5e9" : "4px solid transparent",
          transition: "all 0.2s ease",
          "&:hover": { bgcolor: open ? "rgba(14, 165, 233, 0.08)" : "#f8fafc" },
        }}
      >
        {/* EXPAND ICON - Styled like a System Toggle */}
        <TableCell sx={{ width: 40, pr: 0 }}>
          <IconButton
            size="small"
            sx={{
              color: open ? "#0ea5e9" : "#94a3b8",
              bgcolor: open ? "#e0f2fe" : "transparent",
            }}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        {/* CREATED BY - Industrial ID Style */}
        <TableCell sx={{ py: 2 }}>
          <Typography
            sx={{
              fontFamily: "'JetBrains Mono', monospace",
              color: "#16a34a",
              fontWeight: 800,
              fontSize: "0.85rem",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            {/* <Box component="span" sx={{ opacity: 0.5 }}>USR_</Box> */}
            {row.createdBy.name.toUpperCase()}
          </Typography>
        </TableCell>

        {/* CREATED AT - System Timestamp */}
        <TableCell>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Typography
              sx={{
                fontFamily: "monospace",
                color: "#ef4444",
                fontWeight: 700,
                fontSize: "0.75rem",
                letterSpacing: "-0.5px",
              }}
            >
              {new Date(row.createdAt).toLocaleDateString()}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "#94a3b8", fontSize: "0.65rem", fontWeight: 600 }}
            >
              {new Date(row.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Typography>
          </Box>
        </TableCell>

        {/* TITLE - Bold Ticket Subject */}
        <TableCell
          sx={{ fontWeight: 700, color: "#1e293b", fontSize: "0.9rem" }}
        >
          {row.title}
        </TableCell>

        {/* PRIORITY - High-Contrast Slab Chip */}
        <TableCell>
          <Chip
            label={row.priority.toUpperCase()}
            size="small"
            sx={{
              fontWeight: 900,
              fontSize: "9px",
              borderRadius: "4px", // Sharper corners for industrial feel
              bgcolor: row.priority === "high" ? "#fee2e2" : "#e0f2fe",
              color: row.priority === "high" ? "#ef4444" : "#0ea5e9",
              border: "1px solid",
              borderColor: row.priority === "high" ? "#fecaca" : "#bae6fd",
            }}
          />
        </TableCell>

        {/* STATUS - Badge Style with Pulse */}
        <TableCell>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                bgcolor: row.status === "open" ? "#f59e0b" : "#10b981",
                boxShadow: `0 0 8px ${row.status === "open" ? "rgba(245, 158, 11, 0.4)" : "rgba(16, 185, 129, 0.4)"}`,
              }}
            />
            <Typography
              variant="caption"
              sx={{
                fontWeight: 800,
                color: "#475569",
                fontFamily: "monospace",
                letterSpacing: "0.5px",
              }}
            >
              {row.status.toUpperCase()}
            </Typography>
          </Stack>
        </TableCell>
      </TableRow>

      {/* DETAIL COLLAPSE */}
      <TableRow>
        <TableCell
          sx={{ p: 0, borderBottom: open ? "1px solid #e2e8f0" : "none" }}
          colSpan={6}
        >
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box
              sx={{
                m: 2,
                p: 3,
                border: "1px solid #e2e8f0",
                borderRadius: "16px",
                bgcolor: "#fff",
              }}
            >
              <Grid container spacing={4}>
                {/* TECHNICAL DATA */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography
                    variant="overline"
                    color="primary"
                    fontWeight={900}
                  >
                    Technical Brief
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "#475569", mt: 1, lineHeight: 1.6 }}
                  >
                    {row.description}
                  </Typography>

                  <Box mt={3}>
                    <Typography variant="overline" color="text.secondary">
                      Asset Manifest
                    </Typography>
                    <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                      {(row.attachments || []).map((file: string) => (
                        <Chip
                          key={file}
                          label={file}
                          size="small"
                          variant="outlined"
                          icon={<FilePresentIcon />}
                        />
                      ))}
                    </Stack>
                  </Box>
                </Grid>

                {/* LOGS & INPUT */}
                <Grid size={{ xs: 12, md: 8 }}>
                  <Typography
                    variant="overline"
                    color="primary"
                    fontWeight={900}
                  >
                    Transmission Log
                  </Typography>

                  <Box
                    sx={{
                      mt: 1,
                      maxHeight: "400px",
                      overflowY: "auto",
                      bgcolor: "#f1f5f9", // Slightly darker base to make white cards pop
                      p: 2,
                      borderRadius: "16px",
                      display: "flex",
                      flexDirection: "column",
                      gap: 1.5,
                    }}
                  >
                    {comments.length > 0 ? (
                      comments.map((c: any) => {
                        // Logic: User (Left) vs DevTeam (Right)
                        const isDev = c.commentType === "dev-team";

                        return (
                          <Box
                            key={c.id}
                            sx={{
                              maxWidth: "85%",
                              alignSelf: isDev ? "flex-end" : "flex-start",
                              display: "flex",
                              flexDirection: "column",
                              alignItems: isDev ? "flex-end" : "flex-start",
                            }}
                          >
                            {/* Comment Bubble */}
                            <Box
                              sx={{
                                p: 2,
                                bgcolor: isDev ? "#0ea5e9" : "#fff", // Blue for Dev, White for User
                                color: isDev ? "#fff" : "#1e293b",
                                borderRadius: isDev
                                  ? "16px 16px 2px 16px"
                                  : "16px 16px 16px 2px",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                                border: isDev ? "none" : "1px solid #e2e8f0",
                              }}
                            >
                              {/* Header: Name & Time */}
                              <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                mb={0.5}
                                justifyContent={
                                  isDev ? "flex-end" : "flex-start"
                                }
                              >
                                {!isDev && (
                                  <Avatar
                                    sx={{
                                      width: 20,
                                      height: 20,
                                      fontSize: "9px",
                                      bgcolor: "#94a3b8",
                                    }}
                                  >
                                    {c.user.name[0]}
                                  </Avatar>
                                )}
                                <Typography
                                  variant="caption"
                                  fontWeight={700}
                                  sx={{
                                    opacity: isDev ? 0.9 : 1,
                                    fontSize: "0.7rem",
                                  }}
                                >
                                  {c.user.name}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{ opacity: 0.6, fontSize: "0.65rem" }}
                                >
                                  •{" "}
                                  {new Date(c.createdAt).toLocaleTimeString(
                                    [],
                                    { hour: "2-digit", minute: "2-digit" },
                                  )}
                                </Typography>
                              </Stack>

                              {/* Message Body */}
                              <Typography
                                variant="body2"
                                sx={{ lineHeight: 1.5 }}
                              >
                                {c.comment}
                              </Typography>

                              {/* Attachments Section */}
                              {c.attachments && c.attachments?.length > 0 && (
                                <Stack direction="row" spacing={1} mt={1.5}>
                                  {c.attachments.map((file: any, i: number) => (
                                    <Box
                                      key={i}
                                      sx={{
                                        borderRadius: "8px",
                                        overflow: "hidden",
                                        border: isDev
                                          ? "1px solid rgba(255,255,255,0.2)"
                                          : "1px solid #e2e8f0",
                                      }}
                                    >
                                      {file.url ? (
                                        <img
                                          src={file.url}
                                          alt="attachment"
                                          style={{
                                            width: 80,
                                            height: 60,
                                            objectFit: "cover",
                                          }}
                                        />
                                      ) : (
                                        <Box
                                          sx={{
                                            p: 0.5,
                                            bgcolor: isDev
                                              ? "rgba(255,255,255,0.1)"
                                              : "#f8fafc",
                                            display: "flex",
                                            alignItems: "center",
                                          }}
                                        >
                                          <FilePresentIcon
                                            sx={{ fontSize: 14, mr: 0.5 }}
                                          />
                                          <Typography
                                            variant="caption"
                                            sx={{ fontSize: "10px" }}
                                          >
                                            File
                                          </Typography>
                                        </Box>
                                      )}
                                    </Box>
                                  ))}
                                </Stack>
                              )}
                            </Box>
                          </Box>
                        );
                      })
                    ) : (
                      <Box sx={{ textAlign: "center", py: 4 }}>
                        <Typography variant="caption" color="text.disabled">
                          NO_LOGS_AVAILABLE
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {/* INPUT ZONE */}
                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      bgcolor: "#f1f5f9",
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    {/* IMAGE PREVIEW */}
                    {pendingFiles.length > 0 && (
                      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                        {pendingFiles.map((pf, idx) => (
                          <Box
                            key={idx}
                            sx={{ position: "relative", width: 50, height: 50 }}
                          >
                            <img
                              src={pf.preview}
                              alt="preview"
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: "6px",
                              }}
                            />
                            <IconButton
                              size="small"
                              onClick={() => removeFile(idx)}
                              sx={{
                                position: "absolute",
                                top: -5,
                                right: -5,
                                bgcolor: "#ef4444",
                                color: "#fff",
                                padding: "2px",
                                "&:hover": { bgcolor: "#dc2626" },
                              }}
                            >
                              <CancelIcon sx={{ fontSize: 12 }} />
                            </IconButton>
                          </Box>
                        ))}
                      </Stack>
                    )}

                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      variant="standard"
                      placeholder="Add system update..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      InputProps={{
                        disableUnderline: true,
                        sx: { fontSize: "14px" },
                      }}
                    />
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      mt={1}
                    >
                      <IconButton
                        size="small"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <AttachFileIcon fontSize="small" />
                        <input
                          type="file"
                          multiple
                          hidden
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept="image/*"
                        />
                      </IconButton>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={handleTransmit}
                        endIcon={<SendIcon sx={{ fontSize: 14 }} />}
                        sx={{
                          bgcolor: "#0ea5e9",
                          textTransform: "none",
                          px: 3,
                          fontWeight: 700,
                        }}
                      >
                        Transmit
                      </Button>
                    </Stack>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};
