import {
    Box,
    Grid,
    Typography,
    Chip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    ListItemText,
} from "@mui/material";

import { useState } from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import moment from "moment";

import {
    getAllOrgDetailsById,
    DeleteOrgById,
    getDeviceDetailsByOrgId,
    GetAllSimByOrgId,
} from "../../../services/apis/organnization";

import {
    getAllDevice,
    useUpdateDeviceStatus
} from "../../../services/apis/device";

import ManagementGrid from "../../../Components/common/managementGrid";
import { AddIcon, CloseIcon } from "../../../Components/common/icons";

import DetailsListingSkeleton from "../../../Components/common/skelenton/detailsListingSkeleton";

import {
    notifyError,
    notifySuccess,
} from "../../../Components/common/snackbar";

import CustomTextField from "../../../Components/common/textfield";

import CustomTable from "../../../Components/common/table/customTable";

import DebouncedInput from "../../../Components/common/searchField";

import CustomSelect from "../../../Components/common/customSelect";

// ================= STATUS CHIP =================

const StatusChip = ({ status }) => {
    const getStatusStyle = (status) => {
        const s = status?.toLowerCase()?.trim();

        if (["active", "excellent"].includes(s)) {
            return { bg: "#e6f9ec", color: "#3FB00F", label: status };
        }

        if (["fair", "in repair", "repair"].includes(s)) {
            return { bg: "#fff7e0", color: "#F6B000", label: "In Repair" };
        }

        if (["inactive", "bad", "office"].includes(s)) {
            return { bg: "#ffecec", color: "#FF3B30", label: status };
        }

        return { bg: "#e0e0e0", color: "#424242", label: status || "Unknown" };
    };

    const { bg, color, label } = getStatusStyle(status);

    return (
        <Chip
            label={label}
            size="small"
            sx={{
                backgroundColor: bg,
                color: color,
                fontWeight: 600,
                borderRadius: "6px",
                "& .MuiChip-label": { px: 2 },
            }}
        />
    );
};

const OrganizationDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // ================= DIALOG STATE =================
    const [openAssignDialog, setOpenAssignDialog] = useState(false);
    const [assignDialogType, setAssignDialogType] = useState(""); // "Assign" or "Unassign"
    const [selectedDevices, setSelectedDevices] = useState([]);

    // ================= PAGINATION =================
    const [devicePagination, setDevicePagination] = useState({
        page: 1,
        rowsPerPage: 10,
        searchQuery: "",
        poolType: "",
    });

    // ================= PAGINATION SIM =================
    const [simPagination, setSimPagination] = useState({
        page: 1,
        rowsPerPage: 10,
        searchQuery: "",
    });

    // ================= FILTER OPTIONS =================
    const poolTypeOptions = [
        { label: "All Pool Type", value: "" },
        { label: "Demo", value: "Demo" },
        { label: "Production", value: "Production" },
    ];

    // ================= API =================
    const { data: organizationDetails, isLoading } = getAllOrgDetailsById(id);

    const { data: deviceDetails, isLoading: deviceLoading } = getDeviceDetailsByOrgId(
        id,
        devicePagination
    );

    const { data: simDetails, isLoading: simLoading } = GetAllSimByOrgId(
        id,
        simPagination
    );

    const { mutate: deleteOrganization } = DeleteOrgById();

    const { data: allDevicesData } = getAllDevice({ limit: 1000 }, { enabled: openAssignDialog && assignDialogType === "Assign" });
    const { mutate: updateDeviceStatus, isPending: isUpdatingDevice } = useUpdateDeviceStatus();

    const handleAssignUnassignSubmit = () => {
        if (!selectedDevices || selectedDevices.length === 0) return;
        const status = assignDialogType === "Assign" ? "Assigned" : "Unassigned";

        // The ID from useParams could be the Admin ID or the Org ID.
        // We fallback to organizationDetails data to ensure we pass the correct ones.
        const targetOrgId = organizationDetails?.data?.orgId || organizationDetails?.data?.organizationId || id;
        const targetAssignedTo = organizationDetails?.data?.userId || organizationDetails?.data?.createdBy || organizationDetails?.data?.adminId;
        console.log("targetOrgId", targetOrgId)
        console.log("targetAssignedTo", targetAssignedTo)
        console.log("deviceId", selectedDevices)
        updateDeviceStatus({
            userId: targetAssignedTo,
            orgId: targetOrgId,
            status: status,
            deviceId: selectedDevices
        }, {
            onSuccess: (data) => {
                notifySuccess(data?.message || `Devices ${status} successfully`);
                setOpenAssignDialog(false);
                setSelectedDevices([]);
            },
            onError: (error) => {
                notifyError(error?.message || "Something went wrong");
            }
        });
    };

    const handleCloseAssignDialog = () => {
        setOpenAssignDialog(false);
        setSelectedDevices([]);
    };

    // ================= SEARCH =================
    const handleDeviceSearchChange = (value) => {
        setDevicePagination((prev) => ({
            ...prev,
            searchQuery: value,
            page: 1,
        }));
    };

    const handleSimSearchChange = (value) => {
        setSimPagination((prev) => ({
            ...prev,
            searchQuery: value,
            page: 1,
        }));
    };

    // ================= FILTER =================
    const handlePoolTypeChange = (selected) => {
        setDevicePagination((prev) => ({
            ...prev,
            poolType: selected?.value || "",
            page: 1,
        }));
    };

    // ================= DELETE =================
    const handleDelete = () => {
        if (id) {
            deleteOrganization(id, {
                onSuccess: (data) => {
                    notifySuccess(data?.message || "Organization Deleted Successfully");
                    navigate("/organization");
                },
                onError: (error) => {
                    notifyError(error?.message || "Something went wrong");
                },
            });
        }
    };

    // ================= ORGANIZATION INFO =================
    const organizationInfo = [
        { label: "Organization Name", value: organizationDetails?.data?.name || "NA" },
        { label: "Phone Number", value: organizationDetails?.data?.phone || "NA" },
        { label: "Email", value: organizationDetails?.data?.email || "NA" },
        { label: "Billing Address", value: organizationDetails?.data?.billingAddress || "NA" },
        { label: "Account Type", value: organizationDetails?.data?.accountType || "NA" },
        {
            label: "No Motion Alert",
            value: organizationDetails?.data?.noMotionAlert ? "True" : "False",
        },
        { label: "Device Count", value: organizationDetails?.data?.deviceCount || 0 },
        { label: "SIM Count", value: organizationDetails?.data?.simCount || 0 },
    ];

    // ================= FORMATTED DEVICE ROWS =================
    const formattedDeviceRows = (data = []) => {
        return data.map((item) => ({
            deviceId: item?.deviceId || "N/A",
            serialNumber: item?.serialNumber || "N/A",
            isSimAssigned: (
                <Typography sx={{ color: item?.isSimAssigned ? "#3FB00F" : "#FF3B30", fontWeight: 600 }}>
                    {item?.isSimAssigned ? "Yes" : "No"}
                </Typography>
            ),
            poolType: item?.poolType || "N/A",
            status: <StatusChip status={item?.status} />,
        }));
    };

    // ================= FORMATTED SIM ROWS (NEW) =================
    const formattedSimRows = (data = []) => {
        return data.map((item) => ({
            simNumber: item?.simNumber || "N/A",
            mobileNumber: item?.mobileNumber || "N/A",
            provider: item?.provider || "N/A",
            isAssigned: (
                <Typography sx={{ color: item?.isAssigned ? "#3FB00F" : "#FF3B30", fontWeight: 600 }}>
                    {item?.isAssigned ? "Yes" : "No"}
                </Typography>
            ),
            activationDate: item?.activationDate
                ? moment(item.activationDate).format("DD-MM-YYYY")
                : "N/A",
            status: <StatusChip status={item?.status} />,
        }));
    };

    return (
        <>
            {/* ================= HEADER ================= */}
            <ManagementGrid
                moduleName="Organization Details"
                breadcrumbItems={[
                    { label: "Organizations", link: "/" },
                    { label: organizationDetails?.data?.name || "Organization Details", link: `/organization/${id}` },
                ]}
                deleteBtn="Delete Organization"
                deleteFunction={handleDelete}
            />

            {/* ================= ORGANIZATION DETAILS ================= */}
            {isLoading ? (
                <DetailsListingSkeleton listingHead={organizationInfo} />
            ) : (
                <Grid container className="custom-Grid" spacing={3} bgcolor="white" p={3} borderRadius={6}>
                    <Grid size={12}>
                        <Typography variant="h6" fontWeight={600}>
                            {organizationDetails?.data?.name} Details
                        </Typography>
                    </Grid>

                    <Grid size={12}>
                        <Grid container spacing={2}>
                            {organizationInfo.map((item, index) => (
                                <Grid size={{ xs: 12, md: index < 2 ? 6 : 4 }} key={index}>
                                    <Typography mb={1} variant="subtitle1">
                                        {item.label}
                                    </Typography>
                                    <CustomTextField disabled value={item.value} />
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            )}

            {/* ================= DEVICE TABLE ================= */}
            {!isLoading && (
                <Box sx={{ bgcolor: "white", p: 3, borderRadius: 6, mt: 3 }}>
                    <Grid container spacing={3}>
                        <Grid size={12}>
                            <Grid container justifyContent="space-between" alignItems="center">
                                <Typography sx={{ fontSize: "1.2rem", fontWeight: 600 }}>
                                    Device List
                                </Typography>

                                <Grid container justifyContent="flex-end" gap={2} alignItems="center">
                                    <DebouncedInput
                                        placeholder="Search Device"
                                        value={devicePagination.searchQuery || ""}
                                        onChange={handleDeviceSearchChange}
                                        delay={500}
                                        sx={{ minWidth: 250 }}
                                    />

                                    <Box sx={{ minWidth: 110 }}>
                                        <CustomSelect
                                            displayEmpty
                                            value={devicePagination.poolType}
                                            onChange={handlePoolTypeChange}
                                            options={poolTypeOptions}
                                        />
                                    </Box>
                                    <Button startIcon={<AddIcon sx={{ fontSize: 18 }} />} variant="contained" sx={{ textTransform: "none" }} onClick={() => { setAssignDialogType("Assign"); setOpenAssignDialog(true); }}>Assign</Button>
                                    <Button startIcon={<CloseIcon sx={{ fontSize: 18 }} />} variant="outlined" color="error" sx={{ textTransform: "none" }} onClick={() => { setAssignDialogType("Unassign"); setOpenAssignDialog(true); }}>Unassign</Button>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid size={12}>
                            <CustomTable
                                columns={["DEVICE ID", "SERIAL NUMBER", "SIM ASSIGNED", "POOL TYPE", "STATUS"]}
                                rows={formattedDeviceRows(deviceDetails?.data?.data || [])}
                                loading={deviceLoading}
                                pagination={devicePagination}
                                setPagination={setDevicePagination}
                                count={deviceDetails?.data?.pagination?.totalCount || 0}
                            />
                        </Grid>
                    </Grid>
                </Box>
            )}

            {/* ================= SIM TABLE (NEW - SAME PATTERN) ================= */}
            {!isLoading && (
                <Box sx={{ bgcolor: "white", p: 3, borderRadius: 6, mt: 3 }}>
                    <Grid container spacing={3}>
                        <Grid size={12}>
                            <Grid container justifyContent="space-between" alignItems="center">
                                <Typography sx={{ fontSize: "1.2rem", fontWeight: 600 }}>
                                    SIM List
                                </Typography>

                                <DebouncedInput
                                    placeholder="Search SIM"
                                    value={simPagination.searchQuery || ""}
                                    onChange={handleSimSearchChange}
                                    delay={500}
                                    sx={{ minWidth: 250 }}
                                />
                            </Grid>
                        </Grid>

                        <Grid size={12}>
                            <CustomTable
                                columns={[
                                    "SIM NUMBER",
                                    "MOBILE NUMBER",
                                    "PROVIDER",
                                    "IS ASSIGNED",
                                    "ACTIVATION DATE",
                                    "STATUS",
                                ]}
                                rows={formattedSimRows(simDetails?.data?.data || [])}
                                loading={simLoading}
                                pagination={simPagination}
                                setPagination={setSimPagination}
                                count={simDetails?.data?.pagination?.total || 0}
                            />
                        </Grid>
                    </Grid>
                </Box>
            )}

            {/* ================= ASSIGN/UNASSIGN DIALOG ================= */}
            <Dialog open={openAssignDialog} onClose={handleCloseAssignDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {assignDialogType} Devices
                </DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ mt: 1 }}>
                        <Typography variant="body1" mb={2} color="textSecondary">
                            Please select devices to {assignDialogType?.toLowerCase()}:
                        </Typography>
                        <FormControl fullWidth>
                            <InputLabel id="mutiple-select-label">Devices</InputLabel>
                            <Select
                                labelId="mutiple-select-label"
                                multiple
                                value={selectedDevices}
                                onChange={(e) => setSelectedDevices(e.target.value)}
                                label="Devices"
                                renderValue={(selected) => `${selected.length} selected`}
                            >
                                {(assignDialogType === "Assign"
                                    ? (allDevicesData?.data?.data?.filter(d => !d.isOrgAssigned) || [])
                                    : (deviceDetails?.data?.data || [])
                                ).map((dev) => (
                                    <MenuItem key={dev._id} value={dev._id}>
                                        <Checkbox checked={selectedDevices.indexOf(dev._id) > -1} />
                                        <ListItemText primary={dev.deviceId} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button variant="outlined" onClick={handleCloseAssignDialog} disabled={isUpdatingDevice}>
                        Cancel
                    </Button>
                    <Button variant="contained" onClick={handleAssignUnassignSubmit} disabled={isUpdatingDevice || selectedDevices.length === 0} color={assignDialogType === "Unassign" ? "error" : "primary"}>
                        {assignDialogType}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default OrganizationDetails;