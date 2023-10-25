import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { SettingDrawer } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RunTimeLayoutConfig } from 'umi';
import { history, Link } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';
import defaultSettings from '../config/defaultSettings';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/user/login';
console.log(isDev);
/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};

// /**
//  * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
//  * 启用方式:有 src/app.ts 并且导出 getInitialState 方法时启用。
//  * 本插件不可直接使用，必须搭配 @umijs/plugin-model 一起使用。
//  * 返回值会作为全局共享的数据。Layout 插件、Access 插件以及用户都可以通过 useModel('@@initialState')
//  * initialState, loading, error, refresh, setInitialState
//  * getInitialState 的返回值，getInitialState 是否处于 loading 状态，getInitialState throw Error ，重新执行 getInitialState 方法
//  * */
// export async function getInitialState(): Promise<{
//   settings?: Partial<LayoutSettings>;
//   currentUser?: API.CurrentUser;
//   loading?: boolean;
//   fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
// }> {
//   const fetchUserInfo = async () => {
//     try {
//       const msg = await queryCurrentUser();
//       return msg.data; //返回一个数据，全局使用
//     } catch (error) {
//       history.push(loginPath); //获取数据失败，返回登录页
//     }
//     return undefined;
//   };
//   // 如果不是登录页面，执行
//   if (history.location.pathname !== loginPath) {
//     const currentUser = await fetchUserInfo();
//     return {
//       fetchUserInfo,
//       currentUser,
//       settings: defaultSettings,
//     };
//   }
//   return {
//     fetchUserInfo,
//     settings: defaultSettings,
//   };
// }

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer />,

    // onPageChange 函数用于在页面切换时进行处理。它首先获取当前的路由位置 location，
    // 然后判断如果用户未登录且当前路径不是登录路径 loginPath，则会重定向到登录页面。
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      // if (!initialState?.currentUser && location.pathname !== loginPath) {
      //   history.push(loginPath);
      // }
    },
    links: isDev
      ? [
          <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
          <Link to="/~docs" key="docs">
            <BookOutlined />
            <span>业务组件文档</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children, props) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {!props.location?.pathname?.includes('/login') && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              // onSettingChange={(settings) => {
              //   setInitialState((preInitialState) => ({
              //     ...preInitialState,
              //     settings,
              //   }));
              // }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};
