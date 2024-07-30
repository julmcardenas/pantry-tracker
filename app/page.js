'use client'
import { Box, Button, Modal, Stack, Typography, TextField } from '@mui/material';
import { getDocs, doc, query, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { useEffect, useState } from 'react';
import { app, db, pantryRef } from '../firebase';

export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [itemName, setItemName] = useState('');

  const updatePantry = async () => {
    const q = query(pantryRef);
    const querySnapshot = await getDocs(q);
    const pantryList = [];
    querySnapshot.forEach((doc) => {
      pantryList.push({"name":doc.id, ...doc.data()});
    });

    console.log(pantryList);
    setPantry(pantryList);
  };

  useEffect(() => {
    updatePantry();
  }, []);


  const addItem = async (item) => {
    const docs = await getDoc(doc(pantryRef, item.toLowerCase()));
    if (docs.exists()) {
      await setDoc(doc(pantryRef, item.toLowerCase()), { count: docs.data().count + 1 });
    } else {
      await setDoc(doc(pantryRef, item.toLowerCase()), { count: 1 });
    }
    await updatePantry();
  }

  const removeItem = async (item) => {
    const docs = await getDoc(doc(pantryRef, item.toLowerCase()));
    if (docs.data().count > 1) {
      await setDoc(doc(pantryRef, item.toLowerCase()), { count: docs.data().count - 1 });
    } else {
      await deleteDoc(doc(pantryRef, item.toLowerCase()));
    }
   await updatePantry();

  }
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="100vw"
      height="100vh"
      flexDirection={'column'}
      gap={2}
    >

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
            <Button variant='outlined' onClick={() => {
              addItem(itemName)
              handleClose()
              setItemName('')
            }}>Add</Button>

          </Stack>
        </Box>
      </Modal>


      <Button variant='contained' onClick={handleOpen}>Add Item</Button>

      <Box border={'1px solid #333'}>

        <Box
          width={"800px"}
          height={"100px"}
          bgcolor={'#ADD8E6'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >

          <Typography variant='h2' color={'#333'} textAlign={'center'}>
            Pantry Items
          </Typography>
        </Box>

        <Stack
          width="800px"
          height={'300px'}
          spacing={2}
          overflow={'scroll'}
        >

          {pantry.map((item) => (
              <Box
                key={item.name}
                width={'100%'}
                minHeight={'100px'}
                display={'flex'}
                justifyContent={'space-between'}
                alignItems={'center'}
                paddingX={5}
                bgcolor={'#f0f0f0'}
              >

                <Typography
                  variant='h3'
                  color={'#333'}
                  textAlign={'center'}
                >
                  {
                    // capitalize first letter of the item
                    item.name.charAt(0).toUpperCase() + item.name.slice(1)
                  }
                </Typography>
                <Typography variant='h3' color={'#333'} textAlign={'center'}> Quantity: {item.count}</Typography>
                <Button variant='contained' onClick={() => removeItem(item.name)}>Remove</Button>
              </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
