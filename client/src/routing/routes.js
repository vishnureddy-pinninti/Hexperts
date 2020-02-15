import Home from '../pages/Home';
import Question from '../pages/Question';

const routes = [
    {
        path: '/',
        component: Home,
        key: 'Home',
    },
    {
        path: '/Question',
        component: Question,
        key: 'Question',
    },
    // {
    //     path: '/test',
    //     component: Tacos,
    //     key: '',
    //     routes: [
    //         {
    //             path: '/tacos/bus',
    //             component: Bus,
    //             key: '',
    //         },
    //         {
    //             path: '/tacos/cart',
    //             component: Cart,
    //             key: '',
    //         },
    //     ],
    // },
];

export default routes;
