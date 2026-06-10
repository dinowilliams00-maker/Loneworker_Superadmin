import {
  Box,
  Grid,
  Typography,
  Chip,
} from "@mui/material";

import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";

import { useDeleteSimById, useGetSimDetailsById } from "../../services/apis/sim";
import ManagementGrid from "../../Components/common/managementGrid";
import DetailsListingSkeleton from "../../Components/common/skelenton/detailsListingSkeleton";
import { notifyError, notifySuccess } from "../../Components/common/snackbar";
import CustomTextField from "../../Components/common/textfield";

import EditSim from "./diaog/EditSim";

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

const SimDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // ================= STATE FOR EDIT DIALOG =================
  const [openEdit, setOpenEdit] = useState(false);

  // ================= API =================
  const { data: simDetails, isLoading } = useGetSimDetailsById(id);
  const { mutate: deleteSim } = useDeleteSimById();

  // ================= EDIT HANDLER =================
  const handleEditClick = () => {
    setOpenEdit(true);
  };

  // ================= DELETE SIM =================
  const handleDeleteSim = () => {
    if (id) {
      deleteSim(id, {
        onSuccess: (data) => {
          notifySuccess(data?.message || "SIM Deleted Successfully");
          navigate("/sim-management");
        },
        onError: (error) => {
          notifyError(error?.message || "Something went wrong");
        },
      });
    }
  };

  // ================= SIM INFO =================
  const simInfo = [
    { label: "SIM Number", value: simDetails?.data?.simNumber || "NA" },
    { label: "Mobile Number", value: simDetails?.data?.mobileNumber || "NA" },
    { label: "Provider", value: simDetails?.data?.provider || "NA" },
    { label: "Plan Type", value: simDetails?.data?. planType || "NA" },
    {
      label: "Status",
      value: (
        <CustomTextField
          disabled
          disabledColor={
            simDetails?.data?.status === "Active"
              ? "#3FB00F"
              : "#FF3B30"
          }
          value={simDetails?.data?.status || "NA"}
        />
      ),
    },
    { label: "Device ID", value: simDetails?.data?.deviceId?.deviceId || "NA" },
    { label: "Organization", value: simDetails?.data?.orgId?.name || "NA" },
    {
      label: "Activation Date",
      value: simDetails?.data?.activationDate
        ? moment(simDetails.data.activationDate).format("DD-MM-YYYY")
        : "NA",
    },
    {
      label: "Renewal Date",
      value: simDetails?.data?.renewalDate
        ? moment(simDetails.data.renewalDate).format("DD-MM-YYYY ")
        : "NA",
    },
  ];

  return (
    <>
      {/* ================= HEADER ================= */}
      <ManagementGrid
        moduleName="SIM Details"
        breadcrumbItems={[
          { label: "SIM Management", link: "/sim-management" },
          { label: simDetails?.data?.simNumber || "SIM Details", link: `/sim-management/${id}` },
        ]}

        // === Edit Button Configuration ===
        button="Edit SIM"
        handleClickOpen={handleEditClick}
        edit={true}                    // This shows Edit Icon

        // === Delete Button ===
        deleteBtn="Delete SIM"
        deleteFunction={handleDeleteSim}
      />

      {/* ================= SIM DETAILS ================= */}
      {isLoading ? (
        <DetailsListingSkeleton listingHead={simInfo} />
      ) : (
        <Grid
          container
          className="custom-Grid"
          spacing={3}
          bgcolor="white"
          p={3}
          borderRadius={6}
          mt={2}
        >
          <Grid size={12}>
            <Typography variant="h6" fontWeight={600}>
              SIM Information
            </Typography>
          </Grid>

          <Grid size={12}>
            <Grid container spacing={2}>
              {simInfo.map((item, index) => (
                <Grid
                  size={{ xs: 12, md: index < 2 ? 4 : 4 }}
                  key={index}
                >
                  <Typography mb={1} variant="subtitle1">
                    {item.label}
                  </Typography>
                  {React.isValidElement(item.value) ? (
                    item.value
                  ) : (
                    <CustomTextField
                      disabled
                      value={item.value}
                    />
                  )}
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      )}

      {/* ================= EDIT SIM DIALOG =================== */}
      <EditSim
        open={openEdit}
        setOpen={setOpenEdit}
        simDetails={simDetails}
        id={id}
      />
    </>
  );
};

export default SimDetails;