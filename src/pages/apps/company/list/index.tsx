// ** React Imports
import {
  useState,
  useEffect,
  MouseEvent,
  useCallback,
  ReactElement,
} from "react";

// ** Next Import
import Link from "next/link";

// ** MUI Imports
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { DataGrid } from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";

// ** Icons Imports
import Laptop from "mdi-material-ui/Laptop";
import ChartDonut from "mdi-material-ui/ChartDonut";
import CogOutline from "mdi-material-ui/CogOutline";
import PencilOutline from "mdi-material-ui/PencilOutline";
import DeleteOutline from "mdi-material-ui/DeleteOutline";
import AccountOutline from "mdi-material-ui/AccountOutline";
import Restore from "mdi-material-ui/Restore";

// ** Store Imports

// ** Custom Components Imports
import CustomAvatar from "src/@core/components/mui/avatar";

// ** Utils Import
import { getInitials } from "src/@core/utils/get-initials";

// ** Types Imports
import { ThemeColor } from "src/@core/layouts/types";
import { UsersType } from "src/types/apps/userTypes";

// ** Custom Components Imports
import TableHeader from "src/views/apps/company/list/TableHeader";
import AddUserDrawer from "src/views/apps/company/list/AddUserDrawer";
import UpdateUserDrawer from "src/views/apps/company/list/UpdateUserDrawer";
import toast from "react-hot-toast";

interface UserRoleType {
  [key: string]: ReactElement;
}

interface UserStatusType {
  [key: string]: ThemeColor;
}

// ** Styled component for the link for the avatar with image
const AvatarWithImageLink = styled(Link)(({ theme }) => ({
  marginRight: theme.spacing(3),
}));

// ** Styled component for the link for the avatar without image
const AvatarWithoutImageLink = styled(Link)(({ theme }) => ({
  textDecoration: "none",
  marginRight: theme.spacing(3),
}));

// ** Styled component for the link inside menu
const MenuItemLink = styled("a")(({ theme }) => ({
  width: "100%",
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
  padding: theme.spacing(1.5, 4),
  color: theme.palette.text.primary,
}));

const UserList = () => {
  // ** State
  const [value, setValue] = useState<string>("");
  const [updateData, setUpdateData] = useState<any>({});
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false);
  const [updateUserOpen, setUpdateUserOpen] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
  const [rowCount, setRowCount] = useState<number>(0);
  const [pageOptions, setPageOptions] = useState<any>({
    number: 0,
    limit: 10,
  });
  const [loading, setLoading] = useState<boolean>(false);

  // ** State
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const defaultColumns = [
    {
      flex: 0.2,
      minWidth: 150,
      headerName: "Company Name",
      field: "COMPANY_NAME",
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ textTransform: "capitalize" }}>
            {row["COMPANY_NAME"]}
          </Typography>
        );
      },
    },
    {
      flex: 0.2,
      minWidth: 150,
      headerName: "Company Code",
      field: "COMPANY_CODE",
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ textTransform: "capitalize" }}>
            {row["COMPANY_CODE"]}
          </Typography>
        );
      },
    },
    {
      flex: 0.2,
      minWidth: 150,
      headerName: "Address",
      field: "COMPANY_ADDRESS",
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ textTransform: "capitalize" }}>
            {row["COMPANY_ADDRESS"]}
          </Typography>
        );
      },
    },
    {
      flex: 0.2,
      minWidth: 150,
      headerName: "Is Deleted",
      field: "ISDELETED",
      renderCell: ({ row }: any) => {
        return <Switch checked={row["ISDELETE"]} />;
      },
    },
    {
      flex: 0.2,
      minWidth: 150,
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
            <IconButton onClick={() => toggleUpdateUserDrawer(row)}>
              <PencilOutline fontSize="small" sx={{ mr: 2 }} />
            </IconButton>
          </Tooltip>
          {Boolean(!row["ISDELETE"]) ? (
            <Tooltip title="Delete">
              <IconButton onClick={() => handleDelete(row["COMPANY_ID"], true)}>
                <DeleteOutline fontSize="small" sx={{ mr: 2 }} />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title="Restore">
              <IconButton
                onClick={() => handleDelete(row["COMPANY_ID"], false)}
              >
                <Restore fontSize="small" sx={{ mr: 2 }} />
              </IconButton>
            </Tooltip>
          )}
        </>
      ),
    },
  ];

  const deleteRestoreCompany = async (id: number, status: boolean) => {
    try {
      const res = await fetch(
        `http://54.226.108.109:3000/admin/company/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ISDELETE: Boolean(status),
          }),
        }
      );
      if (res.status === 200) {
        const result = await res.json();
        if (result.status) {
          if (status) {
            toast.success("Company deleted successfully.");
          }
          if (!status) {
            toast.success("Company restored successfully.");
          }
        }
      }
    } catch (error: any) {
      toast.error("Unable to delete the company. Please try again.");
    }
  };

  const handleDelete = (id: number, status: boolean) => {
    deleteRestoreCompany(id, status);
    // handleRowOptionsClose();
    setTimeout(() => {
      fetchMeditationData();
    }, 1000);
  };

  const fetchMeditationData = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://54.226.108.109:3000/admin/company/page", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          PAGELIMIT: pageOptions.limit,
          PAGENUMBER: pageOptions.number,
        }),
      });
      if (res.status === 200) {
        const result = await res.json();
        setData(result.data.list);
        setRowCount(result.data.counts);
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

  const toggleAddUserDrawer = () => {
    setAddUserOpen(!addUserOpen);
    fetchMeditationData();
  };
  const toggleUpdateUserDrawer = (data: any) => {
    setUpdateData(data);
    setUpdateUserOpen(!updateUserOpen);
    fetchMeditationData();
  };

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
            checkboxSelection={false}
            pageSize={pageOptions.limit}
            disableSelectionOnClick
            columns={defaultColumns}
            getRowId={(row) => row.COMPANY_ID}
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
      <UpdateUserDrawer
        open={updateUserOpen}
        toggle={toggleUpdateUserDrawer}
        data={updateData}
      />
    </Grid>
  );
};

export default UserList;
