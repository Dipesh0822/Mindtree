// ** React Imports
import { useState, useEffect, useCallback, ReactElement } from "react";

// ** Next Import
import Link from "next/link";

// ** MUI Imports
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";

// ** Icons Imports
import Laptop from "mdi-material-ui/Laptop";
import ChartDonut from "mdi-material-ui/ChartDonut";
import CogOutline from "mdi-material-ui/CogOutline";
import PencilOutline from "mdi-material-ui/PencilOutline";
import DeleteOutline from "mdi-material-ui/DeleteOutline";
import AccountOutline from "mdi-material-ui/AccountOutline";
import AccountReactivate from "mdi-material-ui/AccountReactivate";
import Restore from "mdi-material-ui/Restore";

// ** Store Imports

// ** Custom Components Imports

// ** Utils Import

// ** Actions Imports

// ** Types Imports
import { ThemeColor } from "src/@core/layouts/types";

// ** Custom Components Imports
import TableHeader from "src/views/apps/users/list/TableHeader";
import AddUserDrawer from "src/views/apps/users/list/AddUserDrawer";
import { Avatar, Switch } from "@mui/material";
import moment from "moment";
import toast from "react-hot-toast";

interface UserRoleType {
  [key: string]: ReactElement;
}

interface UserStatusType {
  [key: string]: ThemeColor;
}

// ** Vars
const userRoleObj: UserRoleType = {
  admin: <Laptop fontSize="small" sx={{ mr: 3, color: "error.main" }} />,
  author: <CogOutline fontSize="small" sx={{ mr: 3, color: "warning.main" }} />,
  editor: <PencilOutline fontSize="small" sx={{ mr: 3, color: "info.main" }} />,
  maintainer: (
    <ChartDonut fontSize="small" sx={{ mr: 3, color: "success.main" }} />
  ),
  subscriber: (
    <AccountOutline fontSize="small" sx={{ mr: 3, color: "primary.main" }} />
  ),
};

const userStatusObj: UserStatusType = {
  active: "success",
  pending: "warning",
  inactive: "secondary",
};

// ** Styled component for the link for the avatar with image
const AvatarWithImageLink = styled(Link)(({ theme }) => ({
  marginRight: theme.spacing(3),
}));

// ** Styled component for the link for the avatar without image
const AvatarWithoutImageLink = styled(Link)(({ theme }) => ({
  textDecoration: "none",
  marginRight: theme.spacing(3),
}));

const UserList = () => {
  // ** State
  const [value, setValue] = useState<string>("");
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
  const [rowCount, setRowCount] = useState<number>(0);
  const [pageOptions, setPageOptions] = useState<any>({
    number: 0,
    limit: 10,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const defaultColumns = [
    {
      flex: 0.2,
      minWidth: 100,
      headerName: "Profile",
      field: "PROFILE_PIC",
      renderCell: ({ row }: any) => {
        return <Avatar src={row["PROFILE_PIC"]} alt={row["EMAIL"]} />;
      },
    },
    {
      flex: 0.2,
      minWidth: 250,
      headerName: "Email",
      field: "EMAIL",
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ textTransform: "capitalize" }}>
            {row.EMAIL}
          </Typography>
        );
      },
    },
    {
      flex: 0.2,
      minWidth: 100,
      headerName: "Subscription Days",
      field: "SUBCRIPTION_DAYS",
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ textTransform: "capitalize" }}>
            {row.SUBCRIPTION_DAYS}
          </Typography>
        );
      },
    },
    {
      flex: 0.2,
      minWidth: 100,
      headerName: "Account Type",
      field: "TYPE",
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ textTransform: "capitalize" }}>
            {row.TYPE}
          </Typography>
        );
      },
    },
    {
      flex: 0.2,
      minWidth: 150,
      headerName: "Subscription Ends At",
      field: "SUBCRIPTION_END_DATE",
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ textTransform: "capitalize" }}>
            {moment(row.SUBCRIPTION_END_DATE).format("DD/M/YYYY")}
          </Typography>
        );
      },
    },
    {
      flex: 0.1,
      minWidth: 100,
      headerName: "Updated At",
      field: "UPDATE_DATE",
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ textTransform: "capitalize" }}>
            {moment(row.UPDATE_DATE).format("DD/MM/YYYY")}
          </Typography>
        );
      },
    },
    {
      flex: 0.1,
      minWidth: 100,
      headerName: "Is Deleted",
      field: "ISDELETED",
      renderCell: ({ row }: any) => {
        return <Switch checked={row["ISDELETE"]} />;
      },
    },
    {
      flex: 0.1,
      minWidth: 100,
      headerName: "Is Active",
      field: "ISACTIVE",
      renderCell: ({ row }: any) => {
        return <Switch checked={row["ISACTIVE"]} />;
      },
    },
    {
      flex: 0.15,
      minWidth: 120,
      sortable: false,
      field: "actions",
      headerName: "Actions",
      renderCell: ({ row }: any) => (
        <>
          <Tooltip title="Edit">
            <IconButton>
              <PencilOutline fontSize="small" sx={{ mr: 2 }} />
            </IconButton>
          </Tooltip>
          {!row["ISDELETE"] ? (
            <Tooltip title="Delete">
              <IconButton
                onClick={() => deleteRestoreAccount(row["USER_ID"], true)}
              >
                <DeleteOutline color="error" fontSize="small" sx={{ mr: 2 }} />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Restore">
              <IconButton
                onClick={() => deleteRestoreAccount(row["USER_ID"], false)}
              >
                <Restore color="success" fontSize="small" sx={{ mr: 2 }} />
              </IconButton>
            </Tooltip>
          )}

          {!Boolean(row["ISACTIVE"]) ? (
            <Tooltip title="Activate">
              <IconButton
                onClick={() => activateDeactivateAccount(row["USER_ID"], true)}
              >
                <AccountReactivate
                  color="success"
                  fontSize="small"
                  sx={{ mr: 2 }}
                />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Deactivate">
              <IconButton
                onClick={() => activateDeactivateAccount(row["USER_ID"], false)}
              >
                <AccountReactivate
                  color="error"
                  fontSize="small"
                  sx={{ mr: 2 }}
                />
              </IconButton>
            </Tooltip>
          )}
        </>
      ),
    },
  ];

  const deleteRestoreAccount = async (id: number, status: boolean) => {
    setLoading(true);
    try {
      const res = await fetch(`http://54.226.108.109:3000/admin/user/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ISDELETE: status,
        }),
      });
      if (res.status === 200) {
        const result = await res.json();
        if (result.status) {
          if (status) {
            toast.success("User deleted successfully");
          } else {
            toast.success("User restored successfully");
          }
          fetchMeditationData();
        } else {
          toast.error(result.msg);
        }
      }
    } catch (error: any) {
      console.log(error.message);
    }
    setLoading(false);
  };

  const activateDeactivateAccount = async (id: number, status: boolean) => {
    setLoading(true);
    try {
      const res = await fetch(`http://54.226.108.109:3000/admin/user/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ISACTIVE: status,
        }),
      });
      if (res.status === 200) {
        const result = await res.json();
        if (result.status) {
          if (status) {
            toast.success("User de-activated successfully");
          } else {
            toast.success("User activated successfully");
          }
          fetchMeditationData();
        } else {
          toast.error(result.msg);
        }
      }
    } catch (error: any) {
      console.log(error.message);
    }
    setLoading(false);
  };

  const fetchMeditationData = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://54.226.108.109:3000/admin/user/page", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          PAGELIMIT: pageOptions.limit,
          PAGENUMBER: pageOptions.number,
          SEARCH: "",
        }),
      });
      if (res.status === 200) {
        const result = await res.json();
        setData(result.data.list);
        setRowCount(result.data.count);
      }
    } catch (error: any) {
      console.log(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (Object.keys(pageOptions).length) {
      fetchMeditationData();
    }
  }, [pageOptions]);

  const handleFilter = useCallback((val: string) => {
    setValue(val);
  }, []);

  const onSearch = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://54.226.108.109:3000/admin/user/page", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          PAGELIMIT: pageOptions.limit,
          PAGENUMBER: pageOptions.number,
          SEARCH: value,
        }),
      });
      if (res.status === 200) {
        const result = await res.json();
        setData(result.data.list);
        setRowCount(result.data.count);
      }
    } catch (error: any) {
      console.log(error.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    const searchTimer = setTimeout(() => {
      if (value.length) {
        onSearch();
      }
    }, 1000);
    return () => {
      clearTimeout(searchTimer);
    };
  }, [value]);

  const toggleAddUserDrawer = () => setAddUserOpen(!addUserOpen);

  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Card>
          <TableHeader
            value={value}
            handleFilter={handleFilter}
            toggle={toggleAddUserDrawer}
          />
          <DataGrid
            autoHeight
            rows={data}
            rowCount={rowCount}
            pageSize={pageOptions.limit}
            disableSelectionOnClick
            columns={defaultColumns}
            getRowId={(row) => row.MEDITATION_ID}
            rowsPerPageOptions={[10, 25, 50]}
            onPageSizeChange={(newPageSize) =>
              setPageOptions({ ...pageOptions, limit: newPageSize })
            }
            pagination
            onPageChange={(newPage) =>
              setPageOptions({ ...pageOptions, number: newPage })
            }
            loading={loading}
          />
        </Card>
      </Grid>

      <AddUserDrawer open={addUserOpen} toggle={toggleAddUserDrawer} />
    </Grid>
  );
};

export default UserList;
function activateDeactivateAccount(arg0: any, arg1: boolean): void {
  throw new Error("Function not implemented.");
}
