import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Button, Typography, Grid } from "@mui/material";

import { saveAs } from "file-saver";
import * as ExcelJS from "exceljs";

import CommonDialog from "../../../Components/common/dialog/common-dialog";
import { notifyError, notifySuccess } from "../../../Components/common/snackbar";
import { useDeviceBulkUpload } from "../../../services/apis/device";
import { CloudDownloadIcon, CloudIcon, FileIcon } from "../../../Components/common/icons";

const BulkUploadDevice = ({ openUpload, setOpenUpload }) => {
    const [file, setFile] = useState(null);
    const { mutate: bulkUploadDevice, isPending } = useDeviceBulkUpload();

    const handleCloseUpload = () => {
        setOpenUpload(false);
        setFile(null);
    };

    const onDrop = (acceptedFiles) => {
        setFile(acceptedFiles[0]);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xls", ".xlsx", ".csv"],
        },
        maxSize: 10485760, // 10MB
    });

    const upLoadFile = async (e) => {
        e.preventDefault();
        if (!file) {
            notifyError("No file selected");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        bulkUploadDevice(formData, {
            onSuccess: (data) => {
                notifySuccess(data?.message || "Devices uploaded successfully");
                handleCloseUpload();
            },
            onError: (error) => {
                console.error(error);
                notifyError(error?.message || error?.msg || "Upload failed");
            },
        });
    };

    // ================= DOWNLOAD SAMPLE TEMPLATE =================
    const handleExportDeviceTemplate = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Devices");

        // Updated Columns as per your requirement
        worksheet.columns = [
            { header: "Device Id", key: "deviceId", width: 20 },
            { header: "Serial Number", key: "serialNumber", width: 25 },
            { header: "IMEI", key: "imei", width: 25 },
            { header: "Batch", key: "batch", width: 20 },
        ];

        // Style Header
        const headerRow = worksheet.getRow(1);
        headerRow.font = { bold: true, color: { argb: "FFFFFFFF" } };
        headerRow.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FF1976D2" }, // Blue background
        };

        const numberOfRows = 10;

        // Add empty rows
        for (let i = 0; i < numberOfRows; i++) {
            worksheet.addRow({
                deviceId: "",
                serialNumber: "",
                imei: "",
                batch: "",
            });
        }

        // Force text format for important fields
        worksheet.getColumn("deviceId").numFmt = "@";
        worksheet.getColumn("serialNumber").numFmt = "@";
        worksheet.getColumn("imei").numFmt = "@";

        // Add note at the bottom
        // worksheet.getCell("A13").value = "Note: deviceId, serialNumber, and imei are required fields";
        worksheet.getCell("A13").font = { italic: true, color: { argb: "FFFF0000" } };

        // Export file
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        saveAs(blob, "sample_device_template.xlsx");
    };

    return (
        <CommonDialog
            open={openUpload}
            maxWidth="sm"
            fullWidth
            title="Bulk Upload Devices"
            message="Are you sure you want to cancel?"
            titleConfirm="Cancel"
            onClose={handleCloseUpload}
            handleSubmit={upLoadFile}
            loading={isPending}
        >
            <Grid container justifyContent="space-between" alignItems="center">
                <Typography variant="h6" color="#000">
                    Upload Devices
                </Typography>
                <Button
                    onClick={handleExportDeviceTemplate}
                    startIcon={<CloudDownloadIcon />}
                    variant="outlined"
                    size="large"
                >
                    Download sample file
                </Button>
            </Grid>

            <Box
                sx={{
                    border: "2px dashed #e0e0e0",
                    borderRadius: "8px",
                    padding: "16px",
                    textAlign: "center",
                    marginTop: "20px",
                    color: "#000",
                }}
            >
                <Box
                    {...getRootProps()}
                    sx={{
                        border: "2px dashed #ccc",
                        borderRadius: "8px",
                        padding: "40px",
                        cursor: "pointer",
                        marginBottom: "16px",
                    }}
                >
                    <input {...getInputProps()} />
                    <CloudIcon fontSize="40px" />
                    <Typography variant="h6" color="primary">
                        Drop file or click browse
                    </Typography>
                    <Typography variant="body2">(XLSX format, up to 10MB)</Typography>
                    <Button
                        variant="contained"
                        sx={{ mt: 2, color: "#FFF" }}
                        color="secondary"
                    >
                        Browse Files
                    </Button>
                </Box>

                {file && (
                    <Box sx={{ marginBottom: "16px" }}>
                        <FileIcon fontSize="30px" />
                        <Typography>{file.name}</Typography>
                        <Typography variant="body2">
                            {`${(file.size / 1024).toFixed(2)} KB`}
                        </Typography>
                    </Box>
                )}
            </Box>
        </CommonDialog>
    );
};

export default BulkUploadDevice;