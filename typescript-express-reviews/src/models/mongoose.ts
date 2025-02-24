import mongoose from 'mongoose';
import { driver } from 'stargate-mongoose';

const mongooseInstance = mongoose.setDriver(driver);
mongooseInstance.set('autoCreate', false);
mongooseInstance.set('autoIndex', false);

export default mongooseInstance;
