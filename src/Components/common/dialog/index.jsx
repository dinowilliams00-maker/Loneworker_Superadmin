// CommonDialog.jsx

import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button,
    IconButton,
    Grid,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

const CommonDialog = ({
    onClose,
    title = "Dialog Title",
    message = "Dialog Message",
    color = "primary",
    messageSize = "medium",
    onConfirm,
    icon = true,
    ...otherProps
}) => {
    return (
        <Dialog onClose={onClose} {...otherProps} maxWidth="xs" fullWidth>
            {/* Header */}
            <DialogTitle
                sx={{
                    backgroundColor: (theme) => theme.palette.error.main,
                    p: "8px 16px 8px 16px",
                }}
            >
                <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <Typography variant="h6" color="#fff">
                        {title}
                    </Typography>

                    {icon && (
                        <IconButton aria-label="close" onClick={onClose}>
                            <CloseIcon sx={{ color: "#fff", fontSize: "20px" }} />
                        </IconButton>
                    )}
                </Grid>
            </DialogTitle>

            {/* Content */}
            <DialogContent>
                <Typography
                    variant={
                        messageSize === "small"
                            ? "body2"
                            : messageSize === "large"
                                ? "h5"
                                : "h6"
                    }
                    mt={2}
                >
                    {message}
                </Typography>
            </DialogContent>

            {/* Footer */}
            <DialogActions>
                <Grid container width="100%" spacing={2}>
                    <Grid item xs={6}>
                        {onConfirm && (
                            <Button
                                onClick={onConfirm}
                                color={color}
                                variant="outlined"
                                fullWidth
                                sx={{
                                    color: "#ff0000",
                                    borderColor: "#ff0000",
                                    "&:hover": {
                                        color: "#ff0000",
                                        borderColor: "#ff0000",
                                    },
                                }}
                            >
                                Confirm
                            </Button>
                        )}
                    </Grid>

                    <Grid item xs={6}>
                        {onClose && (
                            <Button
                                onClick={onClose}
                                color="inherit"
                                variant="outlined"
                                fullWidth
                            >
                                Cancel
                            </Button>
                        )}
                    </Grid>
                </Grid>
            </DialogActions>
        </Dialog>
    );
};

export default CommonDialog;