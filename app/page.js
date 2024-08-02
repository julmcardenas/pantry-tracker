'use client'
import { Box, Button, Modal, Stack, Typography, TextField, IconButton, Chip } from '@mui/material';
import { getDocs, doc, query, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { useEffect, useState } from 'react';
import { app, db, pantryRef } from '../firebase';
import { AddItemModal } from '@/components/AddItemModal';
import { AddStockModal } from '@/components/AddStockModal';
import SearchAppBar from '@/components/SearchAppBar';
import InventoryStyledTable from '@/components/StyledTable';
import ToggleFilter from '@/components/Filter';
import { CameraModal } from '@/components/CameraModal';
import analyzeImage from './openai';


export default function Home() {
  const [pantry, setPantry] = useState([]);
  const [openAddNewItem, setOpenAddNewItem] = useState(false);
  const handleOpenItem = () => setOpenAddNewItem(true);
  const handleCloseItem = () => setOpenAddNewItem(false);

  const [openAddNewStock, setOpenAddNewStock] = useState(false);
  const handleOpenStock = () => setOpenAddNewStock(true);
  const handleCloseStock = () => setOpenAddNewStock(false);

  const [openCamera, setOpenCamera] = useState(false);
  const handleOpenCamera = () => setOpenCamera(true);
  const handleCloseCamera = () => setOpenCamera(false);

  const [itemName, setItemName] = useState('');
  const [itemCount, setItemCount] = useState(0);
  const [inStockToggle, setInStockToggle] = useState("all");

  const [tempImage, setTempImage] = useState(null);

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

  const filterPantry = async (inStock) => {
    setInStockToggle(inStock);
    const q = query(pantryRef);
    const querySnapshot = await getDocs(q);
    const pantryList = [];
    querySnapshot.forEach((doc) => {
      pantryList.push({ "name": doc.id, ...doc.data() });
    });

    const filteredPantry = inStock === "all" ? pantryList : inStock === "inStock" ? pantryList.filter((item) => item.count > 0) : pantryList.filter((item) => item.count === 0);
    setPantry(filteredPantry);
  }

  const scanItem = async (scan) => {
    console.log("scanning item", scan);
    setTempImage(scan);
    // analyze image to get item name and then show item modal
    
    const itemName = await analyzeImage(scan);
    // use CPT vision api classify image based on whats already in the pantry

    // if item is already in pantry, show add stock modal
    // if item is not in pantry, show add item modal

    // setItemName(itemName);
    // setOpenAddNewItem(true);
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
        <CameraModal open={openCamera} handleClose={handleCloseCamera} scanItem={scanItem} />
        {/* <MyCamera /> */}

        <Box
          display="flex"
          flexDirection={'row'}
          gap={2}
        >
          <ToggleFilter inStockToggle={inStockToggle} filterPantry={filterPantry} />
          <Button variant='contained' onClick={handleOpenItem}>Add Item</Button>
          <Button variant='contained' onClick={handleOpenStock}>Add Stock</Button>
          <Button variant='outlined' onClick={handleOpenCamera}>Scan Item</Button>
          
        </Box>

        <Box minWidth={'90%'}>
          <InventoryStyledTable items={pantry} removeItemSingle={removeItemSingle} addItemSingle={addItemSingle} deleteItemStock={deleteItemStock} />
        </Box>

        <Box component={'img'} src={tempImage} />

      </Box>
    </>
  );
}
