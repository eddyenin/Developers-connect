import { v4 as uuid} from 'uuid';
import { SET_ALERT, REMOVE_ALERT } from './type';

const setAlert = (msg, alertType, id) => dispatch => {
    const id = uuid();
    dispatch({
        type: SET_ALERT,
        payload:{
            msg,
            alertType,
            id
            
        }
    })

    setTimeout(() => dispatch({
        type:REMOVE_ALERT,
        payload:id
    }), 3000);
}

export default setAlert;