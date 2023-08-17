import request from '@/utils/request';

export async function query(): Promise<any> {
  return request('/api/users');
}

export async function queryCurrent(): Promise<any> {
  // Simulate a delay with a Promise
  return new Promise((resolve) => {
    setTimeout(() => {
      // Resolve the promise with the fake data
      resolve({
        avatar: 'https://www.creativefabrica.com/wp-content/uploads/2021/10/18/Comic-Cartoon-Cat-Sticker-17-Graphics-18955507-1.jpg',
        name: 'Admin User',
        title: 'Administrator',
        group: 'Admin Group',
        signature: 'Admin Signature',
        tags: [
          { key: 'admin', label: 'Admin' },
        ],
        userid: 'admin',
        unreadCount: 5,
      });
    }, 500); // 500ms delay
  });
}


export async function queryNotices(): Promise<any> {
  return request('/api/notices');
}
