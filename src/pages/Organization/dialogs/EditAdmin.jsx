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

import { UpdateOrgById } from "../../../services/apis/organnization";

// ================= OPTIONS =================

const noMotionAlertOptions = [
    {
        label: "True",
        value: "true",
    },
    {
        label: "False",
        value: "false",
    },
];

const accountTypeOptions = [
    {
        label: "Demo",
        value: "demo",
    },
    {
        label: "Production",
        value: "production",
    },
];

const EditAdmin = ({
    open,
    setOpen,
    organizationDetails,
    id,
}) => {

    // ================= FORM =================

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
            noMotionAlert: "true",
            accountType: "demo",
        },
    });

    // ================= SET DEFAULT VALUES =================

    useEffect(() => {

        if (
            open &&
            organizationDetails?.data
        ) {

            reset({
                name:
                    organizationDetails?.data?.name ||
                    "",

                email:
                    organizationDetails?.data?.email ||
                    "",

                phone:
                    organizationDetails?.data?.phone ||
                    "",

                noMotionAlert:
                    organizationDetails?.data
                        ?.noMotionAlert
                        ? "true"
                        : "false",

                accountType:
                    organizationDetails?.data
                        ?.accountType
                        ?.toLowerCase() ||
                    "demo",
            });
        }

    }, [
        open,
        organizationDetails,
        reset,
    ]);

    // ================= UPDATE API =================

    const {
        mutate: updateOrganization,
        isPending,
    } = UpdateOrgById();

    // ================= HANDLE CLOSE =================

    const handleClose = () => {

        setOpen(false);


    };

    // ================= SUBMIT =================

    const onSubmit = (values) => {

        const payload = {
            name: values.name,
            email: values.email,
            phone: values.phone,

            noMotionAlert:
                values.noMotionAlert ===
                "true",

            accountType:
                values.accountType,
        };

        console.log(
            "UPDATE PAYLOAD:",
            payload
        );

        updateOrganization(
            {
                id,
                formData: payload,
            },
            {
                onSuccess(data) {

                    notifySuccess(
                        data?.message ||
                        "Organization Updated Successfully"
                    );

                    handleClose();
                },

                onError(error) {

                    notifyError(
                        error?.message ||
                        "Something went wrong"
                    );
                },
            }
        );
    };

    return (
        <>
            <CommonDialog
                open={open}
                title="Edit Admin"
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
                                required:
                                    "Name is required",
                            })}
                            placeholder="Enter Name"
                            label="Name"
                            name="name"
                            shrink
                            error={!!errors.name}
                            helperText={
                                errors.name?.message
                            }
                        />
                    </Grid>

                    {/* ================= EMAIL ================= */}

                    <Grid size={12}>
                        <CustomTextField
                            {...register("email", {
                                required:
                                    "Email is required",

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
                            helperText={
                                errors.email?.message
                            }
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
                            helperText={
                                errors.phone?.message
                            }
                            maxLength={10}
                        />
                    </Grid>

                    {/* ================= ACCOUNT TYPE ================= */}

                    <Grid size={12}>
                        <Controller
                            name="accountType"
                            control={control}
                            render={({ field }) => (
                                <CustomSelect
                                    label="Account Type"
                                    name={field.name}
                                    value={field.value ?? "demo"}
                                    onChange={(selected) =>
                                        field.onChange(selected.value)
                                    }
                                    options={accountTypeOptions}
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
                            sx={{
                                mt: 2
                            }}
                            render={({ field }) => (
                                <CustomSelect
                                    label="No Motion Alert"
                                    name={field.name}
                                    value={field.value ?? "true"}
                                    onChange={(selected) =>
                                        field.onChange(selected.value)
                                    }
                                    options={noMotionAlertOptions}
                                    placeholder="Select Option"
                                    fullWidth
                                    sx={{
                                        mt: 2
                                    }}
                                />
                            )}
                        />
                    </Grid>

                </Grid>
            </CommonDialog>
        </>
    );
};

export default EditAdmin;