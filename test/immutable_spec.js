import Lab from 'lab';
import {List, Map} from 'immutable';
import labToTDD from './lab-chai-helper';

const {lab, describe, it, expect} = labToTDD(Lab);
exports.lab = lab;

describe('immutability', () => {

    describe('a number', () => {
        function increment(currentState) {

          return currentState + 1;
        };

        it('is immutable', (done) => {
            let state = 42;
            let nextState = increment(state);

            expect(nextState).to.equal(43);
            expect(state).to.equal(42);

            done();
        });
    });

    describe('A List', () => {

        function addMovie(currentState, movie) {
            return currentState.push(movie);
        };

        it('is immutable', (done) => {

            let state = List.of('Transporter', '28 Days', 'Lord of the Rings');
            let nextState = addMovie(state, 'The Shinning');

            expect(nextState).to.equal(List.of(
                'Transporter',
                '28 Days',
                'Lord of the Rings',
                'The Shinning'
            ));
            expect(state).to.equal(List.of(
                'Transporter',
                '28 Days',
                'Lord of the Rings'
            ));

            done();
        });
    });

    describe('a tree', () => {

        function addMovie(currentState, movie) {

            return currentState.update('movies', movies => movies.push(movie));
        };

        it('is immutable', (done) => {

            let state = Map({
                movies: List.of('Transporter', '28 Days', 'Lord of the Rings')
            });

            let nextState = addMovie(state, 'The Shinning');

            expect(nextState).to.equal(Map({
                movies: List.of(
                    'Transporter',
                    '28 Days',
                    'Lord of the Rings',
                    'The Shinning'
                )
            }));
            expect(state).to.equal(Map({
                movies: List.of(
                    'Transporter',
                    '28 Days',
                    'Lord of the Rings'
                )
            }));

            done();
        });
    });
});
