// ** React Imports
import { useState, useEffect, useCallback, ReactElement } from "react";

// ** Next Import

// ** MUI Imports
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import { DataGrid } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

// ** Icons Imports
import PencilOutline from "mdi-material-ui/PencilOutline";

// ** Types Imports
import { ThemeColor } from "src/@core/layouts/types";

// ** Custom Components Imports
import TableHeader from "src/views/apps/meditation/list/TableHeader";
import AddUserDrawer from "src/views/apps/meditation/list/AddUserDrawer";
import UpdateUserDrawer from "src/views/apps/meditation/list/UpdateUserDrawer";
import { Tooltip } from "@mui/material";

interface UserRoleType {
  [key: string]: ReactElement;
}

interface UserStatusType {
  [key: string]: ThemeColor;
}

const UserList = () => {
  // ** State
  const [value, setValue] = useState<string>("");
  const [addUserOpen, setAddUserOpen] = useState<boolean>(false);
  const [updateUserOpen, setUpdateUserOpen] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);
  const [rowCount, setRowCount] = useState<number>(0);
  const [updateData, setUpdateData] = useState<any>({});
  const [pageOptions, setPageOptions] = useState<any>({
    number: 0,
    limit: 10,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const defaultColumns = [
    {
      flex: 0.2,
      minWidth: 150,
      headerName: "Title",
      field: "TITLE",
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ textTransform: "capitalize" }}>
            {row.TITLE}
          </Typography>
        );
      },
    },
    {
      flex: 0.2,
      minWidth: 150,
      headerName: "SubTitle",
      field: "SUBTITLE",
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ textTransform: "capitalize" }}>
            {row.SUBTITLE}
          </Typography>
        );
      },
    },
    {
      flex: 0.2,
      minWidth: 150,
      headerName: "Text",
      field: "TEXT",
      renderCell: ({ row }: any) => {
        return (
          <Typography noWrap sx={{ textTransform: "capitalize" }}>
            {row.TEXT}
          </Typography>
        );
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
        </>
      ),
    },
  ];

  const fetchMeditationData = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "http://54.226.108.109:3000/admin/meditation/page",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            PAGELIMIT: pageOptions.limit,
            PAGENUMBER: pageOptions.number,
          }),
        }
      );
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
            checkboxSelection
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
      <UpdateUserDrawer
        open={updateUserOpen}
        toggle={toggleUpdateUserDrawer}
        data={updateData}
      />
    </Grid>
  );
};

export default UserList;
