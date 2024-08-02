import { Box, Button, Modal, Stack, Typography, TextField, IconButton } from '@mui/material';
import { PhotoCamera } from "@mui/icons-material";
import React, { useState, useRef } from "react";
import { Camera } from "react-camera-pro";
// import MyCamera from './Camera';
import { app, db, pantryRef } from '../firebase';
import { getDocs, doc, query, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import analyzeImage from '@/app/openai';




export function CameraModal({ open, handleClose, updatePantry}) {
    const camera = useRef(null);
    const [image, setImage] = useState(null);
    const [activeDeviceId, setActiveDeviceId] = useState(undefined);
    const [numberOfCameras, setNumberOfCameras] = useState(0);
    const [showImage, setShowImage] = useState(false);
    const [itemName, setItemName] = useState("");
    const [itemCount, setItemCount] = useState(0);
    const [mode, setMode] = useState('add');
    const [ogCount, setOgCount] = useState(0);

    const scanItem = async (scan) => {
        // console.log("scanning item");
        // setTempImage(scan);
        const itemName = await analyzeImage(scan);
        // const itemName = "honey";

        setItemName(itemName);
        const itemDoc = await getDoc(doc(pantryRef, itemName.toLowerCase()));
        if (itemDoc.exists()) {
            setOgCount(parseInt(itemDoc.data().count));
        } else {
            setOgCount(0);
        }
    }

    const addStock = async (item, count) => {
        const itemDoc = await getDoc(doc(pantryRef, item.toLowerCase()));
        if (itemDoc.exists()) {
            const newAmt = parseInt(itemDoc.data().count) + parseInt(count)
            await setDoc(doc(pantryRef, item.toLowerCase()), { count: newAmt });
        } else {
            await setDoc(doc(pantryRef, item.toLowerCase()), { count: count });
        }
        await updatePantry();
    }


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
                    width: '70%',
                    height: '85%',
                    bgcolor: 'background.paper',
                    border: '2px solid #000',
                    boxShadow: 24,
                    p: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3
                }}
            >
                {showImage ? (
                    <Box
                        display={'flex'}
                        justifyContent={'center'}
                        alignItems={'center'}
                        flexDirection={'column'}
                        // backgroundColor={'#f5f5f5'}
                        width={'100%'}
                        height={'100%'}
                        gap={1}
                    >
                        <Box
                            component={'img'}
                            src={image}
                            alt="taken photo"
                        />

                        <Box
                            display={'flex'}
                            justifyContent={'center'}
                            alignItems={'center'}
                            flexDirection={'row'}
                            gap={2}
                        >
                            <Button variant='contained' onClick={() => {
                                setShowImage(!showImage);
                            }}>Retake</Button>
                            {/* <Button variant='contained' onClick={handleOpenItem}>Add Item</Button>
                            <Button variant='contained' onClick={handleOpenStock}>Add Stock</Button> */}

                        </Box>

                        <Typography variant={'h6'}>Item: <b>{itemName || 'analyzing...'}</b> | Quantity: {parseInt(ogCount)+parseInt(itemCount||0)}</Typography>

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
                                addStock(itemName, itemCount)
                                handleClose()
                                setItemName('')
                                setItemCount(0)
                                setShowImage(false)
                            }}>Add Stock</Button>

                        </Stack>




                    </Box>
                ) : (
                    <>
                        <Camera
                            ref={camera}
                            aspectRatio="cover"
                            facingMode="environment"
                            numberOfCamerasCallback={(i) => setNumberOfCameras(i)}
                            videoSourceDeviceId={activeDeviceId}
                            errorMessages={{
                                noCameraAccessible: 'No camera device accessible. Please connect your camera or try a different browser.',
                                permissionDenied: 'Permission denied. Please refresh and give camera permission.',
                                switchCamera:
                                    'It is not possible to switch camera to different one because there is only one video device accessible.',
                                canvas: 'Canvas is not supported.',
                            }}
                            videoReadyCallback={() => {
                                console.log('Video feed ready.');
                            }}
                        />
                        <Box
                            // display={'flex'}
                            // justifyContent={'center'}
                            // alignItems={'center'}
                            position={'absolute'}
                            bottom={0}
                            left={'50%'}
                        >
                            <IconButton
                                sx={{
                                    backgroundColor: 'white',
                                    ":hover": {
                                        backgroundColor: '#ADD8E6'
                                    },
                                    color: 'black',
                                    width: '100',
                                    height: '100'
                                }}
                                size='large'
                                onClick={() => {
                                    setImage(camera.current.takePhoto())
                                    setShowImage(true)
                                    scanItem(camera.current.takePhoto())
                                }}>
                                <PhotoCamera />
                            </IconButton>

                        </Box>
                    </>
                )}
            </Box>


            {/* <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            // marginTop: 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            transform: 'translate(-50%, -50%)',
            width: 400,
            height: 'auto',
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 30,
            flexDirection: 'column',
            gap: 3
          }}
        >
          <MyCamera />
        </Box> */}
        </Modal>
    )
}