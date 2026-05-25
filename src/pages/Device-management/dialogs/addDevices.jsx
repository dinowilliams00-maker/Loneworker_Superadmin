import React from "react";
import { Grid } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import {
    notifyError,
    notifySuccess,
} from "../../../Components/common/snackbar";

import CommonDialog from "../../../Components/common/dialog/common-dialog";
import CustomTextField from "../../../Components/common/textfield";
import CustomSelect from "../../../Components/common/customSelect";

import { useAddDevice } from "../../../services/apis/device";

// ================= OPTIONS =================

const poolTypeOptions = [
    { label: "Demo", value: "Demo" },
    { label: "Production", value: "Production" },
];

const statusOptions = [
    { label: "Inactive", value: "Inactive" },
    { label: "Active", value: "Active" },
];

const AddDevice = ({ open, setOpen, onSuccess }) => {
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
            batch: "",
            poolType: "Demo",
            status: "Active",
        },
    });

    // ================= REACT QUERY MUTATION =================

    const { mutate: addDevice, isPending } =
        useAddDevice();

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
            batch: values.batch.trim(),
            poolType: values.poolType,
            status: values.status,
        };

        console.log("Device Payload:", payload);

        addDevice(payload, {
            onSuccess: (data) => {
                notifySuccess(
                    data?.message ||
                    "Device Added Successfully"
                );

                handleClose();

                onSuccess?.();
            },

            onError: (error) => {
                notifyError(
                    error?.message ||
                    "Something went wrong"
                );
            },
        });
    };

    return (
        <>
            <CommonDialog
                open={open}
                title="Add Device"
                onClose={handleClose}
                message="Are you sure you want to cancel?"
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
                                required:
                                    "Device ID is required",

                                minLength: {
                                    value: 2,
                                    message:
                                        "Device ID must be at least 2 characters",
                                },
                            })}
                            placeholder="Enter Device ID"
                            label="Device ID"
                            name="deviceId"
                            shrink
                            error={!!errors.deviceId}
                            helperText={
                                errors.deviceId?.message
                            }
                        />
                    </Grid>

                    {/* ================= SERIAL NUMBER ================= */}

                    <Grid size={12}>
                        <CustomTextField
                            {...register("serialNumber", {
                                required:
                                    "Serial Number is required",
                            })}
                            placeholder="Enter Serial Number"
                            label="Serial Number"
                            name="serialNumber"
                            shrink
                            error={!!errors.serialNumber}
                            helperText={
                                errors.serialNumber?.message
                            }
                        />
                    </Grid>

                    {/* ================= IMEI ================= */}

                    <Grid size={12}>
                        <CustomTextField
                            {...register("imei", {
                                required:
                                    "IMEI is required",

                                minLength: {
                                    value: 10,
                                    message:
                                        "IMEI must be at least 10 digits",
                                },

                                pattern: {
                                    value: /^\d+$/,
                                    message:
                                        "IMEI must contain only numbers",
                                },
                            })}
                            placeholder="Enter IMEI Number"
                            label="IMEI"
                            name="imei"
                            shrink
                            error={!!errors.imei}
                            helperText={
                                errors.imei?.message
                            }
                            maxLength={20}
                        />
                    </Grid>

                    {/* ================= BATCH ================= */}

                    <Grid size={12}>
                        <CustomTextField
                            {...register("batch", {
                                required: "Batch is required",

                                pattern: {
                                    value: /^[A-Za-z\s]+$/,
                                    message:
                                        "Batch must contain only letters",
                                },
                            })}
                            placeholder="Enter Batch"
                            label="Batch"
                            name="batch"
                            shrink
                            error={!!errors.batch}
                            helperText={errors.batch?.message}
                        />
                    </Grid>

                    {/* ================= POOL TYPE ================= */}

                    <Grid size={12}>
                        <Controller
                            name="poolType"
                            control={control}
                            rules={{
                                required:
                                    "Pool Type is required",
                            }}
                            render={({ field }) => (
                                <CustomSelect
                                    label="Pool Type"
                                    name={field.name}
                                    value={field.value}
                                    onChange={(selected) =>
                                        field.onChange(
                                            selected.value
                                        )
                                    }
                                    options={
                                        poolTypeOptions
                                    }
                                    error={
                                        !!errors.poolType
                                    }
                                    helperText={
                                        errors.poolType
                                            ?.message
                                    }
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
                            rules={{
                                required:
                                    "Status is required",
                            }}
                            render={({ field }) => (
                                <CustomSelect
                                    label="Status"
                                    name={field.name}
                                    value={field.value}
                                    onChange={(selected) =>
                                        field.onChange(
                                            selected.value
                                        )
                                    }
                                    options={
                                        statusOptions
                                    }
                                    error={!!errors.status}
                                    helperText={
                                        errors.status?.message
                                    }
                                    placeholder="Select Status"
                                    fullWidth
                                    sx={{ mt: 2 }}
                                />
                            )}
                        />
                    </Grid>
                </Grid>
            </CommonDialog>
        </>
    );
};

export default AddDevice;