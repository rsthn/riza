
import { signal, expr, watch } from 'riza';

export const userData = signal({ });

export const authStatus = signal(0);
authStatus.UNDEF = 0;
authStatus.AUTH = 1;
authStatus.NOT_AUTH = 2;
authStatus.INITIAL = 3;
authStatus.ERROR = 4;
