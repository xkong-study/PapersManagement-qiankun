export default [
  {
    path: '/api',
    component: '../layouts/BasicLayout',
    routes:[
      {
        name:'Todo list',
        path: '/api/childTwoPageFour',
        icon: 'smile',
        component: './Four',
      },
      {
        name: 'Upload file management',
        path: '/api/childTwoMenu',
        routes:[
          {
            name: 'Upload file',
            path: '/api/childTwoMenu/pageFive',
            component: './Five',
          },
          {
            name: 'File list',
            path: '/api/childTwoMenu/pageSix',
            component: './Six',
          },
          {
            name: 'File management',
            path: '/api/childTwoMenu/pageSeven',
            component: './Seven',
          },
        ]
      },

      {
        path: '/api/welcome',
        icon: 'smile',
        component: './Welcome',
      },
    ]
  },

];
