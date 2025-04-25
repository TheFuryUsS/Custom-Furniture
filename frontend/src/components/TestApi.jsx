import { useEffect } from 'react';
import api from '../lib/api'; //http://localhost:3000

export default function TestApi() {
  useEffect(() => {
    api.get('/users')
      .then(res => console.log(res.data))
      .catch(err => console.error('Error al cridar /users:', err));
  }, []);

  return <div>Revisar consola per veure resposta de /users</div>;
}