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
import Calendar from "../../../Components/common/textfield/DatePicker/index";
import { useState } from "react";
import { CalanderIcon } from "../../../Components/common/icons";const AddSim = ({ open, setOpen }) => {
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

export default AddSim;