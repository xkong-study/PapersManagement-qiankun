 import RightContent from '@/components/GlobalHeader/RightContent';
 import TabPages from '@/components/TabPages';
 import type { ConnectState } from '@/models/connect';
 import Authorized from '@/utils/Authorized';
 import { GithubOutlined } from '@ant-design/icons';
 import type {
   BasicLayoutProps as ProLayoutProps, MenuDataItem,
   Settings
 } from '@ant-design/pro-layout';
 import ProLayout, { DefaultFooter } from '@ant-design/pro-layout';
 import { getMatchMenu } from '@umijs/route-utils';
 import { Button, Result } from 'antd';
 import React, { useEffect, useMemo, useRef } from 'react';
 import type { Dispatch } from 'umi';
 import { connect, history, Link } from 'umi';
 import logo from '../assets/img_2.png';

 const noMatch = (
   <Result
     status={403}
     title="403"
     subTitle="Sorry, you are not authorized to access this page."
     extra={
       <Button type="primary">
         <Link to="/user/login">Go Login</Link>
       </Button>
     }
   />
 );
 export type BasicLayoutProps = {
   breadcrumbNameMap: Record<string, MenuDataItem>;
   route: ProLayoutProps['route'] & {
     authority: string[];
   };
   settings: Settings;
   dispatch: Dispatch;
 } & ProLayoutProps;
 export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
   breadcrumbNameMap: Record<string, MenuDataItem>;
 };

 const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] =>
   menuList.map((item) => {
     const localItem = {
       ...item,
       children: item.children ? menuDataRender(item.children) : undefined,
     };
     return Authorized.check(item.authority, localItem, null) as MenuDataItem;
   });

 const defaultFooterDom = (
   <DefaultFooter
     copyright={`${new Date().getFullYear()} Produced by Ant Group Experience Technology Department`}
     links={[
       {
         key: 'Paper Management System',
         title: 'Paper Management System',
         href: '',
         blankTarget: true,
       },
       {
         key: 'Xiangrui Kong 22301733',
         title: 'Xiangrui Kong 22301733',
         href: 'https://github.com/xkong-study',
         blankTarget: true,
       },
     ]}
   />
 );

 const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
   const {
     dispatch,
     children,
     settings,
     location = {
       pathname: '/',
     },
   } = props;

   const menuDataRef = useRef<MenuDataItem[]>([]);

   const handleMenuCollapse = (payload: boolean): void => {
     if (dispatch) {
       dispatch({
         type: 'global/changeLayoutCollapsed',
         payload,
       });
     }
   };
   // get children authority
   const authorized = useMemo(
     () =>
       getMatchMenu(location.pathname || '/', menuDataRef.current).pop() || {
         authority: undefined,
       },
     [location.pathname],
   );


   return (
     <ProLayout
       {...props}
       {...settings}
       logo={logo}
       title="Paper Manager"
       navTheme="light"
       onCollapse={handleMenuCollapse}
       onMenuHeaderClick={() => history.push('/welcome')}
       menuItemRender={(menuItemProps, defaultDom) => {
         if (
           menuItemProps.isUrl ||
           !menuItemProps.path ||
           location.pathname === menuItemProps.path
         ) {
           return defaultDom;
         }
         return <Link to={menuItemProps.path}>{defaultDom}</Link>;
       }}
       breadcrumbRender={(routers = []) => [

         ...routers,
       ]}
       itemRender={(route, params, routes, paths) => {
         const first = routes.indexOf(route) === 0;
         return first ? (
           <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
         ) : (
           <span>{route.breadcrumbName}</span>
         );
       }}
       footerRender={() => {
         if (settings.footerRender || settings.footerRender === undefined) {
           return defaultFooterDom;
         }
         return null;
       }}
       menuDataRender={menuDataRender}
       rightContentRender={() => <RightContent />}
       postMenuData={(menuData) => {
         menuDataRef.current = menuData || [];
         return menuData || [];
       }}
       waterMarkProps={{
         content: 'Paper management system',
         fontColor: 'rgba(24,144,255,0.15)',
       }}
     >
       <Authorized authority={authorized!.authority} noMatch={noMatch}>
       {/* <PageTabs
             currentPathName = { location.pathname }
             routes = { props.route.routes }
           /> */}
       <TabPages {...props} maxTab="5" remberRefresh={false} animated={false} homePage="/welcome" errorPage="/404"/>
         {/* {children} */}
       </Authorized>
     </ProLayout>
   );
 };

 export default connect(({ global, settings }: ConnectState) => ({
   collapsed: global.collapsed,
   settings,
 }))(BasicLayout);
