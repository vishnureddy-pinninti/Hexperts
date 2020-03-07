import Home from '../pages/Home';
import Question from '../pages/Question';
import Topic from '../pages/Topic';
import Profile from '../pages/Profile';
import Notifications from '../pages/Notifications';
import Answer from '../pages/Answer';
import Spaces from '../pages/Spaces';
import AnswerWithQuestion from '../pages/AnswerWithQuestion';

const routes = [
    {
        path: '/Question/:questionId',
        component: Question,
        key: 'Question',
    },
    {
        path: '/Topic/:topicID',
        component: Topic,
        key: 'Topic',
    },
    {
        path: '/Profile/:userId',
        component: Profile,
        key: 'Profile',
    },
    {
        path: '/answer/:answerId',
        component: AnswerWithQuestion,
        key: 'AnswerWithQuestion',
    },
    {
        path: '/Answer',
        component: Answer,
        key: 'Answer',
    },
    {
        path: '/Notifications',
        component: Notifications,
        key: 'Notifications',
    },
    {
        path: '/Spaces',
        component: Spaces,
        key: 'Spaces',
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
