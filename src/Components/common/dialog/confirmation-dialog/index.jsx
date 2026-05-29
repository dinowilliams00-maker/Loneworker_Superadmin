// CustomizedDialogs.jsx

import React, { useState } from "react";

import { styled } from "@mui/material/styles";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Typography,
    Button,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";

// ================= Styled Dialog =================

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },

    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));

// ================= Dialog Title =================

function BootstrapDialogTitle({
    children,
    onClose,
    ...other
}) {
    return (
        <DialogTitle
            {...other}
            sx={{
                backgroundColor: (theme) => theme.palette.error.light,
                color: (theme) => theme.palette.common.white,
                position: "relative",
            }}
        >
            {children}

            {onClose && (
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    size="small"
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 12,
                        color: (theme) => theme.palette.common.white,
                    }}
                >
                    <CloseIcon sx={{ fontSize: "20px" }} />
                </IconButton>
            )}
        </DialogTitle>
    );
}

// ================= Main Component =================

const CustomizedDialogs = ({
    handleCloseFirst,
    icon,
    message,
    deleteBtn,
    deleteFunction,
    title = "Confirmation",
    btnIcon,
    btnBgColor,
    btnHoverColor,
}) => {
    const [open, setOpen] = useState(false);

    const fullWidth = true;
    const maxWidth = "xs";

    // ================= Handlers =================

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCloseBoth = () => {
        setOpen(false);

        if (deleteFunction) {
            deleteFunction();
        }

        if (handleCloseFirst) {
            handleCloseFirst(null, "");
        }
    };

    // ================= Render =================

    return (
        <div>
            {/* Top Right Close Icon */}
            {icon ? (
                <IconButton
                    aria-label="close"
                    size="small"
                    onClick={() => {
                        if (handleCloseFirst) {
                            handleCloseFirst(null, "");
                        }
                    }}
                    sx={{
                        position: "absolute",
                        right: 10,
                        top: 12,
                        color: (theme) => theme.palette.secondary.main,
                    }}
                >
                    <CloseIcon sx={{ fontSize: "20px" }} />
                </IconButton>
            ) : deleteBtn ? (
                // Delete Button
                <Button
                    onClick={handleClickOpen}
                    startIcon={btnIcon || <DeleteIcon />}
                    variant="contained"
                    size="large"
                    sx={{
                        color: "#FFFFFF",
                        backgroundColor: btnBgColor || "#FF3B30",
                        "&:hover": {
                            backgroundColor: btnHoverColor || btnBgColor || "#FF3B30",
                        },
                    }}
                >
                    {deleteBtn}
                </Button>
            ) : (
                // Cancel Button
                <Button
                    variant="outlined"
                    onClick={handleClickOpen}
                    fullWidth
                >
                    Cancel
                </Button>
            )}

            {/* Dialog */}
            <BootstrapDialog
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                {/* Header */}
                <BootstrapDialogTitle
                    id="customized-dialog-title"
                    onClose={handleClose}
                >
                    <Typography variant="h6">
                        {title}
                    </Typography>
                </BootstrapDialogTitle>

                {/* Content */}
                <DialogContent dividers>
                    <Typography variant="h6" color="#000">
                        {message}
                    </Typography>
                </DialogContent>

                {/* Footer */}
                <DialogActions>
                    <Button
                        variant="contained"
                        onClick={handleCloseBoth}
                        fullWidth
                        sx={{
                            color: "#fff",
                            borderColor: "#FF3B30",
                            backgroundColor: "#FF3B30",

                            "&:hover": {
                                color: "#fff",
                                borderColor: "#FF3B30",
                                backgroundColor: "#FF3B30",
                            },
                        }}
                    >
                        YES
                    </Button>

                    <Button
                        variant="outlined"
                        onClick={handleClose}
                        fullWidth
                        sx={{
                            color: "black",
                            borderColor: "black",

                            "&:hover": {
                                borderColor: "black",
                                color: "black",
                                backgroundColor: "#ddd",
                            },
                        }}
                    >
                        NO
                    </Button>
                </DialogActions>
            </BootstrapDialog>
        </div>
    );
};

export default CustomizedDialogs;