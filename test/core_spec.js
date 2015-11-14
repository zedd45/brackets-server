import {List, Map} from 'immutable';
import Lab from 'lab';
import Chai from 'chai';
import ChaiImmutable from 'chai-immutable';

import {setEntries, next, vote} from '../lib/core';

Chai.use(ChaiImmutable);
const lab = exports.lab = Lab.script();
const describe = lab.describe;
const it = lab.it;
const before = lab.before;
const after = lab.after;
const expect = Chai.expect;

describe('application logic', () => {

    describe('setEntries', () => {

        it('adds the entries to the state', (done) => {

            const state = Map();
            const entries = List.of('Batman', 'Superman');
            const nextState = setEntries(state, entries);
            expect(nextState).to.equal(Map({
                entries: List.of('Batman', 'Superman')
            }));

            done();
        });

        it('converts to immutable', (done) => {

            const state = Map();
            const entries = ['Batman', 'Superman'];
            const nextState = setEntries(state, entries);
            expect(nextState).to.equal(Map({
                entries: List.of('Batman', 'Superman')
            }));

            done();
        });
    });

    describe('next', () => {

        it('takes the next two entries under vote', (done) => {

            const state = Map({
                entries: List.of('Batman', 'Superman', 'Joker')
            });
            const nextState = next(state);
            expect(nextState).to.equal(Map({
                vote: Map({
                    pair: List.of('Batman', 'Superman')
                }),
                entries: List.of('Joker')
            }));

            done();
        });
    });

    describe('vote', () => {

        it('create a tally for the voted entry', (done) => {

            const state = Map({
                vote: Map({
                    pair: List.of('Batman', 'Superman')
                }),
                entries: List()
            });
            const nextState = vote(state, 'Batman');
            expect(nextState).to.equal(Map({
                vote: Map({
                    pair: List.of('Batman', 'Superman'),
                    tally: Map({
                        'Batman': 1
                    })
                }),
                entries: List()
            }));

            done();
        });

        it('adds to existing tally for the voted entry', (done) => {

            const state = Map({
                vote: Map({
                    pair: List.of('Batman', 'Superman'),
                    tally: Map({
                        'Batman': 3,
                        'Superman': 2
                    })
                }),
                entries: List()
            });
            const nextState = vote(state, 'Batman');
            expect(nextState).to.equal(Map({
                vote: Map({
                    pair: List.of('Batman', 'Superman'),
                    tally: Map({
                        'Batman': 4,
                        'Superman': 2
                    })
                }),
                entries: List()
            }));

            done();
        });

        it('puts winner of current vote back to entries', (done) => {

            const state = Map({
                vote: Map({
                    pair: List.of('Batman', 'Superman'),
                    tally: Map({
                        'Batman': 4,
                        'Superman': 2
                    })
                }),
                entries: List.of('Joker', 'Scarecrow', 'Lex')
            });

            const nextState = next(state);
            expect(nextState).to.equal(Map({
                vote: Map({
                    pair: List.of('Joker', 'Scarecrow')
                }),
                entries: List.of('Lex', 'Batman')
            }));

            done();
        });

        it('puts both from tied vote back to entries', (done) => {

            const state = Map({
                vote: Map({
                    pair: List.of('Batman', 'Superman'),
                    tally: Map({
                        'Batman': 3,
                        'Superman': 3
                    })
                }),
                entries: List.of('Joker', 'Scarecrow', 'Lex')
            });

            const nextState = next(state);
            expect(nextState).to.equal(Map({
                vote: Map({
                    pair: List.of('Joker', 'Scarecrow')
                }),
                entries: List.of('Lex', 'Batman', 'Superman')
            }));

            done();
        });

        it('marks winner when just one entry left', (done) => {

            const state = Map({
                vote: Map({
                    pair: List.of('Batman', 'Superman'),
                    tally: Map({
                        'Batman': 4,
                        'Superman': 2
                    })
                }),
                entries: List()

            });

            const nextState = next(state);
            expect(nextState).to.equal(Map({
                winner: 'Batman'
            }));

            done();
        });
    });
});
