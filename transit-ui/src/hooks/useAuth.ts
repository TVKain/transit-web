import { useLocalStorage } from '@uidotdev/usehooks';
import { UserApi } from '../api/user';

import { useDispatch } from 'react-redux';

import { resetUser, updateUser } from '../redux/slices/userSlice';

export default function useAuth() {
    const [_, saveUserId] = useLocalStorage<string | null>('user_id', null);

    const dispatch = useDispatch();

    return {
        async login(username: string, password: string) {
            const res = await UserApi.login({
                username: username,
                password: password
            });

            saveUserId(res.id);

            dispatch(updateUser({ username: username }));
        },
        async logout() {
            saveUserId(null);

            dispatch(resetUser());
        }
    };
}
