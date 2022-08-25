// ** React Imports
import { useState } from 'react'

// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import InputLabel from '@mui/material/InputLabel'

// ** Third Party Imports
import * as yup from 'yup'
import { useFormik } from 'formik'
import toast from 'react-hot-toast'

// ** Icons Imports
import Close from 'mdi-material-ui/Close'

interface SidebarAddUserType {
  open: boolean
  toggle: () => void
}

interface UserData {
  text: string
  company: string
  country: string
  musicUpload: number
  title: string
  subtitle: string
}

const showErrors = (field: string, valueLen: number, min: number) => {
  if (valueLen === 0) {
    return `${field} field is required`
  } else if (valueLen > 0 && valueLen < min) {
    return `${field} must be at least ${min} characters`
  } else {
    return ''
  }
}

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default,
}))

const schema = yup.object().shape({
  name: yup.string().required(),
  code: yup.string().required(),
  address: yup.string().required(),
  // musicUpload: yup.mixed().required("Music is required"),
  // imageUpload: yup.mixed().required("Image is required"),
})

const SidebarAddUser = (props: SidebarAddUserType) => {
  // ** Props
  const { open, toggle } = props

  const formik = useFormik({
    initialValues: {
      name: '',
      code: '',
      address: '',
    },
    validationSchema: schema,
    onSubmit: (values: any) => {
      createCompany({
        COMPANY_NAME: values.name,
        COMPANY_CODE: values.code,
        COMPANY_ADDRESS: values.address,
      })
    },
  })

  const createCompany = async (data: any) => {
    try {
      const res = await fetch('http://54.226.108.109:3000/admin/company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      if (res.status === 200) {
        const result = await res.json()
        if (result) {
          toast.success('Company created successfully')
          formik.resetForm()
          toggle()
        }
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again')
      console.log(err)
    }
  }

  const handleClose = () => {
    toggle()
    formik.resetForm()
  }

  return (
    <Drawer
      open={open}
      anchor="right"
      variant="temporary"
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant="h6">Add Company</Typography>
        <Close
          fontSize="small"
          onClick={handleClose}
          sx={{ cursor: 'pointer' }}
        />
      </Header>
      <Box sx={{ p: 5 }}>
        <form onSubmit={formik.handleSubmit} noValidate>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <TextField
              value={formik.values.name}
              label="Company Name"
              name="name"
              onChange={formik.handleChange}
              error={Boolean(formik.errors.name)}
            />

            {formik.errors.name && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {formik.errors.name}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <TextField
              label="Company Code"
              name="code"
              value={formik.values.code}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.code)}
            />

            {formik.errors.code && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {formik.errors.code}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 6 }}>
            <TextField
              type="text"
              label="Address"
              name="address"
              value={formik.values.address}
              onChange={formik.handleChange}
              error={Boolean(formik.errors.address)}
            />

            {formik.errors.address && (
              <FormHelperText sx={{ color: 'error.main' }}>
                {formik.errors.address}
              </FormHelperText>
            )}
          </FormControl>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button
              size="large"
              type="submit"
              variant="contained"
              sx={{ mr: 3 }}
            >
              Submit
            </Button>
            <Button
              size="large"
              variant="outlined"
              color="secondary"
              onClick={handleClose}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  )
}

export default SidebarAddUser
