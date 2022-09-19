import axios from "axios";






async function predict_window(frames){
    const data={
        frames
    }
    const res =await axios.post("http://127.0.0.1:8000/predict_window", data)
    return res
}


export {predict_window}