import axios from 'axios';
import { showAlert } from './alert';

export const updateCurrentUser = async (data, type) => {
    try {
        const url =
            type === 'password'
                ? '/api/v1/users/updateMyPassword'
                : '/api/v1/users/updateCurrentUser';
        const res = await axios({
            method: 'PATCH',
            url,
            data,
        });

        if (res.data.status === 'success') {
            showAlert('success', `${type.toUpperCase()} updated successfully!`);
            window.setTimeout(() => {
                location.reload();
            }, 500);
        }
    } catch (error) {
        showAlert('error', error.response.data.message);
    }
};
