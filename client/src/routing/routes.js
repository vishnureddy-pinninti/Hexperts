import Home from '../pages/Home';
import Question from '../pages/Question';
import Test from '../pages/Test';

const routes = [
    {
        path: '/test',
        component: Test,
        key: 'Test',
    },
    {
        path: '/Question',
        component: Question,
        key: 'Question',
    },
    {
        path: '/',
        component: Home,
        key: 'Home',
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
