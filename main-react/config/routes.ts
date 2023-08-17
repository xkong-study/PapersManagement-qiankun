export default [
  {
    path: '/api',
    component: '../layouts/BasicLayout',
    routes: [
      {
        name:'HomePage',
        path: '/api/welcome',
        icon: 'smile',
        component: './Welcome',
      },
      {
        name: 'Paper Comment',
        path: '/api/main',
        icon: 'smile',
        component: './One',
         routes:[
          {
            name:'Paper Overview',
            path: '/api/main/one',
            icon: 'smile',
            component: './One',
          },
           {
             path: '/api/main/two',
             component: './Two',
           },
        ]
      },
      {
        name:'Paper search',
        icon:'check-circle',
        path: '/api/childOneMenu',
        routes:[
          {
            name:'Paper',
            path: '/api/childOneMenu/pageTwo',
            microName:'app1',
          },
          {
            path: '/api/childOneMenu/pageThree',
            microName:'app1',
          },
          {
            path: '/api/childOneMenu/pageFour',
            microName:'app1',
          },
        ]
      },
      {
        name:'Todo list',
        path: '/api/childTwoPageFour',
        icon: 'profile',
        microName:'app2',
      },
      {
        name:'Upload file management',
        icon:'profile',
        path: '/api/childTwoMenu',
        routes:[
          {
            name:'Upload file',
            path: '/api/childTwoMenu/pageFive',
            microName:'app2',
          },
          {
            name:'File list',
            path: '/api/childTwoMenu/pageSix',
            microName:'app2',
          },
          {
            name:'Data management',
            path: '/api/childTwoMenu/pageSeven',
            microName:'app2',
          }
        ]
      },
      {
        name:'Home',
        path: '/api/childOnePageOne',
        icon: 'check-circle',
        microName:'app1',
        microApp:'app1'
      },
    ],
  },
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './User/login',
      },
    ],
  },
];
