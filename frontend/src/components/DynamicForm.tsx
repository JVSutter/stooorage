import React, { useState } from "react";
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, Box } from "@mui/material";

// Example field sets
const fieldSets = {
    product: [
        { name: "product_no", label: "Product Number", type: "text" },
        { name: "product_name", label: "Product Name", type: "text" },
        { name: "quantity", label: "Quantity", type: "number" },
    ],
    sales_transaction: [
        { name: "transaction_no", label: "Transaction Number", type: "text" },
        { name: "transaction_date", label: "Transaction Date", type: "date" },
        { name: "customer_no", label: "Customer Number", type: "number" },
        { name: "country", label: "Country", type: "text" },
        { name: "product_no", label: "Product Number", type: "text" },
        { name: "quantity", label: "Quantity", type: "number" },
        { name: "price", label: "Price", type: "number" },
    ],
};

const DynamicForm: React.FC = () => {
    const [selectedSet, setSelectedSet] = useState("product");
    const [formData, setFormData] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <Box sx={{ mb: 4 }}>
            {/* Selector for field sets */}
            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="field-set-select-label">Field Set</InputLabel>
                <Select
                    labelId="field-set-select-label"
                    value={selectedSet}
                    label="Field Set"
                    onChange={(e) => setSelectedSet(e.target.value)}
                >
                    <MenuItem value="product">Product</MenuItem>
                    <MenuItem value="sales_transaction">Sales Transaction</MenuItem>
                </Select>
            </FormControl>

            {/* Render dynamic fields */}
            <Grid container spacing={2}>
                {fieldSets[selectedSet].map((field) => (
                    <Grid item xs={4} key={field.name}>
                        <TextField
                            fullWidth
                            name={field.name}
                            label={field.label}
                            type={field.type}
                            value={formData[field.name] || ""}
                            onChange={handleChange}
                            InputLabelProps={field.type === "date" ? { shrink: true } : undefined}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default DynamicForm;
