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
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    Pagination,
} from "@mui/material";

import { useState } from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import { useCallback } from "react";

import moment from "moment";

import {
    getAllOrgDetailsById,
    DeleteOrgById,
    getDeviceDetailsByOrgId,
    GetAllSimByOrgId,
    useActivateDeactivateAdminById,
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

import EditAdmin from "../dialogs/EditAdmin";

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
    const [dialogPage, setDialogPage] = useState(1);
    const [dialogSearch, setDialogSearch] = useState("");
    const dialogRowsPerPage = 10;
    // Edit Button Dialog State
    const [openEditTenant, setOpenEditTenant] = useState(false);

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
    console.log("devicePagination", devicePagination)
    // console.log("setdevicePagination", setDevicePagination)

    // ================= FILTER OPTIONS =================
    const poolTypeOptions = [
        { label: "Account  Type", value: "" },
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
    const { mutate: activateDeactivateAdmin, isPending: isActivating } = useActivateDeactivateAdminById();

    const isDeactivated = organizationDetails?.data?.isDeactivated;

    // ================= ACTIVATE / DEACTIVATE =================
    const handleActivateDeactivate = () => {
        if (id) {
            const action = isDeactivated ? "activate" : "deactivate";
            activateDeactivateAdmin(
                { orgId: id, body: { action } },
                {
                    onSuccess: (data) => {
                        notifySuccess(data?.message || `Organization ${action}d successfully`);
                    },
                    onError: (error) => {
                        notifyError(error?.message || "Something went wrong");
                    },
                }
            );
        }
    };

    // Fetch devices for Assign dialog → ?isOrgAssigned=false
    const { data: assignDevicesData, refetch: refetchAssignDevices } = getAllDevice(
        { limit: 1000, isOrgAssigned: false },
        { enabled: false }
    );

    // Fetch devices for Unassign dialog → ?orgId=<orgId>
    const targetOrgIdForQuery = organizationDetails?.data?.orgId || organizationDetails?.data?.organizationId || id;
    const { data: unassignDevicesData, refetch: refetchUnassignDevices } = getAllDevice(
        { limit: 1000, orgId: targetOrgIdForQuery },
        { enabled: false }
    );

    const { mutate: updateDeviceStatus, isPending: isUpdatingDevice } = useUpdateDeviceStatus();

    // Helper to open dialog and fetch the right device list
    const openDialog = (type) => {
        setAssignDialogType(type);
        setSelectedDevices([]);
        setDialogPage(1);
        setDialogSearch("");
        setOpenAssignDialog(true);
        if (type === "Assign") {
            refetchAssignDevices();
        } else {
            refetchUnassignDevices();
        }
    };

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
                // Refresh both device lists so dialogs show up-to-date info
                refetchAssignDevices();
                refetchUnassignDevices();
                setDevicePagination(prev => ({ ...prev, page: 1 }));
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
    const handleDeviceSearchChange = useCallback((event) => {
        const value =
            typeof event === "string"
                ? event
                : event?.target?.value || "";
        setDevicePagination((prev) => ({
            ...prev,
            searchQuery: value,
            page: 1,
        }));
    }, []);

    const handleSimSearchChange = useCallback((event) => {
        const value =
            typeof event === "string"
                ? event
                : event?.target?.value || "";
        setSimPagination((prev) => ({
            ...prev,
            searchQuery: value,
            page: 1,
        }));
    }, []);

    const handleDialogSearchChange = useCallback((event) => {
        const value =
            typeof event === "string"
                ? event
                : event?.target?.value || "";
        setDialogSearch(value);
        setDialogPage(1);
    }, []);

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
        {
            label: "Status",
            value: (
                <CustomTextField
                    disabled
                    disabledColor={isDeactivated ? "#FF3B30" : "#3FB00F"}   // ← Yeh important hai
                    value={isDeactivated ? "Inactive" : "Active"}
                />
            ),
        },
        { label: "Device Count", value: organizationDetails?.data?.deviceCount || 0 },
        { label: "SIM Count", value: organizationDetails?.data?.simCount || 0 },
    ];

    // ================= FORMATTED DEVICE ROWS ====================
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

    const dialogDevicesRaw = assignDialogType === "Assign"
        ? (assignDevicesData?.data?.data || [])
        : (unassignDevicesData?.data?.data || []);
        
    const dialogDevices = dialogSearch 
        ? dialogDevicesRaw.filter(dev => dev.deviceId?.toLowerCase().includes(dialogSearch.toLowerCase()))
        : dialogDevicesRaw;
    
    const totalDialogPages = Math.ceil(dialogDevices.length / dialogRowsPerPage);
    const paginatedDialogDevices = dialogDevices.slice((dialogPage - 1) * dialogRowsPerPage, dialogPage * dialogRowsPerPage);

    return (
        <>

            {/* ================= HEADER ================= */}
            <ManagementGrid
                moduleName="Organization Admin Details"
                breadcrumbItems={[
                    { label: "Organizations", link: "/" },
                    { label: organizationDetails?.data?.name || "Organization Details", link: `/organization/${id}` },
                ]}
                // Activate / Deactivate Button
                activateDeactivateBtn={isDeactivated ? "Activate Organization" : "Deactivate Organization"}
                activateDeactivateFunction={handleActivateDeactivate}
                isDeactivated={isDeactivated}

                
                // Edit Button
                button="Edit Organization"
                handleClickOpen={() => setOpenEditTenant(true)}
                edit={true}
                // Delete Button
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
                            {organizationDetails?.data?.name}  Details
                        </Typography>
                    </Grid>

                    <Grid size={12}>
                        <Grid container spacing={2}>
                            {organizationInfo.map((item, index) => (
                                <Grid size={{ xs: 12, md: 4 }} key={index}>
                                    <Typography mb={1} variant="subtitle1">
                                        {item.label}
                                    </Typography>
                                    {typeof item.value === "object" ? (
                                        item.value
                                    ) : (
                                        <CustomTextField disabled value={item.value} />
                                    )}
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
                            <Grid container justifyContent="space-between" alignItems="center" sx={{ flexDirection: { xs: "column", md: "row" }, gap: { xs: 2, md: 0 }, alignItems: { xs: "flex-start", md: "center" } }}>
                                <Typography sx={{ fontSize: "1.2rem", fontWeight: 600 }}>
                                    Device List
                                </Typography>

                                <Grid container justifyContent={{ xs: "flex-start", md: "flex-end" }} gap={2} alignItems="center" sx={{ width: { xs: "100%", md: "auto" } }}>
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
                                    <Button startIcon={<AddIcon sx={{ fontSize: 18 }} />} variant="contained" sx={{ textTransform: "none" }} onClick={() => openDialog("Assign")}>Assign</Button>
                                    <Button startIcon={<CloseIcon sx={{ fontSize: 18 }} />} variant="outlined" color="error" sx={{ textTransform: "none" }} onClick={() => openDialog("Unassign")}>Unassign</Button>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid size={12}>
                            <CustomTable
                                columns={["DEVICE ID", "SERIAL NUMBER", "SIM ASSIGNED", "ACCOUNT TYPE", "STATUS"]}
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
                            <Grid container justifyContent="space-between" alignItems="center" sx={{ flexDirection: { xs: "column", md: "row" }, gap: { xs: 2, md: 0 }, alignItems: { xs: "flex-start", md: "center" } }}>
                                <Typography sx={{ fontSize: "1.2rem", fontWeight: 600 }}>
                                    SIM List
                                </Typography>

                                <DebouncedInput
                                    placeholder="Search SIM"
                                    value={simPagination.searchQuery || ""}
                                    onChange={handleSimSearchChange}
                                    delay={500}
                                    sx={{ minWidth: 250, width: { xs: "100%", sm: "auto" } }}
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
<Dialog 
    open={openAssignDialog} 
    onClose={handleCloseAssignDialog} 
    maxWidth="sm"           
    fullWidth
>
    <DialogTitle sx={{ 
        bgcolor: assignDialogType === "Unassign" ? "primary.main" : "primary.main", 
        color: "white" 
    }}>
        {assignDialogType} Devices
    </DialogTitle>
    <DialogContent dividers >
        <Box sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 2 }}>
                {/* <Typography variant="body1" color="textSecondary">
                    Please select devices to {assignDialogType?.toLowerCase()}:
                </Typography> */}
                <DebouncedInput
                    placeholder="Search Device"
                    value={dialogSearch}
                    onChange={handleDialogSearchChange}
                    delay={300}
                    sx={{ minWidth: 550 }}
                />
            </Box>
            <Grid container spacing={2}>
                {paginatedDialogDevices.map(dev => {
                    const isChecked = selectedDevices.includes(dev._id);
                    return (
                        <Grid size={{ xs: 12, sm: 6 }} key={dev._id}>
                            <Box
                                onClick={() => {
                                    setSelectedDevices(prev => 
                                        isChecked ? prev.filter(id => id !== dev._id) : [...prev, dev._id]
                                    );
                                }}
                                sx={{
                                    border: '1px solid',
                                    borderColor: isChecked ? 'primary.main' : '#e0e0e0',
                                    borderRadius: 2,
                                    p: 1.5,
                                    display: 'flex',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    backgroundColor: isChecked ? '#f0f7ff' : 'background.paper',
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        borderColor: 'primary.main',
                                        backgroundColor: '#f0f7ff',
                                    }
                                }}
                            >
                                <Checkbox 
                                    checked={isChecked} 
                                    tabIndex={-1} 
                                    disableRipple 
                                    sx={{ p: 0, mr: 1.5 }}
                                />
                                <Typography variant="body2" fontWeight={isChecked ? 600 : 400}>
                                    {dev.deviceId}
                                </Typography>
                            </Box>
                        </Grid>
                    );
                })}
                {paginatedDialogDevices.length === 0 && (
                    <Grid size={12}>
                        <Typography color="textSecondary" align="center" py={2}>
                            No devices assigned to this Organization.
                        </Typography>
                    </Grid>
                )}
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3, flexWrap: 'wrap', gap: 2 }}>
                <Typography variant="body2" color="textSecondary" fontWeight={600}>
                    Total Devices: {dialogDevices.length} {selectedDevices.length > 0 && <><br/><span style={{color:"green"}}>Selected: {selectedDevices.length}</span></> }
                </Typography>
                {totalDialogPages > 0 && (
                    <Pagination 
                        count={totalDialogPages} 
                        page={dialogPage} 
                        onChange={(e, value) => setDialogPage(value)} 
                        color="primary" 
                        size="small"
                    />
                )}
            </Box>
        </Box>
    </DialogContent>
    <DialogActions sx={{ px: 2, py: 2, display: "flex", justifyContent: "flex-end" }}>
        <Button variant="outlined" onClick={handleCloseAssignDialog} disabled={isUpdatingDevice}>
            Cancel
        </Button>
        <Button 
            variant="contained" 
            onClick={handleAssignUnassignSubmit} 
            disabled={isUpdatingDevice || selectedDevices.length === 0} 
            color={assignDialogType === "Unassign" ? "error" : "primary"}
        >
            {assignDialogType}
        </Button>
    </DialogActions>
</Dialog>
            <EditAdmin
                open={openEditTenant}
                setOpen={setOpenEditTenant}
                organizationDetails={organizationDetails}
                id={id}
            />
        </>
    );
};

export default OrganizationDetails;