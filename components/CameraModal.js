import { Box, Button, Modal, Stack, Typography, TextField, IconButton } from '@mui/material';
import { PhotoCamera } from "@mui/icons-material";
import React, { useState, useRef } from "react";
import { Camera } from "react-camera-pro";
// import MyCamera from './Camera';
export function CameraModal({ open, handleClose, scanItem }) {
    const camera = useRef(null);
    const [image, setImage] = useState(null);
    const [activeDeviceId, setActiveDeviceId] = useState(undefined);
    const [numberOfCameras, setNumberOfCameras] = useState(0);
    const [showImage, setShowImage] = useState(false);

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box>
                {showImage ? (
                    <Box
                        display={'flex'}
                        justifyContent={'center'}
                        alignItems={'center'}>
                        <Box
                            component={'img'}
                            src={image}
                            alt="taken photo"
                            onClick={() => {
                                setShowImage(!showImage);
                            }} />
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
                            display={'flex'}
                            justifyContent={'center'}
                            alignItems={'center'}
                        >
                            <IconButton onClick={() => {
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