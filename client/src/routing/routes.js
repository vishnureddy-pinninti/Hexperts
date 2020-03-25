import Home from '../pages/Home';
import Question from '../pages/Question';
import Topic from '../pages/Topic';
import Profile from '../pages/Profile';
import Notifications from '../pages/Notifications';
import Answer from '../pages/Answer';
import Blogs from '../pages/BlogsHome';
import Blog from '../pages/Blog';
import AnswerWithQuestion from '../pages/AnswerWithQuestion';
import Post from '../pages/Post';
import Search from '../pages/Search';
import CommentPage from '../pages/Comment';

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
        path: '/comment/:commentId',
        component: CommentPage,
        key: 'Comment',
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
        path: '/Blog/:blogId',
        component: Blog,
        key: 'Blog',
    },
    {
        path: '/Post/:postId',
        component: Post,
        key: 'Post',
    },
    {
        path: '/Blogs',
        component: Blogs,
        key: 'Blogs',
    },
    {
        path: '/Search/:query',
        component: Search,
        key: 'PoSearchst',
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
