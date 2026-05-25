import React from "react";
import { Grid, Typography, Button } from "@mui/material";
import Breadcrumbs from "src/components/customBreadcrum";
import { EditIcon, AddIcon } from "../icons";
import CustomSelect from "../customSelect";
import { MdSos } from "react-icons/md";
import ConfirmationDialog from "src/components/dialog/confirmation-dialog";

const ManagementGrid = ({
    moduleName,
    button,
    handleClickOpen,
    subHeading,
    buttonUpload,
    handleClickOpenUpload,
    deleteFunction,
    breadcrumbItems,
    buttonAgent,
    handleClickOpenAgent,
    deleteBtn,
    edit,
    select,
    textData,
    textDataColor,
    sync,
}) => {
    return (
        <>
            <Grid
                container
                justifyContent="space-between"
                alignItems="center"
                size={12}
                mb={3}
            >
                <Grid>
                    <Typography component="h2" variant="h2" mb={1}>
                        {moduleName}
                    </Typography>
                    <Typography component="h6" variant="body2" color="grey">
                        {subHeading}
                    </Typography>
                </Grid>

                <Grid>
                    <Grid
                        container
                        gap={2}
                        justifyContent="center"
                        alignItems="center"
                    >
                        {textData && (
                            <Typography
                                component="h6"
                                variant="body1"
                                color={textDataColor || "primary.main"}
                            >
                                {textData}
                            </Typography>
                        )}

                        {buttonUpload && (
                            <Button
                                onClick={handleClickOpenUpload}
                                startIcon={<CloudIcon />}
                                variant="outlined"
                            >
                                {buttonUpload}
                            </Button>
                        )}

                        {sync && (
                            <Button
                                onClick={handleClickOpenUpload}
                                startIcon={<Sync />}
                                variant="outlined"
                            >
                                {sync}
                            </Button>
                        )}

                        {buttonAgent && (
                            <Button
                                onClick={handleClickOpenAgent}
                                startIcon={<MdSos />}
                                variant="contained"
                                color="error"
                                sx={{ color: "#fff" }}
                            >
                                {buttonAgent}
                            </Button>
                        )}

                        {button && (
                            <Button
                                onClick={handleClickOpen}
                                startIcon={edit ? <EditIcon /> : <AddIcon />}
                                variant="contained"
                            >
                                {button}
                            </Button>
                        )}

                        {deleteBtn && (
                            <ConfirmationDialog
                                deleteBtn={deleteBtn}
                                message="Are you sure you want to delete ?"
                                deleteFunction={deleteFunction}
                            />
                        )}

                        {select && (
                            <CustomSelect
                                value={select.value}
                                minWidth="150px"
                                onChange={select.onChange}
                                options={select.options || []}
                                placeholder={select.placeholder || "Select"}
                                variant={select.variant || "outlined"}
                            />
                        )}
                    </Grid>
                </Grid>

                <Grid size={12}>
                    {breadcrumbItems && <Breadcrumbs breadcrumbItems={breadcrumbItems} />}
                </Grid>
            </Grid>
        </>
    );
};

export default ManagementGrid;