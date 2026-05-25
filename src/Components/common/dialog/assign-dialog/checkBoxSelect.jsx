// DeviceReassignDialog.jsx

import React from "react";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    FormGroup,
    FormControlLabel,
    Checkbox,
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
    title = "Reassign devices",
    loading = false,
    assign,
    setAssign,
    selectedDevices = [],
    setSelectedDevices,
    totalDocuments = 0,
}) => {
    // ================= HANDLE SELECT DEVICE =================

    const handleDeviceChange = (deviceId) => {
        setSelectedDevices((prev) => {
            if (prev.includes(deviceId)) {
                return prev.filter((id) => id !== deviceId);
            } else {
                return [...prev, deviceId];
            }
        });
    };

    // ================= CLOSE =================

    const onClose = () => {
        setOpen(false);
    };

    // ================= PAGINATION =================

    const handlePageChange = (_event, value) => {
        setAssign((prev) => ({
            ...prev,
            page: value - 1,
        }));
    };

    // ================= SUBMIT =================

    const handleSubmit = () => {
        if (selectedDevices.length > 0 && onSubmit) {
            onSubmit(selectedDevices);
        }

        handleClose();
    };

    // ================= RESET =================

    const handleClose = () => {
        setSelectedDevices([]);

        setAssign((prev) => ({
            ...prev,
            page: 0,
        }));

        onClose();
    };

    // ================= CARD CLICK =================

    const handleCardClick = (deviceId) => {
        handleDeviceChange(deviceId);
    };

    // ================= SELECT ALL =================

    const handleSelectAll = () => {
        if (devices.length === selectedDevices.length) {
            // deselect current page
            setSelectedDevices((prev) =>
                prev.filter(
                    (id) =>
                        !devices.some((device) => device.id === id)
                )
            );
        } else {
            // select current page
            const currentPageDeviceIds = devices.map(
                (device) => device.id
            );

            setSelectedDevices((prev) => {
                const newSelection = [...prev];

                currentPageDeviceIds.forEach((id) => {
                    if (!newSelection.includes(id)) {
                        newSelection.push(id);
                    }
                });

                return newSelection;
            });
        }
    };

    // ================= PAGINATION VALUES =================

    const from =
        assign.page * assign.rowPerPage + 1;

    const to = Math.min(
        (assign.page + 1) * assign.rowPerPage,
        totalDocuments
    );

    const totalPages = Math.ceil(
        totalDocuments / assign.rowPerPage
    );

    // ================= CHECK SELECTED =================

    const allCurrentPageSelected =
        devices.length > 0 &&
        devices.every((device) =>
            selectedDevices.includes(device.id)
        );

    const someCurrentPageSelected =
        devices.some((device) =>
            selectedDevices.includes(device.id)
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
                <Box>
                    <Typography variant="h6">
                        {title}
                    </Typography>

                    {selectedDevices.length > 0 && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            {selectedDevices.length} workers
                            {selectedDevices.length > 1
                                ? "s"
                                : ""}{" "}
                            selected
                        </Typography>
                    )}
                </Box>

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
                                <Grid item xs={6} key={index}>
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
                    <>
                        {/* Select All */}
                        <Box
                            sx={{
                                mb: 2,
                                borderBottom:
                                    "1px solid #e0e0e0",
                                pb: 1,
                            }}
                        >
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={
                                            allCurrentPageSelected
                                        }
                                        indeterminate={
                                            someCurrentPageSelected &&
                                            !allCurrentPageSelected
                                        }
                                        onChange={handleSelectAll}
                                        size="small"
                                    />
                                }
                                label={
                                    <Typography
                                        variant="body2"
                                        fontWeight={500}
                                    >
                                        Select all on this page
                                    </Typography>
                                }
                            />
                        </Box>

                        {/* Devices */}
                        <FormGroup>
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
                                                    selectedDevices.includes(
                                                        device.id
                                                    )
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
                                                    selectedDevices.includes(
                                                        device.id
                                                    )
                                                        ? "primary.50"
                                                        : "transparent",
                                            }}
                                        >
                                            <FormControlLabel
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
                                                control={
                                                    <Checkbox
                                                        checked={selectedDevices.includes(
                                                            device.id
                                                        )}
                                                        onChange={() =>
                                                            handleDeviceChange(
                                                                device.id
                                                            )
                                                        }
                                                        size="small"
                                                    />
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
                                            />
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </FormGroup>
                    </>
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
                                        borderColor: "black",
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
                            disabled={
                                selectedDevices.length === 0
                            }
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
                                `Submit (${selectedDevices.length})`
                            )}
                        </Button>
                    </Grid>
                </Grid>
            </DialogActions>
        </Dialog>
    );
};

export default DeviceReassignDialog;