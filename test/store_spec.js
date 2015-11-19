import Lab from 'lab';
import labToTDD from './lab-chai-helper';
import {Map, fromJS} from 'immutable';

import makeStore from '../lib/store';

const {lab, describe, it, expect} = labToTDD(Lab);
exports.lab = lab;

describe('store', () => {

    it('is a Redux store configured with the correct reducer', (done) => {

        const store = makeStore();
        expect(store.getState()).to.equal(Map());

        store.dispatch({
            type: 'SET_ENTRIES',
            entries: ['Batman', 'Superman']
        });
        expect(store.getState()).to.equal(fromJS({
            entries: ['Batman', 'Superman']
        }));

        done();
    });
});

