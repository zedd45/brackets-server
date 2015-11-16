import Lab from 'lab';
import {Map, fromJS} from 'immutable';
import labToTDD from './lab-chai-helper';
import reducer from '../lib/reducer';

const {lab, describe, it, expect} = labToTDD(Lab);
exports.lab = lab;

describe('reducer', () => {

    it('handles SET_ENTRIES', (done) => {

        const initialState = Map();
        const action = { type: 'SET_ENTRIES', entries: ['Batman'] };
        const nextState = reducer(initialState, action);

        expect(nextState).to.equal(fromJS({
            entries: ['Batman']
        }));

        done();
    });

    it('handles NEXT', (done) => {

        const initialState = fromJS({
            entries: ['Batman', 'Superman']
        });
        const action = { type: 'NEXT' };
        const nextState = reducer(initialState, action);

        expect(nextState).to.equal(fromJS({
            vote: {
                pair: ['Batman', 'Superman']
            },
            entries: []
        }));

        done();
    });

    it('handles VOTE', (done) => {

        const initialState = fromJS({
            vote: {
                pair: ['Batman', 'Superman']
            },
            entries: []
        });
        const action = { type: 'VOTE', entry: 'Batman' };
        const nextState = reducer(initialState, action);

        expect(nextState).to.equal(fromJS({
            vote: {
                pair: ['Batman', 'Superman'],
                tally: { Batman: 1 }
            },
            entries: []
        }));

        done();
    });

    it('has an initial state', (done) => {

        const action = { type: 'SET_ENTRIES', entries: ['Batman'] };
        const nextState = reducer(undefined, action);
        expect(nextState).to.equal(fromJS({
            entries: ['Batman']
        }));

        done();
    });

    it('can be used with reduce', (done) => {

        const actions = [
            { type: 'SET_ENTRIES', entries: ['Batman', 'Superman'] },
            { type: 'NEXT' },
            { type: 'VOTE', entry: 'Batman' },
            { type: 'VOTE', entry: 'Superman' },
            { type: 'VOTE', entry: 'Batman' },
            { type: 'NEXT' }
        ];
        const finalState = actions.reduce(reducer, Map());

        expect(finalState).to.equal(fromJS({
            winner: 'Batman'
        }));

        done();
    });
});
