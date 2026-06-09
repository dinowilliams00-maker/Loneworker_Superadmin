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
import Calendar from "../../../Components/common/textfield/DatePicker/index";
import { useState } from "react";
import { CalanderIcon } from "../../../Components/common/icons";// ================= EDIT SIM COMPONENT =================
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
        setValue,
        watch,
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

    // ================= CALENDAR STATE =================
    const [openCalendar, setOpenCalendar] = useState(false);
    const activationDateValue = watch("activationDate");

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
                            maxLength={15}
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
                            value={
                                activationDateValue
                                    ? moment(activationDateValue).format("DD-MM-YYYY")
                                    : ""
                            }
                            label="Activation Date"
                            placeholder="Select Activation Date"
                            shrink
                            field="icon"
                            icon={<CalanderIcon />}
                            handleClickOpen={() => setOpenCalendar(true)}
                        />
                        <Calendar
                            openClick={openCalendar}
                            setOpenClick={setOpenCalendar}
                            showDate={false}
                            defaultDateRange={
                                activationDateValue
                                    ? {
                                          startDate: new Date(activationDateValue),
                                          endDate: new Date(activationDateValue),
                                          key: "selection",
                                      }
                                    : undefined
                            }
                            getDataFromChildHandler={(ranges) => {
                                if (ranges && ranges.length > 0) {
                                    setValue("activationDate", ranges[0].startDate, {
                                        shouldValidate: true,
                                        shouldDirty: true,
                                    });
                                }
                            }}
                        />
                    </Grid>

                </Grid>
            </CommonDialog>
        </>
    );
};

export default EditSim;