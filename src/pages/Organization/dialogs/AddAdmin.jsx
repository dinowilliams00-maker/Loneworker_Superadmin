import React from "react";
import { Grid } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import {
    notifyError,
    notifySuccess,
} from "../../../Components/common/snackbar";

import CommonDialog from "../../../Components/common/dialog/common-dialog";
import CustomTextField from "../../../Components/common/textfield";

import { useAddAdmin } from "../../../services/apis/organnization";
import CustomSelect from "../../../Components/common/customSelect";

const noMotionAlertOptions = [
    { label: "True", value: "true" },
    { label: "False", value: "false" },
];

const accountTypeOptions = [
    { label: "Demo", value: "demo" },
    { label: "Production", value: "production" },
];

const AddAdmin = ({ open, setOpen }) => {
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm({
        mode: "onChange",

        defaultValues: {
            name: "",
            email: "",
            phone: "",
            role: 1,
            noMotionAlert: "true",
            accountType: "Demo",
        },
    });

    // ================= REACT QUERY MUTATION =================

    const { mutate: addAdmin, isPending } =
        useAddAdmin();

    // ================= HANDLE CLOSE =================

    const handleClose = () => {
        setOpen(false);
        reset();
    };

    // ================= SUBMIT =================

    const onSubmit = (values) => {
        const payload = {
            initAdminDetails: {
                name: values.name,
                email: values.email,
                phone: values.phone,
                role: Number(values.role),

                // convert string to boolean
                noMotionAlert:
                    values.noMotionAlert === "true",

                accountType: values.accountType,
            },
        };

        console.log(" Payload:", payload);

        addAdmin(payload, {
            onSuccess(data) {
                notifySuccess(
                    data?.message ||
                    "Admin Added Successfully"
                );

                handleClose();
            },

            onError(error) {
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
                title="Add Admin"
                onClose={handleClose}
                message="Are you sure want to cancel?"
                maxWidth="sm"
                fullWidth
                handleSubmit={handleSubmit(onSubmit)}
                loading={isPending}
            >
                <Grid container spacing={2}>
                    {/* ================= NAME ================= */}

                    <Grid size={12}>
                        <CustomTextField
                            {...register("name", {
                                required: "Name is required",
                            })}
                            placeholder="Enter Name"
                            label="Name"
                            name="name"
                            shrink
                            error={!!errors.name}
                            helperText={errors.name?.message}
                        />
                    </Grid>

                    {/* ================= EMAIL ================= */}

                    <Grid size={12}>
                        <CustomTextField
                            {...register("email", {
                                required: "Email is required",

                                pattern: {
                                    value:
                                        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,

                                    message:
                                        "Invalid email address",
                                },
                            })}
                            placeholder="Enter Email"
                            label="Email"
                            name="email"
                            shrink
                            error={!!errors.email}
                            helperText={errors.email?.message}
                        />
                    </Grid>

                    {/* ================= PHONE ================= */}

                    <Grid size={12}>
                        <CustomTextField
                            {...register("phone", {
                                pattern: {
                                    value: /^\d{10}$/,

                                    message:
                                        "Phone Number must be 10 digits",
                                },
                            })}
                            placeholder="Enter Phone Number"
                            label="Phone Number"
                            name="phone"
                            shrink
                            error={!!errors.phone}
                            helperText={errors.phone?.message}
                            maxLength={10}
                        />
                    </Grid>

                    {/* ================= ROLE ================= */}
                    {/* 
                    <Grid size={12}>
                        <CustomTextField
                            {...register("role")}
                            select
                            SelectProps={{
                                native: true,
                            }}
                            label="Role"
                            name="role"
                            shrink
                        >
                            {roleOptions.map((item) => (
                                <option
                                    key={item.value}
                                    value={item.value}
                                >
                                    {item.label}
                                </option>
                            ))}
                        </CustomTextField>
                    </Grid> */}

                    {/* ================= ACCOUNT TYPE ================= */}

                    <Grid size={12}>
                        <Controller
                            name="accountType"
                            control={control}
                            rules={{
                                required: "Account Type is required",
                            }}
                            render={({ field }) => (
                                <CustomSelect
                                    label="Account Type"
                                    name={field.name}
                                    value={field.value}
                                    onChange={(selected) =>
                                        field.onChange(selected.value)
                                    }
                                    options={accountTypeOptions}
                                    error={!!errors.accountType}
                                    helperText={errors.accountType?.message}
                                    placeholder="Select Account Type"
                                    fullWidth
                                />
                            )}
                        />
                    </Grid>

                    {/* ================= NO MOTION ALERT ================= */}

                    <Grid size={12}>
                        <Controller
                            name="noMotionAlert"
                            control={control}
                            render={({ field }) => (
                                <CustomSelect
                                    label="No Motion Alert"
                                    name={field.name}
                                    value={field.value}
                                    onChange={(selected) =>
                                        field.onChange(selected.value)
                                    }
                                    options={noMotionAlertOptions}
                                    placeholder="Select Option"
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

export default AddAdmin;