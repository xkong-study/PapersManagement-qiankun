# qiankun (React+Umi.js)

![](https://x.imgs.ovh/x/2023/08/18/64de8f3c82f16.png)
## foreword
qiankun microservices aggregate multiple different systems into one system, and each system can be deployed and run independently, which is suitable for large teams and large front-end projects.

### Realize the function:

    * Introduce technology stack (React\umi.js)
    * The practice of background management system (Ant Design Pro) multi-tab page caching in qiankun environment
    * Dependency sharing --- sharing of common packages react, react-dom, moment, antd, etc.) between the main and sub-applications
    * Common resources --- shared tools util, components, configurations synchronized in multiple projects


## Project structure

|          Project           |       technology stack        | Port |       
| :------------------------: | :------------------: | :--: 
|    main-react    |    Ant Design Pro    | 5001 |    
|    app1-react     |    Ant Design Pro    | 5002 |     
|    app2-react    |    Ant Design Pro    | 5003 |      
|    qiankun-common |      TypeScript      |      | 



### Project optimization

#### 1.Resource sharing
    Solving the problem of resource sharing can improve the maintainability of the project, otherwise components or tools shared by multiple systems will be very laborious to maintain.
    
    1. import { commonUtil } from 'qiankun-common';
       util.qiankunJump('/xxx')


 ### Project start

    1. enter main-react
        npm install
        npm run start
    2. enter app1-react
        npm install
        npm run start
    3. enter app2-react
        npm install
        npm run start
