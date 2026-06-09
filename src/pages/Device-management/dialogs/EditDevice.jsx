import React, { useEffect } from "react";
import { Grid } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import {
    notifyError,
    notifySuccess,
} from "../../../Components/common/snackbar";

import CommonDialog from "../../../Components/common/dialog/common-dialog";
import CustomTextField from "../../../Components/common/textfield";
import CustomSelect from "../../../Components/common/customSelect";

import { useUpdateDeviceById } from "../../../services/apis/device";

// ================= OPTIONS =================

const poolTypeOptions = [
    { label: "Demo", value: "Demo" },
    { label: "Production", value: "Production" },
];

const statusOptions = [
    { label: "Inactive", value: "Inactive" },
    { label: "Active", value: "Active" },
    { label: "In Repair", value: "In Repair" },
];

const EditDevice = ({ open, setOpen, deviceDetails, id, onSuccess }) => {
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm({
        mode: "onChange",
        defaultValues: {
            deviceId: "",
            serialNumber: "",
            imei: "",
            simNo: "",
            poolType: "",
            status: "",
        },
    });

    useEffect(() => {
        if (deviceDetails?.data && open) {
            reset({
                deviceId: deviceDetails.data.deviceId || "",
                serialNumber: deviceDetails.data.serialNumber || "",
                imei: deviceDetails.data.imei || "",
                simNo: deviceDetails.data.simId?.simNumber || "",
                poolType: deviceDetails.data.poolType || "Demo",
                status: deviceDetails.data.status || "Active",
            });
        }
    }, [deviceDetails, open, reset]);

    // ================= REACT QUERY MUTATION =================

    const { mutate: updateDevice, isPending } = useUpdateDeviceById();

    // ================= HANDLE CLOSE =================

    const handleClose = () => {
        setOpen(false);
        reset();
    };

    // ================= SUBMIT =================

    const onSubmit = (values) => {
        const payload = {
            deviceId: values.deviceId.trim(),
            serialNumber: values.serialNumber.trim(),
            imei: values.imei.trim(),
            simNo: values.simNo.trim(),
            poolType: values.poolType,
            status: values.status,
        };

        // Extract assignedTo (which is userId) from device details
        const assignedTo = deviceDetails?.data?.userId || "";

        updateDevice(
            { id, assignedTo, data: payload },
            {
                onSuccess: (data) => {
                    notifySuccess(data?.message || "Device Updated Successfully");
                    handleClose();
                    onSuccess?.();
                },
                onError: (error) => {
                    notifyError(error?.message || "Something went wrong");
                },
            }
        );
    };

    return (
        <CommonDialog
            open={open}
            title="Edit Device"
            onClose={handleClose}
            message="Are you sure you want to cancel editing?"
            maxWidth="sm"
            fullWidth
            handleSubmit={handleSubmit(onSubmit)}
            loading={isPending}
        >
            <Grid container spacing={2}>
                {/* ================= DEVICE ID ================= */}

                <Grid size={12}>
                    <CustomTextField
                        {...register("deviceId", {
                            minLength: {
                                value: 2,
                                message: "Device ID must be at least 2 characters",
                            },
                        })}
                        placeholder="Enter Device ID"
                        label="Device ID"
                        name="deviceId"
                        shrink
                        error={!!errors.deviceId}
                        helperText={errors.deviceId?.message}
                    />
                </Grid>

                {/* ================= SERIAL NUMBER ================= */}

                <Grid size={12}>
                    <CustomTextField
                        {...register("serialNumber")}
                        placeholder="Enter Serial Number"
                        label="Serial Number"
                        name="serialNumber"
                        shrink
                        error={!!errors.serialNumber}
                        helperText={errors.serialNumber?.message}
                    />
                </Grid>

                {/* ================= IMEI ================= */}

                <Grid size={12}>
                    <CustomTextField
                        {...register("imei", {
                           minLength: {
                            value: 15,
                            message: "IMEI must be exactly 15 digits",
                        },
                        maxLength: {
                            value: 15,
                            message: "IMEI must be exactly 15 digits",
                        },
                        pattern: {
                            value: /^\d{15}$/,
                            message: "IMEI must contain only numbers and be exactly 15 digits",
                        },
                        })}
                        placeholder="Enter IMEI Number"
                        label="IMEI"
                        name="imei"
                        shrink
                        error={!!errors.imei}
                        helperText={errors.imei?.message}
                        maxLength={15}
                    />
                </Grid>

                {/* ================= Account TYPE ================= */}

                <Grid size={12}>
                    <Controller
                        name="poolType"
                        control={control}
                        rules={{}}
                        render={({ field }) => (
                            <CustomSelect 
                                label="Account Type"
                                name={field.name}
                                value={field.value}
                                onChange={(selected) => field.onChange(selected.value)}
                                options={poolTypeOptions}
                                error={!!errors.poolType}
                                helperText={errors.poolType?.message}
                                placeholder="Select Pool Type"
                                fullWidth
                            />
                        )}
                    />
                </Grid>

                {/* ================= STATUS ================= */}

                <Grid size={12}>
                    <Controller
                        name="status"
                        control={control}
                        rules={{}}
                        render={({ field }) => (
                            <CustomSelect
                                label="Status"
                                name={field.name}
                                value={field.value}
                                onChange={(selected) => field.onChange(selected.value)}
                                options={statusOptions}
                                error={!!errors.status}
                                helperText={errors.status?.message}
                                placeholder="Select Status"
                                fullWidth
                                sx={{ mt: 2 }}
                            />
                        )}
                    />
                </Grid>
            </Grid>
        </CommonDialog>
    );
};

export default EditDevice;
