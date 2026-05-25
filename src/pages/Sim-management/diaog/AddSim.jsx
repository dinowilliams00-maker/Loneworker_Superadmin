import React from "react";
import { Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import moment from "moment";

import {
    notifyError,
    notifySuccess,
} from "../../../Components/common/snackbar";

import CommonDialog from "../../../Components/common/dialog/common-dialog";
import CustomTextField from "../../../Components/common/textfield";
import { useAddSim } from "../../../services/apis/sim";



const AddSim = ({ open, setOpen }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        mode: "onChange",
        defaultValues: {
            simNumber: "",
            mobileNumber: "",
            provider: "",
            activationDate: "",
        },
    });

    // ================= REACT QUERY MUTATION =================
    const { mutate: addSim, isPending } = useAddSim();

    // ================= HANDLE CLOSE =================
    const handleClose = () => {
        setOpen(false);
        reset();
    };

    // ================= SUBMIT =================
    const onSubmit = (values) => {
        const payload = {
            simNumber: values.simNumber,
            mobileNumber: values.mobileNumber,
            provider: values.provider?.trim() || null,
            activationDate: values.activationDate
                ? moment(values.activationDate).toISOString()
                : null,
        };

        console.log("Add SIM Payload:", payload);

        addSim(payload, {
            onSuccess: (data) => {
                notifySuccess(
                    data?.message || "SIM Added Successfully"
                );
                handleClose();
            },
            onError: (error) => {
                notifyError(
                    error?.message || "Something went wrong"
                );
            },
        });
    };

    return (
        <>
            <CommonDialog
                open={open}
                title="Add SIM"
                onClose={handleClose}
                message="Are you sure you want to cancel?"
                maxWidth="sm"
                fullWidth
                handleSubmit={handleSubmit(onSubmit)}
                loading={isPending}
            >
                <Grid container spacing={2}>
                    {/* ================= SIM NUMBER (Required) ================= */}
                    <Grid size={12}>
                        <CustomTextField
                            {...register("simNumber", {
                                required: "SIM Number is required",
                            })}
                            placeholder="Enter SIM Number"
                            label="SIM Number"
                            name="simNumber"
                            shrink
                            error={!!errors.simNumber}
                            helperText={errors.simNumber?.message}
                        />
                    </Grid>

                    {/* ================= MOBILE NUMBER (Required) ================= */}
                    <Grid size={12}>
                        <CustomTextField
                            {...register("mobileNumber", {
                                required: "Mobile Number is required",
                                pattern: {
                                    value: /^\d{10}$/,
                                    message: "Mobile Number must be 10 digits",
                                },
                            })}
                            placeholder="Enter Mobile Number"
                            label="Mobile Number"
                            name="mobileNumber"
                            shrink
                            error={!!errors.mobileNumber}
                            helperText={errors.mobileNumber?.message}
                            maxLength={10}
                        />
                    </Grid>

                    {/* ================= PROVIDER (Optional - Text Field) ================= */}
                    <Grid size={12}>
                        <CustomTextField
                            {...register("provider")}
                            placeholder="Enter Provider Name (Optional)"
                            label="Provider"
                            name="provider"
                            shrink
                        />
                    </Grid>

                    {/* ================= ACTIVATION DATE (Optional) ================= */}
                    <Grid size={12}>
                        <CustomTextField
                            {...register("activationDate")}
                            type="date"
                            label="Activation Date"
                            name="activationDate"
                            shrink
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                </Grid>
            </CommonDialog>
        </>
    );
};

export default AddSim;