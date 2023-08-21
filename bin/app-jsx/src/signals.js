
import { signal, expr, watch } from 'riza';

export const authStatus = signal(0);
authStatus.UNDEF = 0;
authStatus.AUTH = 1;
authStatus.NOT_AUTH = 2;
authStatus.INITIAK = 3;
