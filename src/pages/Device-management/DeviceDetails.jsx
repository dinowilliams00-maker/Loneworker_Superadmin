import {
    Box,
    Grid,
    Typography,
    Chip,
} from "@mui/material";

import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";

import ManagementGrid from "../../Components/common/managementGrid";
import DetailsListingSkeleton from "../../Components/common/skelenton/detailsListingSkeleton";
import { notifyError, notifySuccess } from "../../Components/common/snackbar";
import CustomTextField from "../../Components/common/textfield";
import { useGetDeviceById, useDeleteDeviceById } from "../../services/apis/device";

import EditDevice from "./dialogs/EditDevice";

// ================= STATUS CHIP =================
const StatusChip = ({ status }) => {
    const getStatusStyle = (status) => {
        const s = status?.toLowerCase()?.trim();

        if (["active", "excellent"].includes(s)) {
            return { bg: "#e6f9ec", color: "#3FB00F", label: status };
        }
        if (["fair", "in repair", "repair"].includes(s)) {
            return { bg: "#fff7e0", color: "#F6B000", label: "In Repair" };
        }
        if (["inactive", "bad", "office"].includes(s)) {
            return { bg: "#ffecec", color: "#FF3B30", label: status };
        }
        return { bg: "#e0e0e0", color: "#424242", label: status || "Unknown" };
    };

    const { bg, color, label } = getStatusStyle(status);

    return (
        <Chip
            label={label}
            size="small"
            sx={{
                backgroundColor: bg,
                color: color,
                fontWeight: 600,
                borderRadius: "6px",
                "& .MuiChip-label": { px: 2 },
            }}
        />
    );
};

const DeviceDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // ================= STATE FOR EDIT DIALOG =================
    const [openEdit, setOpenEdit] = useState(false);

    // ================= API =================
    const { data: deviceDetails, isLoading } = useGetDeviceById(id);
    const { mutate: deleteDevice } = useDeleteDeviceById();

    // ================= EDIT HANDLER =================
    const handleEditClick = () => {
        setOpenEdit(true);
    };


    // ================= DELETE DEVICE =================
    const handleDeleteDevice = () => {
        if (id) {
            // assignedTo comes from the device response — data.userId
            const assignedTo = deviceDetails?.data?.userId;
            const deviceId = deviceDetails?.data?._id; // _id from response

            deleteDevice(
                { id: deviceId, assignedTo },
                {
                    onSuccess: (data) => {
                        notifySuccess(data?.message || "Device Deleted Successfully");
                        navigate("/device-management");
                    },
                    onError: (error) => {
                        notifyError(error?.message || "Something went wrong");
                    },
                }
            );
        }
    };

    // ================= DEVICE INFO =================
    const deviceInfo = [
        { label: "Device ID", value: deviceDetails?.data?.deviceId || "NA" },
        { label: "Serial Number", value: deviceDetails?.data?.serialNumber || "NA" },
        { label: "IMEI", value: deviceDetails?.data?.imei || "NA" },
        {
            label: "SIM Number",
            value: deviceDetails?.data?.simId?.simNumber || "NA"
        },
        {
            label: "Mobile Number",
            value: deviceDetails?.data?.simId?.mobileNumber || "NA"
        },
        { label: "Account Type", value: deviceDetails?.data?.poolType || "NA" },
        {
            label: "Status",
            value: (
                <CustomTextField
                    disabled
                    disabledColor={
                        deviceDetails?.data?.status === "Active"
                            ? "#3FB00F"
                            : "#FF3B30"
                    }
                    value={deviceDetails?.data?.status || "NA"}
                />
            ),
        },
        {
            label: "Organization",
            value: deviceDetails?.data?.orgId?.name || "NA"
        },
        {
            label: "SIM Assigned",
            value: (
                <CustomTextField
                    disabled
                    disabledColor={
                        deviceDetails?.data?.isSimAssigned
                            ? "#2e7d32"
                            : "#d32f2f"
                    }
                    value={
                        deviceDetails?.data?.isSimAssigned
                            ? "Yes"
                            : "No"
                    }
                />
            ),
        },
        {
            label: "Organization Assigned",
            value: deviceDetails?.data?.isOrgAssigned ? "Yes" : "No"
        },
        {
            label: "Assigned At",
            value: deviceDetails?.data?.assignedAt
                ? moment(deviceDetails.data.assignedAt).format("DD-MM-YYYY HH:mm")
                : "NA",
        },
        {
            label: "Created At",
            value: deviceDetails?.data?.createdAt
                ? moment(deviceDetails.data.createdAt).format("DD-MM-YYYY HH:mm")
                : "NA",
        },
        {
            label: "Updated At",
            value: deviceDetails?.data?.updatedAt
                ? moment(deviceDetails.data.updatedAt).format("DD-MM-YYYY HH:mm")
                : "NA",
        },
    ];
    console.log("Device Info", deviceInfo)

    return (
        <>
            {/* ================= HEADER ================= */}
            <ManagementGrid
                moduleName="Device Details"
                breadcrumbItems={[
                    { label: "Device Management", link: "/device-management" },
                    { label: deviceDetails?.data?.deviceId || "Device Details", link: `/device-management/${id}` },
                ]}

                // === Edit Button ===
                button="Edit Device"
                handleClickOpen={handleEditClick}
                edit={true}

                // === Delete Button ===
                deleteBtn="Delete Device"
                deleteFunction={handleDeleteDevice}
            />

            {/* ================= DEVICE DETAILS ================= */}
            {isLoading ? (
                <DetailsListingSkeleton listingHead={deviceInfo} />
            ) : (
                <Grid
                    container
                    className="custom-Grid"
                    spacing={3}
                    bgcolor="white"
                    p={3}
                    borderRadius={6}
                    mt={2}
                >
                    <Grid size={12}>
                        <Typography variant="h6" fontWeight={600}>
                            Device Information
                        </Typography>
                    </Grid>

                    <Grid size={12}>
                        <Grid container spacing={2}>
                            {deviceInfo.map((item, index) => (
                                <Grid
                                    size={{ xs: 12, md: index < 2 ? 4 : 4 }}
                                    key={index}
                                >
                                    <Typography mb={1} variant="subtitle1">
                                        {item.label}
                                    </Typography>
                                    {React.isValidElement(item.value) ? (
                                        item.value
                                    ) : (
                                        <CustomTextField
                                            disabled
                                            value={item.value}
                                        />
                                    )}
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            )}

            {/* ================= EDIT DEVICE DIALOG ================= */}
            <EditDevice
                open={openEdit}
                setOpen={setOpenEdit}
                deviceDetails={deviceDetails}
                id={id}
            />
        </>
    );
};

export default DeviceDetails;