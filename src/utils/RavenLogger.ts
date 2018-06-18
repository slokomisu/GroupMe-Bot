import * as Raven from 'raven';

Raven.config(process.env.DSN).install();

export default Raven;
