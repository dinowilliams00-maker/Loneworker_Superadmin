import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import {
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Typography,
    Button,
} from "@mui/material";

import { CloseBg, DeleteIcon } from "src/components/icons";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
        padding: theme.spacing(2),
    },

    "& .MuiDialogActions-root": {
        padding: theme.spacing(1),
    },
}));

const BootstrapDialogTitle = ({
    children,
    onClose,
    ...other
}) => {
    return (
        <DialogTitle
            {...other}
            sx={{
                backgroundColor: (theme) =>
                    theme.palette.error.light,

                color: (theme) =>
                    theme.palette.common.white,
            }}
        >
            {children}

            {onClose && (
                <IconButton
                    sx={{
                        position: "absolute",
                        right: 8,
                        top: 12,
                        color: (theme) =>
                            theme.palette.common.white,
                    }}
                    aria-label="close"
                    onClick={onClose}
                    size="small"
                >
                    <CloseBg />
                </IconButton>
            )}
        </DialogTitle>
    );
};

const ConfirmationDialog = ({
    handleCloseFirst,
    icon,
    message,
    deleteBtn,
    deleteFunction,
    title = "Confirmation",
}) => {
    const [open, setOpen] = useState(false);

    const fullWidth = true;

    const maxWidth = "xs";

    // ================= OPEN DIALOG =================

    const handleClickOpen = () => {
        setOpen(true);
    };

    // ================= CLOSE DIALOG =================

    const handleClose = () => {
        setOpen(false);
    };

    // ================= DELETE FUNCTION =================

    const handleCloseBoth = () => {
        setOpen(false);

        deleteFunction?.();

        if (handleCloseFirst) {
            handleCloseFirst(null, "");
        }
    };

    return (
        <>
            {/* ================= BUTTON ================= */}

            {icon ? (
                <IconButton
                    sx={{
                        position: "absolute",
                        right: 10,
                        top: 12,
                        color: (theme) =>
                            theme.palette.secondary.main,
                    }}
                    aria-label="close"
                    onClick={() => {
                        if (handleCloseFirst) {
                            handleCloseFirst(null, "");
                        }
                    }}
                    size="small"
                >
                    <CloseBg size={"20px"} />
                </IconButton>
            ) : deleteBtn ? (
                <Button
                    onClick={handleClickOpen}
                    startIcon={<DeleteIcon />}
                    variant="contained"
                    size="large"
                    sx={{
                        color: "#FFFFFF",
                        backgroundColor: "#FF3B30",

                        "&:hover": {
                            backgroundColor: "#FF3B30",
                        },
                    }}
                >
                    {deleteBtn}
                </Button>
            ) : (
                <Button
                    variant="outlined"
                    onClick={handleClickOpen}
                    fullWidth
                >
                    Cancel
                </Button>
            )}

            {/* ================= DIALOG ================= */}

            <BootstrapDialog
                fullWidth={fullWidth}
                maxWidth={maxWidth}
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
            >
                <BootstrapDialogTitle
                    id="customized-dialog-title"
                    onClose={handleClose}
                >
                    <Typography variant="h6">
                        {title}
                    </Typography>
                </BootstrapDialogTitle>

                <DialogContent dividers>
                    <Typography
                        variant="h6"
                        color="#000"
                    >
                        {message}
                    </Typography>
                </DialogContent>

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
        </>
    );
};

export default ConfirmationDialog;