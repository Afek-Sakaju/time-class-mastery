const Stopper = require('../stopper');

describe('Stopper class tests', () => {
    test('inheretance tests', () => {
        const stopper1 = new Stopper();

        stopper1.addSeconds(5);
        expect(stopper1.seconds).toBe(5);

        stopper1.addMinutes(10);
        expect(stopper1.minutes).toBe(10);

        stopper1.addHours(3);
        expect(stopper1.hours).toBe(3);

        stopper1.addHours(100);
        expect(stopper1.totalSeconds).toBe(Stopper.MAX_STOPPER_SECONDS);

        stopper1.reset();
        expect(stopper1.totalSeconds).toBe(0);

        const stopper2 = new Stopper();
        stopper2.addHours(10);
        stopper2.addMinutes(10);
        stopper2.addSeconds(10);
        // stopper2 - 10:10:10

        stopper1.addTime(stopper2);
        /* the test written the first time to make sure the addTime method works
        the second time i called addTime just to make sure i can test "stopper1" 
        well, because he was reseted after subTime */
        expect(stopper1.totalSeconds).toBe(stopper2.totalSeconds);

        stopper1.subTime(stopper2);
        expect(stopper1.totalSeconds).toBe(0);

        stopper1.addTime(stopper2);
        expect(stopper1.totalSeconds).toBe(stopper2.totalSeconds);

        stopper1.subSeconds(5);
        expect(stopper1.seconds).toBe(5);

        stopper1.subMinutes(9);
        expect(stopper1.minutes).toBe(1);

        stopper1.subHours(3);
        expect(stopper1.hours).toBe(7);

        stopper1.subHours(200);
        expect(stopper1.totalSeconds).toBe(Stopper.MIN_STOPPER_SECONDS);

        stopper1.hours = 11;
        expect(stopper1.hours).toBe(11);

        stopper1.minutes = 11;
        expect(stopper1.minutes).toBe(11);

        stopper1.seconds = 11;
        expect(stopper1.seconds).toBe(11);

        stopper1.subTime(stopper2);
        /* stopper1 - 11:11:11
        stopper2 is - 10:10:10
        11:11:11 - 10:10:10 = 01:01:01 (3661 totalSeconds) */
        expect(stopper1.totalSeconds).toBe(3661);

        stopper1.resetHours();
        expect(stopper1.hours).toBe(0);

        stopper1.resetMinutes();
        expect(stopper1.minutes).toBe(0);

        stopper1.resetSeconds();
        expect(stopper1.seconds).toBe(0);

        expect(stopper1.toString()).toBe('00:00:00');
    });

    describe('start & pause & stop & reset methods tests', () => {
        beforeAll(() => {
            jest.useFakeTimers();
        });

        afterEach(() => {
            jest.runOnlyPendingTimers();
            /* jest had bug with running some of the tests.
            the solution here was to change the function 
            "jest.runAllTimers()" to "jest.runOnlyPendingTimers()" */
        });

        test.each([
            [50, '00:00:50'],
            [30, '00:00:30'],
            [3600, '01:00:00'],
            [0, '00:00:00'],
        ])(
            'stopper created, using start method, after %s seconds returns %s',
            (timeoutSeconds, result) => {
                const stopper = new Stopper();
                stopper.start();
                expect(stopper.toString()).toBe('00:00:00');

                setTimeout(() => {
                    expect(stopper.toString()).toBe(result);
                }, timeoutSeconds * 1000);
            }
        );

        test.each([
            [70, '00:01:10'],
            [10, '00:00:10'],
            [3600, '01:00:00'],
            [0, '00:00:00'],
        ])(
            'stopper created, autoStart set to true, after %s seconds returns %s',
            (timeoutSeconds, result) => {
                const stopper = new Stopper();
                stopper.start();
                expect(stopper.toString()).toBe('00:00:00');

                setTimeout(() => {
                    expect(stopper.toString()).toBe(result);
                }, timeoutSeconds * 1000);
            }
        );

        test.each([[70], [60], [500], [20]])(
            'stopper created, autoStart set to false by default, after %s seconds returns 00:00:00',
            (timeoutSeconds) => {
                const stopper = new Stopper();
                expect(stopper.toString()).toBe('00:00:00');

                setTimeout(() => {
                    expect(stopper.toString()).toBe('00:00:00');
                }, timeoutSeconds * 1000);
            }
        );

        test.each([
            [70, '00:01:10'],
            [10, '00:00:10'],
            [3600, '01:00:00'],
            [2, '00:00:02'],
        ])(
            'stopper started counting, after %s seconds, using pause method then returns %s',
            (timeoutSeconds, result) => {
                const stopper = new Stopper();
                expect(stopper.toString()).toBe('00:00:00');
                stopper.start();

                setTimeout(() => {
                    stopper.pause();

                    setTimeout(() => {
                        // to make sure the pause method indeed paused the interval
                        expect(stopper.toString()).toBe(result);
                    }, 10000);
                }, timeoutSeconds * 1000);
            }
        );

        //[3600, 5, '01:00:05'],
        //[5, 5, '00:00:10'],

        test.each([
            [70, 5, '00:01:15'],
            [10, 5, '00:00:15'],
        ])(
            'stopper started counting, after %s seconds using pause method then start again for another %s seconds, returns %s',
            (timeoutSeconds1, timeoutSeconds2, result) => {
                const stopper = new Stopper();
                expect(stopper.toString()).toBe('00:00:00');
                stopper.start();

                setTimeout(() => {
                    stopper.pause();
                    stopper.start();

                    setTimeout(() => {
                        expect(stopper.toString()).toBe(result);
                        /* to make sure the pause method indeed stopped the interval
                        and that he didn't changed the totalSeconds of the stopper*/
                    }, timeoutSeconds2 * 1000);
                }, timeoutSeconds1 * 1000);
            }
        );

        test.each([[70], [10], [3600], [2]])(
            'stopper started counting, after %s seconds using reset method, waits for 5s, returns 00:00:05',
            (timeoutSeconds) => {
                const stopper = new Stopper();
                expect(stopper.toString()).toBe('00:00:00');
                stopper.start();

                setTimeout(() => {
                    stopper.reset();

                    setTimeout(() => {
                        // to make sure that reset method doesn't stop the interval
                        expect(stopper.toString()).toBe('00:00:02');
                    }, 2000);
                }, timeoutSeconds * 1000);
            }
        );

        test.each([
            [70, '00:01:10'],
            [10, '00:00:10'],
            [3600, '01:00:00'],
            [100, '00:01:40'],
            [1000000, '23:59:59'],
        ])(
            'stopper started counting, after %s seconds using stop method, returns %s',
            (timeoutSeconds, result) => {
                const stopper = new Stopper();
                expect(stopper.toString()).toBe('00:00:00');
                stopper.start();

                setTimeout(() => {
                    stopper.stop();

                    setTimeout(() => {
                        // to make sure the stop method indeed stopped the interval
                        expect(stopper.toString()).toBe(result);
                    }, 5000);
                }, timeoutSeconds * 1000);
            }
        );

        test.each([[70], [105], [3600], [20], [99999990]])(
            'stopper started counting, after %s seconds using stop method, then start again, stopper should reset',
            (timeoutSeconds) => {
                const stopper = new Stopper();
                expect(stopper.toString()).toBe('00:00:00');
                stopper.start();

                setTimeout(() => {
                    stopper.stop();
                    stopper.start();

                    // to make sure the stop method resets the time after the next start
                    expect(stopper.toString()).toBe('00:00:00');
                }, timeoutSeconds * 1000);
            }
        );
    });

    test('invalid cases - inheritance of parameter validation', () => {
        const stopper = new Stopper();

        expect(() => {
            stopper.hours = [1, 2, 3];
        }).toThrow(Error('Time element must be a valid number'));

        expect(() => {
            stopper.minutes = 'string';
        }).toThrow(Error('Time element must be a valid number'));

        expect(() => {
            stopper.seconds = ['a', 'b', 'c'];
        }).toThrow(Error('Time element must be a valid number'));
    });
});
