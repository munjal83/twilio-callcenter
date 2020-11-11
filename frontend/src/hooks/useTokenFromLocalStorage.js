import { useEffect, useState } from 'react'
import axios from '../utils/axios'
import useLocalStorage from "./useLocalStorage"

const useTokenFromLocalStorage = (initialValue) => {
    const [value, setValue] = useLocalStorage('token', initialValue)
    const [isValidToken, setisValidToken] = useState(false)

    useEffect(() => {
        checkToken();
    }, [value]);

    const checkToken = async () => {
        const { data } = await axios.post('/check-token', { token: value })
        setisValidToken(data.isValidToken);

    }
    return [value, setValue, isValidToken]
}

export default useTokenFromLocalStorage
