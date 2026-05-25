// AssignAssessment.jsx

import React, { useState, useEffect } from "react";

import { useForm } from "react-hook-form";

import {
    DialogActions,
    DialogContent,
    Button,
} from "@mui/material";

// Components
import CommonDialog from "../common-dialog";
import ConfirmationDialog from "src/components/dialog/confirmation-dialog";

// Utils
import axios from "axios";

// Snackbar Functions
import {
    notifyError,
    notifySuccess,
} from "src/components/snackbar";

const AssignAssessment = ({
    macId,
    url,
    open,
    setOpen,
    title,
    reFetch,
}) => {
    const { handleSubmit, reset } = useForm();

    // ================= STATES =================

    const [select, setSelect] = useState([]);

    const [page] = useState(0);

    const [rowsPerPage] = useState(10);

    const [searchQuery, setSearchQuery] = useState("");

    const [getAllList, setGetAllList] = useState([]);

    const [loading, setLoading] = useState(false);

    // ================= API GET DATA =================

    const getData = async () => {
        setLoading(true);

        try {
            const res = await axios.get(
                `${url}?page=${page + 1}&limit=${rowsPerPage}&search=${searchQuery}`
            );

            if (res?.status === 200 || res?.status === 201) {
                setGetAllList(res?.data?.data);

                setLoading(false);
            }
        } catch (err) {
            setLoading(false);
        }
    };

    // ================= USE EFFECT =================

    useEffect(() => {
        if (open) {
            getData();
        }
    }, [open, page, rowsPerPage, searchQuery]);

    // ================= HANDLE CLOSE =================

    const handleClose = () => {
        setOpen(false);

        setSelect([]);

        setSearchQuery("");

        reset();
    };

    // ================= SUBMIT =================

    const handleAssessmentSubmit = async () => {
        if (!Boolean(select)) {
            notifyError("Please select at least one item!");

            return;
        }

        const body = {
            siteIds: [select?._id],
        };

        try {
            const res = await axios.post(
                `/api/v1/site/assignSiteToUser/${macId}`,
                body
            );

            if (res?.status === 200 || res?.status === 201) {
                notifySuccess("Sites assigned successfully");

                reFetch();

                handleClose();
            }
        } catch (error) {
            handleClose();

            notifyError(
                error?.response?.data?.error ||
                "Error assigning agent"
            );
        }
    };

    // ================= UI =================

    return (
        <div>
            <CommonDialog
                open={open}
                maxWidth="md"
                fullWidth={true}
                title={title}
                onClose={handleClose}
                titleConfirm="Cancel"
                message="Are you sure you want to cancel?"
            >
                <form
                    onSubmit={handleSubmit(
                        handleAssessmentSubmit
                    )}
                >
                    {/* Content */}
                    <DialogContent>
                        {/* Your FirstTab Component Here */}

                        {/* Example */}
                        {/* 
            <FirstTab
              select={select}
              rowsPerPage={rowsPerPage}
              page={page}
              getAllList={getAllList}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              loading={loading}
            />
            */}
                    </DialogContent>

                    {/* Footer */}
                    <DialogActions
                        className="dialog-action-btn"
                    >
                        <ConfirmationDialog
                            message="Are you sure you want to cancel?"
                            handleCloseFirst={handleClose}
                        />

                        <Button
                            variant="contained"
                            type="submit"
                        >
                            Submit
                        </Button>
                    </DialogActions>
                </form>
            </CommonDialog>
        </div>
    );
};

export default AssignAssessment;