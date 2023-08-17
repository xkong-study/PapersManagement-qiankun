export default [
  {
    path: '/api',
    component: '../layouts/BasicLayout',
    routes:[
      {
        name:'Home',
        path: '/api/childOnePageOne',
        icon: 'smile',
        component: './One',
      },
      {
        name: 'Paper',
        path: '/api/childOneMenu',
        routes:[
          {
            name: 'Paper',
            path: '/api/childOneMenu/pageTwo',
            component: './Two',
          },
          {
            name: 'Paper Detail',
            path: '/api/childOneMenu/pageThree',
            component: './Three',
          },
          {
            name: 'Paper Classify',
            path: '/api/childOneMenu/pageFour',
            component: './Four',
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
