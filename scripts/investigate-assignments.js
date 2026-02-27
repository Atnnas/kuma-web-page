
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function run() {
    await mongoose.connect(process.env.MONGODB_URI);
    const RoutineSchema = new mongoose.Schema({}, { strict: false });
    const Routine = mongoose.models.Routine || mongoose.model('Routine', RoutineSchema, 'routines');
    const UserSchema = new mongoose.Schema({}, { strict: false });
    const User = mongoose.models.User || mongoose.model('User', UserSchema, 'users');

    const samantha = await User.findOne({ name: /Samantha/i });
    if (samantha) {
        console.log('Samantha ID:', samantha._id.toString());
    }

    const allRoutines = await Routine.find({});
    const assigned = allRoutines.filter(r => r.allowedUsers && r.allowedUsers.length > 0);

    console.log('Total assigned routines:', assigned.length);

    for (const r of assigned) {
        console.log(`- Routine: "${r.title}" | Visibility: ${r.visibility}`);
        for (const uid of r.allowedUsers) {
            const user = await User.findById(uid);
            console.log(`  -> Assigned to: ${user ? user.name : 'Unknown'} (${uid.toString()})`);
        }
    }

    process.exit();
}
run();
