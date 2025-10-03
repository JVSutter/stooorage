import React, { useState } from "react";
import {
    Grid,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Button,
} from "@mui/material";

// Field sets with dedicated endpoints
const fieldSets: Record<
    string,
    { url: string; fields: { name: string; label: string; type: string }[] }
> = {
    product: {
        url: "http://localhost:8000/products/create",
        fields: [
            { name: "product_no", label: "Número do Produto", type: "text" },
            { name: "product_name", label: "Nome do Produto", type: "text" },
            { name: "price", label: "Preço", type: "number" },
            { name: "quantity", label: "Quantidade", type: "number" },
        ],
    },
    sales_transaction: {
        url: "http://localhost:8000/products/transactions/create",
        fields: [
            { name: "transaction_no", label: "Número de Transação", type: "text" },
            { name: "transaction_date", label: "Data da Transação (dd/mm/yyyy)", type: "text" },
            { name: "customer_no", label: "Número do Cliente", type: "number" },
            { name: "country", label: "País", type: "text" },
            { name: "product_no", label: "Número do Produto", type: "text" },
            { name: "quantity", label: "Quantidade", type: "number" },
            { name: "price_at_sale", label: "Preço de Venda", type: "number" },
        ],
    },
};

const DynamicForm: React.FC = () => {
    const [selectedSet, setSelectedSet] = useState("product");
    const [formData, setFormData] = useState<Record<string, string>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === "number" ? String(value).trim() === "" ? "" : Number(value) : value,
        });
    };

    const handleSetChange = (event: any) => {
        const newSet = event.target.value;
        setSelectedSet(newSet);
        setFormData({});
    };

    const handleSubmit = async () => {
        console.log("Submitting the following data:", formData);
        const { url, fields } = fieldSets[selectedSet];
        const processedData = { ...formData };

        fields.forEach(field => {
            if (field.type === "date" && processedData[field.name]) {
                const dateValue = processedData[field.name] as string;
                const [year, month, day] = dateValue.split('-');
                processedData[field.name] = `${day}/${month}/${year}`; 
                console.log(`Converted date for ${field.name}:`, processedData[field.name]);
            }
        });

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(processedData),
            });

            if (!response.ok) {
                throw new Error("Failed to submit form");
            }

            const result = await response.json();
            console.log("Success:", result);
            alert("Form submitted successfully!");
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while submitting the form.");
        }
    };

    return (
        <Box sx={{ mb: 4 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="field-set-select-label">Ação</InputLabel>
                <Select
                    labelId="field-set-select-label"
                    value={selectedSet}
                    label="Field Set"
                    onChange={handleSetChange}
                >
                    <MenuItem value="product">Produto</MenuItem>
                    <MenuItem value="sales_transaction">Transação de Venda</MenuItem>
                </Select>
            </FormControl>

            <Grid container spacing={2} sx={{ mb: 2 }}>
                {fieldSets[selectedSet].fields.map((field) => (
                    <Grid item xs={4} key={field.name}>
                        <TextField
                            fullWidth
                            name={field.name}
                            label={field.label}
                            type={field.type}
                            value={formData[field.name] || ""}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                ))}
            </Grid>

            <Button variant="contained" color="primary" onClick={handleSubmit}>
                Enviar
            </Button>
        </Box>
    );
};

export default DynamicForm;
