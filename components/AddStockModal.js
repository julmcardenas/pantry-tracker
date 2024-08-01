import { Box, Button, Modal, Stack, Typography, TextField } from '@mui/material';
export function AddStockModal( {open, handleClose, add, itemName, setItemName, itemCount, setItemCount} ) {
    
    return (
        <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 3
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack direction='row' spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <TextField
              id="outlined-basic"
              label="Amount"
              variant="outlined"
              fullWidth
              value={itemCount}
              onChange={(e) => setItemCount(e.target.value)}
            />
            <Button variant='outlined' onClick={() => {
              add(itemName, itemCount)
              handleClose()
              setItemName('')
            }}>Add</Button>

          </Stack>
        </Box>
      </Modal>
    )
}