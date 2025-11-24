import { io } from 'socket.io-client';

const adminBase = process.env.ADMIN_BASE || 'http://localhost:5000';
const ownerBase = process.env.OWNER_BASE || 'http://localhost:5001';

console.log('[test] adminBase=', adminBase, 'ownerBase=', ownerBase);

const adminSocket = io(adminBase, { transports: ['websocket', 'polling'] });
const ownerSocket = io(ownerBase, { transports: ['websocket', 'polling'] });

adminSocket.on('connect', () => console.log('[admin socket] connected', adminSocket.id));
ownerSocket.on('connect', () => console.log('[owner socket] connected', ownerSocket.id));

adminSocket.on('connect_error', (e) => console.error('[admin socket] connect_error', e && e.message));
ownerSocket.on('connect_error', (e) => console.error('[owner socket] connect_error', e && e.message));

adminSocket.on('theme:update', (p) => console.log('[admin socket] theme:update', p));
ownerSocket.on('theme:update', (p) => console.log('[owner socket] theme:update', p));

// keep process alive for 60s so we can trigger updates
setTimeout(() => {
  console.log('[test] finished waiting, closing sockets and exiting');
  adminSocket.close();
  ownerSocket.close();
  process.exit(0);
}, 60000);
