// CommonDialog.jsx

import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Button,
    CircularProgress,
    Grid,
    Typography,
} from "@mui/material";

// component
import CancelAlertDialog from "./confirmation-dialog";

const CommonDialog = ({
    message,
    title,
    onClose,
    children,
    titleConfirm,
    handleSubmit,
    loading = false,
    isStepper = false,
    activeStep = 0,
    totalSteps = 3,
    handleNext,
    handleBack,
    onlyCancel = false,
    noButton = false,
    noAlert = false,
    ...otherProps
}) => {
    return (
        <Dialog onClose={onClose} {...otherProps}>
            <DialogTitle
                sx={{
                    alignItems: "center",
                    display: "flex",
                    position: "sticky",
                    zIndex: 100,
                    backgroundColor: "#fff",
                }}
            >
                {onClose ? (
                    <CancelAlertDialog
                        icon={true}
                        message={message}
                        handleCloseFirst={onClose}
                    />
                ) : null}

                <Typography variant="h6" color="secondary">
                    {title}
                </Typography>
            </DialogTitle>

            <Box sx={{ overflow: "auto" }}>
                <form onSubmit={handleSubmit}>
                    <DialogContent dividers>{children}</DialogContent>

                    {!noButton && (
                        <DialogActions>
                            {!isStepper ? (
                                <Grid container width={"100%"} spacing={2}>
                                    <Grid size={{ xs: 6 }}>
                                        {noAlert ? (
                                            <Button
                                                variant="outlined"
                                                fullWidth
                                                onClick={onClose}
                                            >
                                                Cancel
                                            </Button>
                                        ) : (
                                            <CancelAlertDialog
                                                handleCloseFirst={onClose}
                                                message={message}
                                            />
                                        )}
                                    </Grid>

                                    <Grid size={{ xs: 6 }}>
                                        <Button type="submit" variant="contained" fullWidth>
                                            {loading ? (
                                                <CircularProgress
                                                    size={"23px"}
                                                    color="secondary"
                                                />
                                            ) : (
                                                "Submit"
                                            )}
                                        </Button>
                                    </Grid>
                                </Grid>
                            ) : (
                                <Grid container width={"100%"} spacing={2}>
                                    <Grid item xs={activeStep >= 1 ? 4 : 6}>
                                        <CancelAlertDialog
                                            handleCloseFirst={onClose}
                                            message={message}
                                        />
                                    </Grid>

                                    {activeStep >= 1 && (
                                        <Grid item xs={4}>
                                            <Button
                                                variant="outlined"
                                                onClick={handleBack}
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
                                                Back
                                            </Button>
                                        </Grid>
                                    )}

                                    {activeStep < totalSteps && (
                                        <Grid item xs={activeStep >= 1 ? 4 : 6}>
                                            <Button
                                                type="submit"
                                                variant="contained"
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
                                                Next
                                            </Button>
                                        </Grid>
                                    )}

                                    {activeStep === totalSteps && (
                                        <Grid item xs={4}>
                                            <Button type="submit" variant="contained" fullWidth>
                                                {loading ? (
                                                    <CircularProgress
                                                        size={"23px"}
                                                        color="secondary"
                                                    />
                                                ) : (
                                                    "Submit"
                                                )}
                                            </Button>
                                        </Grid>
                                    )}
                                </Grid>
                            )}
                        </DialogActions>
                    )}
                </form>
            </Box>
        </Dialog>
    );
};

export default CommonDialog;