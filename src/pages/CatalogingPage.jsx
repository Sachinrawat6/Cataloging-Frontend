import React, { useEffect, useState } from 'react'
import Sidebar from '../components/CatalogSideBar'
import styleWiseService from '../services/GET SERVICE/getService'
import { useParams } from 'react-router-dom';
import CatalogDetails from '../components/CatalogDetails';

const CatalogingPage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [catalogData, setCatalogData] = useState([]);
    const { logId } = useParams();

    const fetchStylesForCataloging = async () => {
        setLoading(true);
        try {
            const response = await styleWiseService.getStylesForCataloging(logId);
            setCatalogData(response.data);
            console.log(response.data);
        } catch (error) {
            console.log("Failed to fetching styles :: error :: ", error);
        } finally {
            setLoading(false);
            setError(null);
        }
    }


    useEffect(() => {
        fetchStylesForCataloging();
    }, []);

    if (loading) {
        return <p className='p-10 text-center animate-pulse'> loading...</p>
    }
    return (
        <div className='flex'>
            <Sidebar data={catalogData} />
            <div className='w-full'>
                <CatalogDetails data={catalogData} />
            </div>
        </div>
    )
}

export default CatalogingPage