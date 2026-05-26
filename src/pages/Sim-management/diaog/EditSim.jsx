import React, { useEffect } from "react";
import { Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import moment from "moment";

import {
    notifyError,
    notifySuccess,
} from "../../../Components/common/snackbar";

import CommonDialog from "../../../Components/common/dialog/common-dialog";
import CustomTextField from "../../../Components/common/textfield";
import { useUpdateSim } from "../../../services/apis/sim";



// ================= EDIT SIM COMPONENT =================
const EditSim = ({
    open,
    setOpen,
    simDetails,     // EditAdmin
    id,             // SIM ID
}) => {

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

    // ================= SET DEFAULT VALUES =================
    useEffect(() => {
        if (open && simDetails?.data) {
            reset({
                simNumber: simDetails?.data?.simNumber || "",
                mobileNumber: simDetails?.data?.mobileNumber || "",
                provider: simDetails?.data?.provider || "",
                activationDate: simDetails?.data?.activationDate
                    ? moment(simDetails?.data?.activationDate).format("YYYY-MM-DD")
                    : "",
            });
        }
    }, [open, simDetails, reset]);

    // ================= API MUTATION =================
    const { mutate: updateSim, isPending } = useUpdateSim();

    // ================= HANDLE CLOSE =================
    const handleClose = () => {
        setOpen(false);
        reset(); // Optional: uncomment if you want to clear form on close
    };

    // ================= SUBMIT =================
    const onSubmit = (values) => {
        const payload = {
            simNumber: values.simNumber,
            mobileNumber: values.mobileNumber || null,
            provider: values.provider?.trim() || null,
            activationDate: values.activationDate
                ? moment(values.activationDate).toISOString()
                : null,
        };

        console.log("UPDATE SIM PAYLOAD:", payload);

        updateSim(
            {
                id,
                formData: payload,
            },
            {
                onSuccess: (data) => {
                    notifySuccess(
                        data?.message || "SIM Updated Successfully"
                    );
                    handleClose();
                },
                onError: (error) => {
                    notifyError(
                        error?.message || "Something went wrong"
                    );
                },
            }
        );
    };

    return (
        <>
            <CommonDialog
                open={open}
                title="Edit SIM"
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

                    {/* ================= MOBILE NUMBER ================= */}
                    <Grid size={12}>
                        <CustomTextField
                            {...register("mobileNumber", {
                                pattern: {
                                    value: /^\d{8,15}$/,
                                    message: "Mobile Number must be between 8 and 15 digits"
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

                    {/* ================= PROVIDER (Optional) ================= */}
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

export default EditSim;