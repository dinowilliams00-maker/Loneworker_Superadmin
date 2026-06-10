import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Button, Typography, Grid } from "@mui/material";



import { saveAs } from "file-saver";
import * as ExcelJS from "exceljs";

import CommonDialog from "../../../Components/common/dialog/common-dialog";
import { notifyError, notifySuccess } from "../../../Components/common/snackbar";
import { useBulkSimUpload } from "../../../services/apis/sim";
import { CloudDownloadIcon, CloudIcon, FileIcon } from "../../../Components/common/icons";

const BulkUploadSim = ({ openUpload, setOpenUpload }) => {
    const [file, setFile] = useState(null);
    const { mutate: bulkUploadSim, isPending } = useBulkSimUpload();

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
        formData.append("file", file);   // Important: Append file to FormData

        bulkUploadSim(formData, {
            onSuccess: (data) => {
                notifySuccess(data?.message || "SIMs uploaded successfully");
                handleCloseUpload();
            },
            onError: (error) => {
                console.log(error);
                notifyError(error?.message || error?.msg || "Upload failed");
            },
        });
    };

    // ================= DOWNLOAD SAMPLE TEMPLATE =================
    const handleExportSimTemplate = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("SIMs");

        // Define Columns
        worksheet.columns = [
            { header: "SIM Number", key: "simNumber", width: 20 },
            { header: "Mobile Number", key: "mobileNumber", width: 20 },
            { header: "Provider", key: "provider", width: 20 },
            { header: "Activation Date", key: "activationDate", width: 20 },
        ];

        // Style Header
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFFFFFFF" },
        };

        const numberOfRows = 10;

        // Add empty rows
        for (let i = 0; i < numberOfRows; i++) {
            worksheet.addRow({
                simNumber: "",
                mobileNumber: "",
                provider: "",
                activationDate: "",
            });
        }

        // Force text format for simNumber and mobileNumber
        worksheet.getColumn("simNumber").numFmt = "@";
        worksheet.getColumn("mobileNumber").numFmt = "@";

        // Optional: Add note about required field
        // s
        worksheet.getCell("A12").font = { italic: true, color: { argb: "FFFF0000" } };

        // Export
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        saveAs(blob, "sample_sim_template.xlsx");
    };

    return (
        <CommonDialog
            open={openUpload}
            maxWidth="sm"
            fullWidth
            title="Bulk Upload SIM"
            message="Are you sure you want to cancel?"
            titleConfirm="Cancel"
            onClose={handleCloseUpload}
            handleSubmit={upLoadFile}
            loading={isPending}
        >
            <Grid container justifyContent="space-between" alignItems="center">
                <Typography variant="h6" color="#000">
                    Upload SIMs
                </Typography>
                <Button
                    onClick={handleExportSimTemplate}
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

export default BulkUploadSim;