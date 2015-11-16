import Chai from 'chai';
import ChaiImmutable from 'chai-immutable';

Chai.use(ChaiImmutable);

export default function labToTDD(Lab) {
    const lab = Lab.script();

    return {
        lab: lab,
        describe: lab.describe,
        it: lab.it,
        before: lab.before,
        after: lab.after,
        expect: Chai.expect
    };
};
