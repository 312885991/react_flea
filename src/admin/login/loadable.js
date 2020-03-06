import Loadable from 'react-loadable';
import Loading from '../loading';

const LoadableLogin = Loadable({
    loader:() => import('./index'),
    loading:Loading,
    delay:300
})

export default LoadableLogin;