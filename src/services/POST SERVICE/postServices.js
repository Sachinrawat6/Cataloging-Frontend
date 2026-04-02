import axios from "axios";

class StyleWisePostService {
    constructor() {
        // this.BASE_URL = "http://localhost:5000/api/v1/stylewise";
        this.BASE_URL = "https://stylewise-backend-uqx8.onrender.com/api/v1/stylewise"
        axios.defaults.baseURL = this.BASE_URL;
        axios.interceptors.response.use(
            response => response,
            error => {
                console.error("Api Error :: error", error);
                return Promise.reject(error);
            }
        )
    }

    // *************************** relist style creation *************************
    async createRelistStyles(data) {
        if (data.length === 0 || !Array.isArray(data)) {
            throw new Error("Payload must be not-empty array.");
        }
        try {
            const response = await axios.post("/relist/create", data);
            return response.data;

        } catch (error) {
            console.error("Error creating Relist styles", error);
            throw error;
        }
    }

    // *************************** relist style update *************************
    async updateRelistStyle(id, data) {
        if (typeof (data) !== "object" || data.length === 0) {
            throw new Error("Payload must be not-empty object")
        }
        if (!id) {
            throw new Error("id required.");
        }
        try {
            const response = await axios.post(`/relist/update/${id}`, data);
            return response.data;
        } catch (error) {
            console.error("Error updating relist style :: error :: ", error);
            throw error
        }
    }

    // ******************************* coords style creation *************************
    async createCoordsStyles(data) {
        if (data.length === 0 || !Array.isArray(data)) {
            throw new Error("Payload must be not-empty array");
        }
        try {
            const response = await axios.post("/coords/uploads", data);
            return response.data;
        } catch (error) {
            console.error("Error creating Coords Styles", error);
        }
    }


    // *************************************** regular order creation ******************************


    async createRegularStyles(data) {
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error("Payload must be a non-empty array.");
        }

        try {
            const response = await axios.post("/regular-style/create", data);
            return response.data.data;

            console.log(response.data)
            return response.data
        } catch (error) {
            console.error("Failed to create regular styles error :: ", error?.response?.data || error.message);
            throw error;
        }
    }


}

const styleWisePostService = new StyleWisePostService();
export default styleWisePostService;