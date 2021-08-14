import { Router } from 'express';

import appointmentsRouter from '@modules/appointments/infra/http/routes/appointments.routes';
import userRouter from '@modules/users/infra/http/routes/users.routes';
import sessionRouter from '@modules/users/infra/http/routes/session.routes';
import passwordRouter from '@modules/users/infra/http/routes/password.routes';
import profileRouter from '@modules/users/infra/http/routes/profile.routes';
import providerRouter from '@modules/appointments/infra/http/routes/providers.routes';

const routes = Router();

routes.use('/appointments', appointmentsRouter);
routes.use('/users', userRouter);
routes.use('/sessions', sessionRouter);
routes.use('/password', passwordRouter);
routes.use('/profile', profileRouter);
routes.use('/provider', providerRouter);

export default routes;
