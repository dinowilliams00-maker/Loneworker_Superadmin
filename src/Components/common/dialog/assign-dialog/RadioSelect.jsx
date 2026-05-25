// DeviceReassignDialog.jsx

import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    RadioGroup,
    FormControlLabel,
    Radio,
    Grid,
    Box,
    Pagination,
    Typography,
    Paper,
    CircularProgress,
    Skeleton,
} from "@mui/material";

import ConfirmationDialog from "../confirmation-dialog";

// image
import Nodata from "../../assets/image/nodata.png";

const DeviceReassignDialog = ({
    open,
    setOpen,
    devices = [],
    onSubmit,
    title = "Reassign device",
    loading = false,
    assign,
    setAssign,
    selectedDevice = "",
    setSelectedDevice,
    totalDocuments = 0,
}) => {
    // ================= HANDLE RADIO =================

    const handleDeviceChange = (event) => {
        setSelectedDevice(event.target.value);
    };

    // ================= CLOSE =================

    const onClose = () => {
        setOpen(false);
    };

    // ================= PAGINATION =================

    const handlePageChange = (_event, value) => {
        // MUI pagination is 1-based
        setAssign((prev) => ({
            ...prev,
            page: value - 1,
        }));
    };

    // ================= SUBMIT =================

    const handleSubmit = () => {
        if (selectedDevice && onSubmit) {
            onSubmit(selectedDevice);
        }

        handleClose();
    };

    // ================= RESET =================

    const handleClose = () => {
        setSelectedDevice("");

        setAssign((prev) => ({
            ...prev,
            page: 0,
        }));

        onClose();
    };

    // ================= CARD CLICK =================

    const handleCardClick = (deviceId) => {
        setSelectedDevice(deviceId);
    };

    // ================= PAGINATION DATA =================

    const from =
        assign.page * assign.rowPerPage + 1;

    const to = Math.min(
        (assign.page + 1) * assign.rowPerPage,
        totalDocuments
    );

    const totalPages = Math.ceil(
        totalDocuments / assign.rowPerPage
    );

    // ================= UI =================

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
        >
            {/* Header */}
            <DialogTitle
                sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    pb: 1,
                    display: "flex",
                }}
            >
                <Typography
                    variant="h6"
                    component="div"
                >
                    {title}
                </Typography>

                <ConfirmationDialog
                    message="Are you sure you want to cancel?"
                    icon
                    handleCloseFirst={onClose}
                />
            </DialogTitle>

            {/* Content */}
            <DialogContent
                sx={{
                    mt: 3,
                    minHeight: 200,
                }}
            >
                {/* Loading */}
                {loading ? (
                    <Grid container spacing={2}>
                        {[...Array(assign.rowPerPage)].map(
                            (_, index) => (
                                <Grid
                                    item
                                    xs={6}
                                    key={index}
                                >
                                    <Paper
                                        sx={{
                                            p: 1,
                                            borderRadius: 2,
                                            height: 80,
                                            border:
                                                "1px solid #e0e0e0",
                                        }}
                                    >
                                        <Box
                                            display="flex"
                                            flexDirection="column"
                                            gap={1}
                                        >
                                            <Skeleton
                                                variant="text"
                                                width="60%"
                                            />

                                            <Skeleton
                                                variant="text"
                                                width="40%"
                                            />
                                        </Box>
                                    </Paper>
                                </Grid>
                            )
                        )}
                    </Grid>
                ) : devices.length === 0 ? (
                    // No Data
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        height="100%"
                        mt={2}
                    >
                        <img
                            src={Nodata}
                            alt="No Data"
                            style={{
                                maxWidth: 220,
                            }}
                        />
                    </Box>
                ) : (
                    // Device List
                    <RadioGroup
                        value={selectedDevice}
                        onChange={handleDeviceChange}
                        name="device-selection"
                    >
                        <Grid container spacing={2}>
                            {devices.map((device) => (
                                <Grid
                                    item
                                    xs={6}
                                    key={device.id}
                                >
                                    <Paper
                                        elevation={0}
                                        onClick={() =>
                                            handleCardClick(
                                                device.id
                                            )
                                        }
                                        sx={{
                                            height: "100%",
                                            display: "flex",
                                            alignItems: "center",
                                            border: "1px solid",

                                            borderColor:
                                                selectedDevice ===
                                                    device.id
                                                    ? "primary.main"
                                                    : "grey.300",

                                            borderRadius: 2,

                                            p: 1,

                                            cursor: "pointer",

                                            transition:
                                                "all 0.2s ease",

                                            "&:hover": {
                                                borderColor:
                                                    "primary.main",

                                                backgroundColor:
                                                    "grey.50",
                                            },

                                            backgroundColor:
                                                selectedDevice ===
                                                    device.id
                                                    ? "primary.50"
                                                    : "transparent",
                                        }}
                                    >
                                        <FormControlLabel
                                            value={device.id}
                                            control={
                                                <Radio size="small" />
                                            }
                                            label={
                                                <Box
                                                    display="flex"
                                                    flexDirection="column"
                                                >
                                                    <Typography
                                                        variant="subtitle1"
                                                        fontWeight={500}
                                                    >
                                                        {device.name}
                                                    </Typography>

                                                    <Typography
                                                        variant="body1"
                                                        color="text.secondary"
                                                        sx={{
                                                            wordBreak:
                                                                "break-word",

                                                            overflowWrap:
                                                                "break-word",
                                                        }}
                                                    >
                                                        {
                                                            device.deviceType
                                                        }
                                                    </Typography>
                                                </Box>
                                            }
                                            sx={{
                                                margin: 0,

                                                width: "100%",

                                                display: "flex",

                                                alignItems:
                                                    "flex-start",

                                                "& .MuiFormControlLabel-label":
                                                {
                                                    width: "100%",

                                                    overflow:
                                                        "hidden",
                                                },
                                            }}
                                        />
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </RadioGroup>
                )}

                {/* Pagination */}
                {!loading &&
                    devices.length > 0 &&
                    totalDocuments > 0 && (
                        <Box
                            sx={{
                                display: "flex",

                                justifyContent:
                                    "space-between",

                                alignItems: "center",

                                mt: 3,

                                mb: 1,
                            }}
                        >
                            <Typography
                                variant="body2"
                                color="text.secondary"
                            >
                                Showing {from}–{to} of{" "}
                                {totalDocuments}
                            </Typography>

                            <Pagination
                                count={totalPages}
                                page={assign.page + 1}
                                onChange={handlePageChange}
                                color="primary"
                                size="medium"
                                showFirstButton
                                showLastButton
                                sx={{
                                    "& .MuiPaginationItem-root":
                                    {
                                        color: "black",
                                        borderColor:
                                            "black",
                                    },

                                    "& .MuiPaginationItem-root.Mui-selected":
                                    {
                                        backgroundColor:
                                            "black",

                                        color: "white",
                                    },

                                    "& .MuiPaginationItem-root:hover":
                                    {
                                        backgroundColor:
                                            "#f0f0f0",
                                    },
                                }}
                            />
                        </Box>
                    )}
            </DialogContent>

            {/* Footer */}
            <DialogActions>
                <Grid container width="100%" spacing={2}>
                    <Grid item xs={6}>
                        <ConfirmationDialog
                            handleCloseFirst={onClose}
                            message="Are you sure you want to cancel?"
                        />
                    </Grid>

                    <Grid item xs={6}>
                        <Button
                            type="submit"
                            variant="outlined"
                            disabled={!selectedDevice}
                            fullWidth
                            onClick={handleSubmit}
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
                            {loading ? (
                                <CircularProgress
                                    size="23px"
                                    color="secondary"
                                />
                            ) : (
                                "Submit"
                            )}
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Dialog>
    );
};

export default DeviceReassignDialog;