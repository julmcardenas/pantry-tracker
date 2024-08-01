import {useState} from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

export default function ToggleFilter({inStockToggle, filterPantry}) {
  return (
    <ToggleButtonGroup
      color="primary"
      value={inStockToggle}
      exclusive
      onChange={(e) =>filterPantry(e.target.value)}
      aria-label="Stock Filter"
    >
      <ToggleButton value="all">All</ToggleButton>
      <ToggleButton value="inStock">In Stock</ToggleButton>
      <ToggleButton value="outOfStock">Out Of Stock</ToggleButton>
    </ToggleButtonGroup>
  );
}
