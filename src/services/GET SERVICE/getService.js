import axios from "axios";


class StyleWiseService {
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

    // ****************************************
    // ** fetching coords styles **************

    async getCoordsStyles() {
        try {
            const response = await axios.get("/coords/all-coords");
            return response.data;
        } catch (error) {
            console.error("Error fetching coord styles", error);
            throw error
        }
    }


    // ****************************************
    // ** fetching relisted styles*************

    async getRelistedStyles(q) {
        try {
            const url = q ? `/relist/relist-details?oldSku=${q}` : `/relist/relisted`;
            const response = await axios.get(url);
            // console.log(response.data)
            return response.data;
        } catch (error) {
            console.error("Error fetching relisted styles", error);
        }
    }
    // ****************************************
    // ** fetching regular styles*************

    async getRegularStyles(q, page) {
        try {
            const url = q ? `/regular-style/style-details?styleNumber=${q}` : `/regular-style/qurvii-styles?page=${page}`;
            const response = await axios.get(url);
            // console.log(response.data)
            return response.data;
        } catch (error) {
            console.error("Error Fetching relisted styles :: error :: ", error);
        }
    }

    async getStyleLog() {
        try {
            const response = await axios.get("/style-log");
            return response.data;
        } catch (error) {
            console.log("Failed to Fetching style logs :: error :; ", error);
        }
    }

    // *************** get styles for cataloging ********************
    async getStylesForCataloging(logId) {
        try {
            const response = await axios.get(`/regular-style/style-details?logId=${logId}`);
            return response.data;
        } catch (error) {
            console.log("Failed to fetching styles for cataloging :: error :: ", error);
        }
    }

    async uploadAndGetStyleDetails(data) {
        try {
            const response = await axios.post(`/regular-style/upload-styles`, data);
            return response.data;
        } catch (error) {
            console.log("Failed to fetching styles for uploaded styles :: error :: ", error);
        }
    }


    async uploadAndGetCoordsDetails(data) {
        try {
            const response = await axios.post(`/coords/upload-and-get-coords`, data);
            return response.data;
        } catch (error) {
            console.log("Failed to fetching styles for uploaded styles :: error :: ", error);
        }
    }

}

const styleWiseService = new StyleWiseService();
export default styleWiseService;