'use client'
import { Box, Button, Modal, Stack, Typography, TextField, IconButton, Chip } from '@mui/material';
import { getDocs, doc, query, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { useEffect, useState } from 'react';
import { app, db, pantryRef } from '../firebase';
import { AddItemModal } from '@/components/AddItemModal';
import { AddStockModal } from '@/components/AddStockModal';
import SearchAppBar from '@/components/SearchAppBar';
import InventoryTable from '@/components/Table';
import InventoryStyledTable from '@/components/StyledTable';



export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [openAddNewItem, setOpenAddNewItem] = useState(false);
  const handleOpenItem = () => setOpenAddNewItem(true);
  const handleCloseItem = () => setOpenAddNewItem(false);

  const [openAddNewStock, setOpenAddNewStock] = useState(false);
  const handleOpenStock = () => setOpenAddNewStock(true);
  const handleCloseStock = () => setOpenAddNewStock(false);

  const [itemName, setItemName] = useState('');
  const [itemCount, setItemCount] = useState(0);

  const updatePantry = async () => {
    const q = query(pantryRef);
    const querySnapshot = await getDocs(q);
    const pantryList = [];
    querySnapshot.forEach((doc) => {
      pantryList.push({ "name": doc.id, ...doc.data() });
    });

    console.log(pantryList);
    setPantry(pantryList);
  };

  useEffect(() => {
    updatePantry();
  }, []);

  const addItemSingle = async (item) => {
    const docs = await getDoc(doc(pantryRef, item.toLowerCase()));
    if (docs.exists()) {
      await setDoc(doc(pantryRef, item.toLowerCase()), { count: docs.data().count + 1 });
    } else {
      await setDoc(doc(pantryRef, item.toLowerCase()), { count: 0 });
    }
    await updatePantry();
  }

  const addStock = async (item, count) => {
    const docs = await getDoc(doc(pantryRef, item.toLowerCase()));
    if (docs.exists()) {
      const newAmt = parseInt(docs.data().count) + parseInt(count)
      await setDoc(doc(pantryRef, item.toLowerCase()), { count: newAmt });
    } else {
      await setDoc(doc(pantryRef, item.toLowerCase()), { count: count });
    }
    await updatePantry();
  }

  const removeItemSingle = async (item) => {
    const docs = await getDoc(doc(pantryRef, item.toLowerCase()));
    if (docs.data().count > 1) {
      await setDoc(doc(pantryRef, item.toLowerCase()), { count: docs.data().count - 1 });
    } else {
      await setDoc(doc(pantryRef, item.toLowerCase()), { count: 0 });
    }
    await updatePantry();
  }

  const deleteItemStock = async (item) => {
    await deleteDoc(doc(pantryRef, item.toLowerCase()));
    await updatePantry();
  }


  const searchPantry = async (search) => {
    const q = query(pantryRef);
    const querySnapshot = await getDocs(q);
    const pantryList = [];
    querySnapshot.forEach((doc) => {
      pantryList.push({ "name": doc.id, ...doc.data() });
    });

    const filteredPantry = pantryList.filter((item) => item.name.includes(search.toLowerCase()));
    setPantry(filteredPantry);
  }

  return (
    <>
      <SearchAppBar searchPantry={searchPantry} />
      <Box
        display="flex"
        marginTop={12}
        // justifyContent="center"
        alignItems="center"
        width="100vw"
        height="100vh"
        flexDirection={'column'}
        gap={2}
      >


        <AddItemModal open={openAddNewItem} handleCloseItem={handleCloseItem} addItemSingle={addItemSingle} itemName={itemName} setItemName={setItemName} />
        <AddStockModal open={openAddNewStock} handleClose={handleCloseStock} add={addStock} itemName={itemName} setItemName={setItemName} itemCount={itemCount} setItemCount={setItemCount} />

        {/* <Box
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
      </Box> */}

        <Box
          display="flex"
          flexDirection={'row'}
          gap={2}
        >
          <Button variant='contained' onClick={handleOpenItem}>Add Item</Button>
          <Button variant='contained' onClick={handleOpenStock}>Add Stock</Button>
        </Box>

        <Box minWidth={'90%'}>
          <InventoryStyledTable items={pantry} removeItemSingle={removeItemSingle} addItemSingle={addItemSingle} deleteItemStock={deleteItemStock} />
        </Box>

        {/* <Box border={'1px solid #333'}>
        <Stack
          // width="800px"
          // height={'auto'}
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
              gap={5}
              bgcolor={'#f0f0f0'}
            >

              <Typography
                variant='h3'
                color={'#333'}
                textAlign={'center'}
              >
                {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
              </Typography>

              <Box >
              <Chip label={item.count === 0 ? "Out Of Stock" : "In Stock"} color={item.count === 0 ? "error" : "success"} variant="outlined" />
              </Box>

              <Box display={'flex'} gap={2} justifyContent={'center'} alignItems={'center'}>
                <Box><Button variant='contained' onClick={() => removeItemSingle(item.name)} disabled={item.count === 0}> - </Button></Box>
                <Typography variant='h3' color={'#333'} textAlign={'center'}> {item.count} </Typography>
                <Box><Button variant='contained' onClick={() => addItemSingle(item.name)}> + </Button></Box>
                <IconButton aria-label="delete" onClick={() => deleteItemStock(item.name)}> <DeleteIcon /> </IconButton>
              </Box>
            </Box>
          ))}
        </Stack>
      </Box> */}
      </Box>
    </>
  );
}
