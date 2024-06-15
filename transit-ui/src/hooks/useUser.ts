import { useQuery } from 'react-query';
import { UserApi } from '../api/user';

const fetchUser = async () => {
    const userId = JSON.parse(localStorage.getItem('user_id')!);
    const res = await UserApi.get({ id: userId });
    return res;
};

function useUser() {
    const {
        data: user,
        isLoading,
        isError
    } = useQuery('user', fetchUser, {
        refetchOnWindowFocus: false
    });

    return { user, isLoading, isError };
}

export default useUser;
