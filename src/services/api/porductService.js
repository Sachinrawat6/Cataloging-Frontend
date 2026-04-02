import axios from "axios";

class ProductService {
    async getProduct() {
        try {
            const response = await axios.get(`https://inventorybackend-m1z8.onrender.com/api/product`)
            return response.data;
        } catch (error) {
            console.error("Error fetching porduct details", error);

        }
    }
}

const productService = new ProductService();

export default productService;