import store from '../store';
import { uploadImage } from '../store/actions/auth';

export default function uploadImageCallBack(file) {
    return new Promise(
        (resolve, reject) => {
            const data = new FormData();
            data.append('image', file);
            store.dispatch(uploadImage(data, (res) => resolve({
                data: {
                    id: res.id,
                    link: res.path,
                },
                success: true,
                status: 200,
            }), (res) => reject(res)));
        }
    );
}
