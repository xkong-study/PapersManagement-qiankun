import { Route, Switch } from 'react-router-dom';
import Home from './Home.tsx';
import Messages from './Messages.tsx';
import Info from './Info.tsx';
import Account from './Account.tsx';
import Save from './Save.tsx';
import { useLocation, useParams } from 'react-router-dom';

const MainContent: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');
  console.log(id)
  return (
    <div id="container" style={{marginLeft:"5px"}}>
      {(id === '/home'||id===null) && <Home/>}
      {id === '/account' && <Account />}
      {id === '/info' && <Info />}
      {id === '/message' && <Messages />}
      {id === '/save' && <Save />}
    </div>
  );
};

export default MainContent;
